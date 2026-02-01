// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    // 🔒 SECURITY CHECK: ต้องเป็น Admin เท่านั้น
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access Denied: Admins only' }, { status: 403 })
    }

    const { id } = await params

    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // กรณีลบไม่ได้ (เช่น มีคนซื้อไปแล้ว ติด Relation ใน OrderItems)
    return NextResponse.json({ error: 'Cannot delete product (it might be in an order)' }, { status: 400 })
  }
}