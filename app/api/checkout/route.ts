/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนสั่งซื้อ' }, { status: 401 })
    }

    const body = await request.json()
    const { items, totalPrice, addressId } = body // 👈 รับ addressId จาก Frontend

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { addresses: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 1. หาที่อยู่ที่จะใช้ส่งของ
    let shippingAddress = user.addresses.find(a => a.id === addressId)
    // ถ้าไม่ส่งมา ให้ใช้ Default หรือตัวแรก (Fallback)
    if (!shippingAddress) {
      shippingAddress = user.addresses.find(a => a.isDefault) || user.addresses[0]
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: 'กรุณาเพิ่มที่อยู่จัดส่งในหน้าข้อมูลส่วนตัวก่อนครับ' }, { status: 400 })
    }

    // 2. เริ่ม Transaction: ตัดสต็อก + สร้าง Order
    const newOrder = await prisma.$transaction(async (tx) => {
      
      // A. เช็คสต็อกและตัดของ
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.id } })
        if (!product) throw new Error(`สินค้า "${item.name}" ไม่พบในระบบ`)
        
        const buyQty = item.quantity || 1
        // เช็คของหมด
        if (product.stock < buyQty) {
          throw new Error(`ขออภัย! สินค้า "${item.name}" สินค้าหมด (เหลือ: ${product.stock})`)
        }

        // ตัดสต็อก
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: buyQty } }
        })
      }

      // B. สร้าง Order พร้อม Snapshot ที่อยู่ 🔥
      return await tx.order.create({
        data: {
          userId: user.id,
          total: totalPrice,
          status: 'PENDING', // รอจ่ายเงิน
          
          // 🔥 บันทึก Snapshot ที่อยู่ (สำคัญมากสำหรับ Audit)
          shippingName: shippingAddress.name,
          shippingPhone: shippingAddress.phone,
          shippingAddress: `${shippingAddress.houseNumber}, ${shippingAddress.subdistrict}, ${shippingAddress.district}, ${shippingAddress.province}`,
          shippingZipcode: shippingAddress.zipcode,

          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity || 1,
              price: item.price
            }))
          }
        }
      })
    })

    return NextResponse.json({ success: true, orderId: newOrder.id })

  } catch (error: any) {
    console.error("Checkout Error:", error)
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 })
  }
}