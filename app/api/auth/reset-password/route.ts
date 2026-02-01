// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json()

    // 1. หา Token ใน DB
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!existingToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    // 2. เช็ควันหมดอายุ
    const hasExpired = new Date() > new Date(existingToken.expires)
    if (hasExpired) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 })
    }

    // 3. หา User
    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.email }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 400 })
    }

    // 4. Hash รหัสผ่านใหม่ & อัปเดต User
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword }
    })

    // 5. ลบ Token ทิ้ง (ใช้แล้วทิ้ง)
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}