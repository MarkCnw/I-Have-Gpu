// app/api/favorites/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Please login' }, { status: 401 })
    }

    const { productId } = await request.json()

    // หา User ID จาก email
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // เช็คว่าเคยกดชอบไปหรือยัง?
    const existing = await prisma.userFavorite.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    })

    if (existing) {
      // ถ้ามีอยู่แล้ว -> ลบออก (Unlike)
      await prisma.userFavorite.delete({
        where: { id: existing.id }
      })
      return NextResponse.json({ action: 'removed' })
    } else {
      // ถ้ายังไม่มี -> เพิ่มใหม่ (Like)
      await prisma.userFavorite.create({
        data: {
          userId: user.id,
          productId: productId
        }
      })
      return NextResponse.json({ action: 'added' })
    }

  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}