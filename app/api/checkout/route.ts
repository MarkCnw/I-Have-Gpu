/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { items, totalPrice, addressId, taxInfo } = body // 👈 รับ taxInfo

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { addresses: true }
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // ... (Logic หา Shipping Address เหมือนเดิม) ...
    let shippingAddress = user.addresses.find(a => a.id === addressId) || user.addresses.find(a => a.isDefault) || user.addresses[0]
    if (!shippingAddress) return NextResponse.json({ error: 'No shipping address' }, { status: 400 })

    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. ตัดสต็อก (Validation Stock >= 0 ในตัว)
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.id } })
        if (!product || product.stock < item.quantity) {
          throw new Error(`สินค้า ${item.name} หมดหรือมีไม่พอ`)
        }
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } }
        })
      }

      // 2. สร้าง Order (บันทึก Tax Info ด้วย) 🔥
      return await tx.order.create({
        data: {
          userId: user.id,
          total: totalPrice,
          status: 'PENDING',
          
          shippingName: shippingAddress.name,
          shippingPhone: shippingAddress.phone,
          shippingAddress: `${shippingAddress.houseNumber} ${shippingAddress.subdistrict} ${shippingAddress.district} ${shippingAddress.province}`,
          shippingZipcode: shippingAddress.zipcode,

          // บันทึกข้อมูลใบกำกับภาษี (ถ้ามี)
          taxId: taxInfo?.taxId || null,
          taxName: taxInfo?.taxName || null,
          taxAddress: taxInfo?.taxAddress || null,

          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      })
    })

    return NextResponse.json({ success: true, orderId: newOrder.id })

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 })
  }
}