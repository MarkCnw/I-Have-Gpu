// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// 🔥 1. GET: ดึงรายการออเดอร์
export async function GET(request: Request) {
  try {
    const session = await auth()
    
    // ✅ เพิ่มการเช็ค session.user
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // เช็ค Role ว่าเป็นใคร
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isAdmin = (session.user as any).role === 'ADMIN'

    let orders;

    if (isAdmin) {
      // Admin: เห็นทุกออเดอร์
      orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          items: { include: { product: true } },
          user: { select: { name: true, email: true } }
        }
      })
    } else {
      // User: เห็นแค่ออเดอร์ตัวเอง
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
    console.error("Fetch Orders Error:", error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// 🔥 2. PATCH: อัปเดตสถานะ (ยืนยันจ่าย, ส่งของ, หรือลูกค้าแนบสลิป)
export async function PATCH(request: Request) {
  try {
    const session = await auth()
    
    // ✅ เพิ่มการเช็ค session.user ตรงนี้ด้วย
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session.user as any).role
    
    const body = await request.json()
    const { orderId, status, slipImage, trackingNumber, carrier } = body

    // กรณี Admin อัปเดต (เปลี่ยนสถานะ / ใส่เลขพัสดุ)
    if (userRole === 'ADMIN') {
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

    // กรณี User อัปเดต (แนบสลิป -> เปลี่ยนเป็น VERIFYING)
    if (slipImage && status === 'VERIFYING') {
      // เช็คว่าเป็นเจ้าของออเดอร์ไหม
      const user = await prisma.user.findUnique({ where: { email: session.user.email } })
      const order = await prisma.order.findUnique({ where: { id: orderId } })

      if (!order || order.userId !== user?.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: 'VERIFYING',
          slipImage: slipImage
        }
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Forbidden action' }, { status: 403 })

  } catch (error) {
    console.error("Update Order Error:", error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}