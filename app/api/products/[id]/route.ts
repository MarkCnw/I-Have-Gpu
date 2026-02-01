// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// 🔥 1. PATCH: แก้ไขสินค้า (เช่น อัปเดตสต็อก หรือ ราคา)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    // อัปเดตข้อมูล (รองรับทั้ง stock, price, name ฯลฯ)
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: body
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// 🔒 2. DELETE: ลบสินค้า
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 })
    }

    const { id } = await params

    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // กันเหนียว: ถ้าลบไม่ได้ (เช่น ติดอยู่ในออเดอร์ลูกค้า)
    return NextResponse.json({ error: 'Cannot delete product (it might be in an order)' }, { status: 400 })
  }
}