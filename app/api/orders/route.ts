// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// ... (POST เดิมถ้ามี) ...

// เพิ่มฟังก์ชัน PATCH สำหรับอัปเดตสถานะ
export async function PATCH(request: Request) {
  try {
    // เช็คว่าเป็น Admin ไหม (ความปลอดภัย)
    const session = await auth()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session?.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, status } = await request.json()

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status }
    })

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}