// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // บันทึกลง Database
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price, // รับมาเป็น number
        category: body.category,
        image: body.image,
        stock: Number(body.stock),
        specs: body.specs // รับ JSON มาตรงๆ
      }
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 })
  }
}