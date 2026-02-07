import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session?.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const rooms = await prisma.chatRoom.findMany({
      include: {
        user: { select: { name: true, email: true, image: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(rooms)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 })
  }
}