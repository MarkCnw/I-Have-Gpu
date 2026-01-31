/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth' // 👈 Import auth

export async function POST(request: Request) {
  try {
    const session = await auth() // 👈 ตรวจสอบ Session ฝั่ง Server
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนสั่งซื้อ (Please Login)' }, { status: 401 })
    }

    const body = await request.json()
    const { items, totalPrice } = body

    // ใช้ email จาก Session หา User จริง
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // สร้าง Order (เหมือนเดิม)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newOrder = await prisma.order.create({
      data: {
        userId: user.id,
        total: totalPrice,
        status: 'PAID',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: 1,
            price: item.price
          }))
        }
      }
    })

    return NextResponse.json({ success: true, orderId: newOrder.id })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}