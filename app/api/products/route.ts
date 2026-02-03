// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// 1. GET: ดึงสินค้า (เฉพาะที่ยังไม่ถูกลบ)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isArchived: false // กรองสินค้าที่ถูกลบออก (Soft Delete)
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// 2. POST: เพิ่มสินค้าใหม่ (รองรับหลายรูป)
export async function POST(request: Request) {
  try {
    const session = await auth()

    // 🔒 SECURITY CHECK: ต้องเป็น Admin เท่านั้น
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access Denied: Admins only' }, { status: 403 })
    }

    const body = await request.json()

    // ✅ เพิ่ม 'images' เข้ามาใน destructuring
    const { name, description, price, stock, image, images, category, specs } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        image,
        images: images || [],  // 🔥 เพิ่มบรรทัดนี้
        category,
        specs: specs || {}
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}