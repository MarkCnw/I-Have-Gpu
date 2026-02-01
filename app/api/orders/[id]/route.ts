/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/orders/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// PATCH: อัปเดตสถานะออเดอร์ (แนบสลิป, ยืนยันจ่าย, ส่งของ)
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
    const { status, slipImage, trackingNumber, carrier } = body

    // 1. กรณีลูกค้าแนบสลิป (เปลี่ยนเป็น VERIFYING)
    if (slipImage && status === 'VERIFYING') {
      await prisma.order.update({
        where: { id },
        data: { 
          status: 'VERIFYING',
          slipImage: slipImage
        }
      })
      return NextResponse.json({ success: true })
    }

    // 2. กรณีแอดมินจัดการ (Confirm Payment / Add Tracking)
    if (userRole === 'ADMIN') {
      const updateData: any = {}
      if (status) updateData.status = status
      if (trackingNumber) updateData.trackingNumber = trackingNumber
      if (carrier) updateData.carrier = carrier

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