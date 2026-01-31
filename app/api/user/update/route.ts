// app/api/user/update/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone, address, dateOfBirth } = body

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}