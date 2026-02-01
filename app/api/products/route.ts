// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// ✅ 1. เพิ่มฟังก์ชัน GET เพื่อให้หน้า Admin ดึงข้อมูลสินค้าได้
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' } // เรียงสินค้าใหม่สุดขึ้นก่อน
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// ✅ 2. ฟังก์ชัน POST เดิม (สำหรับการเพิ่มสินค้า)
export async function POST(request: Request) {
  try {
    const session = await auth()
    
    // 🔒 SECURITY CHECK: ต้องเป็น Admin เท่านั้น
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access Denied: Admins only' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, price, stock, image, category, specs } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        image,
        category,
        specs: specs || {}
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}