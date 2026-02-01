// app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // เพื่อความปลอดภัย บอกว่าส่งแล้วแม้ไม่เจออีเมล
      return NextResponse.json({ success: true, message: 'If email exists, reset link sent.' })
    }

    // สร้าง Token
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000) // 1 ชม.

    // บันทึกลง DB
    await prisma.passwordResetToken.deleteMany({ where: { email } })
    await prisma.passwordResetToken.create({
      data: { email, token, expires }
    })

    // 🔥 ตั้งค่าตัวส่งอีเมล (Transporter)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })

    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`

    // 🔥 ส่งอีเมลจริง
    await transporter.sendMail({
      from: `"iHAVEGPU Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '🔒 Reset Your Password - iHAVEGPU',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset for your iHAVEGPU account.</p>
          <p>Click the button below to set a new password. This link is valid for 1 hour.</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Email Error:", error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}