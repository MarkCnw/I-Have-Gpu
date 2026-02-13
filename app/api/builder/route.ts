import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { name, totalPrice, items } = await req.json()

    // สร้างข้อมูลในตาราง Build และ BuildItem พร้อมกัน
    const build = await prisma.build.create({
      data: {
        name,
        totalPrice,
        userId: session.user.id,
        items: {
          create: items.map((productId: string) => ({
            productId: productId,
            quantity: 1
          }))
        }
      }
    })

    return NextResponse.json(build)
  } catch (error) {
    return NextResponse.json({ error: "Failed to save build" }, { status: 500 })
  }
}