import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session.user as any).role

    let targetRoomId = roomId

    // ถ้าเป็น User ธรรมดา ให้ดึงห้องของตัวเองเท่านั้น
    if (userRole !== 'ADMIN') {
      const user = await prisma.user.findUnique({ 
        where: { email: session.user.email }, 
        include: { chatRoom: true } 
      })
      
      if (!user?.chatRoom) return NextResponse.json([]) // ยังไม่เคยคุย
      targetRoomId = user.chatRoom.id
    }

    if (!targetRoomId) return NextResponse.json([])

    const messages = await prisma.chatMessage.findMany({
      where: { chatRoomId: targetRoomId },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}