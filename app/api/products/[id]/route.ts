// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// ✅ 1. GET: ดึงข้อมูลสินค้า 1 ชิ้น (สำหรับหน้าแก้ไข)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id }
    })
    
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}

// ✅ 2. PATCH: อัปเดตข้อมูลสินค้า
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
    const { name, description, price, stock, image, images, category, specs } = body

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        image,
        images, 
        category,
        specs
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

// ✅ 3. DELETE: ลบสินค้า (Soft Delete) - คงเดิมไว้
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

    const product = await prisma.product.update({
      where: { id },
      data: { isArchived: true }
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 })
  }
}