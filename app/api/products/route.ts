// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

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