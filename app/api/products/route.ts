// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: Request) { // รับ request เข้ามา
  try {
    const { searchParams } = new URL(request.url)
    const forAi = searchParams.get('forAi') // 🔥 เช็คว่าเป็น request จาก AI ไหม

    // 🤖 ถ้า AI ขอข้อมูล ให้ส่งไปแค่ที่จำเป็น (id, name, price, specs)
    if (forAi === 'true') {
      const products = await prisma.product.findMany({
        where: { isArchived: false, stock: { gt: 0 } }, // เอาเฉพาะที่มีของ
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          specs: true // สำคัญมากสำหรับเช็ค Compatibility (Socket, Watt)
        }
      })
      return NextResponse.json(products)
    }

    // กรณีปกติ (หน้าเว็บดึงไปแสดง)
    const products = await prisma.product.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// ... POST function เหมือนเดิม ...
export async function POST(request: Request) {
    // ... (โค้ดเดิมของคุณ)
    try {
        const session = await auth()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!session || (session.user as any)?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Access Denied: Admins only' }, { status: 403 })
        }
        const body = await request.json()
        const { name, description, price, stock, image, images, category, specs } = body

        const product = await prisma.product.create({
            data: { name, description, price, stock, image, images: images || [], category, specs: specs || {} }
        })
        return NextResponse.json(product)
    } catch (error) {
        console.error('Create product error:', error)
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }
}