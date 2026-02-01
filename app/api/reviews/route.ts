// app/api/reviews/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: Request) {
  try {
    // 1. เช็คว่า Login หรือยัง
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. หา User ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // 3. รับข้อมูลจากหน้าบ้าน
    const body = await request.json()
    const { productId, rating, comment } = body

    // 4. (Optional) เช็คว่าเคยซื้อสินค้านี้จริงไหม?
    // (ข้ามไปก่อนเพื่อให้ทดสอบง่าย)

    // 5. สร้างรีวิว
    const newReview = await prisma.review.create({
      data: {
        userId: user.id,
        productId: productId,
        rating: Number(rating),
        comment: comment,
        images: [] // เวอร์ชั่นนี้ยังไม่รองรับอัปโหลดรูป (เพื่อความง่าย)
      }
    })

    return NextResponse.json({ success: true, review: newReview })

  } catch (error) {
    console.error("Review Error:", error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}