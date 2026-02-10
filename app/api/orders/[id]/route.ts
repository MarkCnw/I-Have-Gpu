// app/api/orders/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// 🔥 1. GET: ดึงรายละเอียดออเดอร์ (สำหรับหน้า Order Success และดูรายละเอียด)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true } // ดึงข้อมูลสินค้ามาแสดงรูปภาพ/ชื่อ
        }
      }
    })

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // (Option) Security: เช็คว่าเป็นเจ้าของออเดอร์ หรือเป็น Admin เท่านั้นถึงดูได้
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = session.user as any
    if (order.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(order)

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

// 📦 2. PATCH: อัปเดตสถานะออเดอร์ (แนบสลิป, ยืนยันจ่าย, ส่งของ)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session?.user as any)?.role
    const { id } = await params
    
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    // ✅ เพิ่ม rejectionReason
    const { status, slipImage, trackingNumber, carrier, rejectionReason } = body

    // 1. กรณีลูกค้าแนบสลิป (เปลี่ยนเป็น VERIFYING)
    if (slipImage && status === 'VERIFYING') {
      await prisma.order.update({
        where: { id },
        data: { 
          status: 'VERIFYING',
          slipImage: slipImage,
          rejectionReason: null // ✅ ล้างเหตุผลเดิมออกเมื่อส่งใหม่
        }
      })
      return NextResponse.json({ success: true })
    }

    // 2. กรณีแอดมินจัดการ (Confirm Payment / Add Tracking)
    if (userRole === 'ADMIN') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {}
      if (status) updateData.status = status
      if (trackingNumber) updateData.trackingNumber = trackingNumber
      if (carrier) updateData.carrier = carrier
      // ✅ บันทึกเหตุผลการปฏิเสธ
      if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason

      await prisma.order.update({
        where: { id },
        data: updateData
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}