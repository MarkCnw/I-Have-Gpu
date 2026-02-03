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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 })
    }

    const { id } = await params

    // ✅ เปลี่ยนเป็น Update เพื่อซ่อนสินค้า (Soft Delete)
    const product = await prisma.product.update({
      where: { id },
      data: { isArchived: true }
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 })
  }
}