import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { message, roomId } = await request.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session.user as any).role
    const userEmail = session.user.email

    let targetRoomId = roomId

    // ถ้าเป็น User ส่ง: ต้องหาหรือสร้างห้องของตัวเอง
    if (userRole !== 'ADMIN') {
      const user = await prisma.user.findUnique({ where: { email: userEmail }, include: { chatRoom: true } })
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

      if (!user.chatRoom) {
        const newRoom = await prisma.chatRoom.create({ data: { userId: user.id } })
        targetRoomId = newRoom.id
      } else {
        targetRoomId = user.chatRoom.id
      }
    }

    // บันทึกข้อความ
    const newMessage = await prisma.chatMessage.create({
      data: {
        chatRoomId: targetRoomId,
        senderRole: userRole,
        message: message,
      }
    })

    // อัปเดตเวลาล่าสุดของห้องแชท
    await prisma.chatRoom.update({
      where: { id: targetRoomId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json(newMessage)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}