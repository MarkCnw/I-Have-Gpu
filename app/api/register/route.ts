// app/api/register/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // 1. เช็คว่าอีเมลซ้ำไหม
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email นี้ถูกใช้งานแล้ว' }, { status: 400 })
    }

    // 2. เข้ารหัสรหัสผ่าน (Hash)
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. สร้าง User ใหม่ (Default Role = USER)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER' // ถ้าอยากสมัครแอดมิน ให้ไปแก้ใน Database เอาเองทีหลังเพื่อความปลอดภัย
      }
    })

    return NextResponse.json({ success: true, user: newUser })

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}