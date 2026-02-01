// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// 🔥 1. GET: ดึงรายการสินค้าทั้งหมด (สำหรับหน้า Admin Products)
export async function GET(request: Request) {
  try {
    // ดึงข้อมูลสินค้าทั้งหมด เรียงตามวันที่ล่าสุด
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// 🔒 2. POST: เพิ่มสินค้าใหม่ (Admin Only)
export async function POST(request: Request) {
  try {
    const session = await auth()
    
    // Security Check
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access Denied' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, price, stock, image, category, specs } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image,
        category,
        specs: specs || {}
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}