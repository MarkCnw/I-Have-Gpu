/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET: ดึงรายการออเดอร์
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isAdmin = (session.user as any).role === 'ADMIN'

    let orders;

    if (isAdmin) {
      orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          items: { include: { product: true } },
          user: { select: { name: true, email: true } }
        }
      })
    } else {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } })
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

      orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          items: { include: { product: true } }
        }
      })
    }

    return NextResponse.json(orders)

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// PATCH: อัปเดตสถานะ (Admin Only) / แนบสลิป (User)
export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session.user as any).role
    
    const body = await request.json()
    const { orderId, status, slipImage, trackingNumber, carrier } = body

    // 🔒 ADMIN SECTION (เปลี่ยนสถานะ / ส่งของ / ยกเลิก)
    if (userRole === 'ADMIN') {
      
      // 🔥 Logic: Restock คืนของเมื่อยกเลิกออเดอร์
      if (status === 'CANCELLED') {
        await prisma.$transaction(async (tx) => {
          // 1. ดึงรายการสินค้าในออเดอร์
          const order = await tx.order.findUnique({
            where: { id: orderId },
            include: { items: true }
          })

          if (!order) throw new Error('Order not found')
          
          // ถ้าออเดอร์เคยถูกยกเลิกไปแล้ว ไม่ต้องคืนของซ้ำ
          if (order.status === 'CANCELLED') {
             throw new Error('Order already cancelled')
          }

          // 2. วนลูปคืนสต็อก
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } } // บวกกลับเข้าไป
            })
          }

          // 3. เปลี่ยนสถานะเป็น CANCELLED
          await tx.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' }
          })
        })
        
        return NextResponse.json({ success: true, message: 'Order cancelled & Stock restored' })
      }

      // กรณีเปลี่ยนสถานะอื่นๆ (PAID, SHIPPED)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {}
      if (status) updateData.status = status
      if (trackingNumber) updateData.trackingNumber = trackingNumber
      if (carrier) updateData.carrier = carrier

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: updateData
      })
      return NextResponse.json({ success: true, order: updatedOrder })
    }

    // 👤 USER SECTION (แนบสลิป)
    if (slipImage && status === 'VERIFYING') {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } })
      const order = await prisma.order.findUnique({ where: { id: orderId } })

      if (!order || order.userId !== user?.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'VERIFYING', slipImage: slipImage }
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Forbidden action' }, { status: 403 })

  } catch (error: any) {
    console.error("Update Error:", error)
    return NextResponse.json({ error: error.message || 'Failed to update' }, { status: 500 })
  }
}