/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนสั่งซื้อ (Please Login)' }, { status: 401 })
    }

    const body = await request.json()
    const { items, totalPrice } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 🔥 ใช้ Transaction: ทำทุกอย่างพร้อมกัน (เช็คของ -> ตัดของ -> สร้างบิล)
    // ถ้าขั้นตอนไหนล้มเหลว มันจะยกเลิกทั้งหมด (Rollback)
    const newOrder = await prisma.$transaction(async (tx) => {
      
      // 1. วนลูปเช็คสินค้าและตัดสต็อกทีละชิ้น
      for (const item of items) {
        // ดึงข้อมูลสินค้าล่าสุดจาก DB (เผื่อมีคนอื่นแย่งซื้อตัดหน้า)
        const product = await tx.product.findUnique({
          where: { id: item.id }
        })

        if (!product) {
          throw new Error(`สินค้า "${item.name}" ไม่พบในระบบ`)
        }

        const buyQty = item.quantity || 1 // จำนวนที่จะซื้อ

        // 🛑 เช็คสต็อก (Logic Overselling)
        if (product.stock < buyQty) {
          throw new Error(`ขออภัย! สินค้า "${item.name}" มีสินค้าไม่พอ (เหลือ ${product.stock} ชิ้น)`)
        }

        // ✂️ ตัดสต็อก
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: buyQty // ลดจำนวนลงตามที่ซื้อ
            }
          }
        })
      }

      // 2. สร้าง Order เมื่อตัดของผ่านหมดแล้ว
      return await tx.order.create({
        data: {
          userId: user.id,
          total: totalPrice,
          status: 'PAID', // สมมติว่าจ่ายเงินสำเร็จแล้ว
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity || 1, // บันทึกจำนวนจริงที่ซื้อ
              price: item.price
            }))
          }
        }
      })
    })

    return NextResponse.json({ success: true, orderId: newOrder.id })

  } catch (error: any) {
    console.error("Checkout Error:", error)
    // ส่งข้อความ Error กลับไปแจ้งเตือนหน้าเว็บ (เช่น "ของหมด")
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 })
  }
}