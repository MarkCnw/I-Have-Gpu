// app/api/user/addresses/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET: ดึงรายการที่อยู่
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        addresses: { 
          orderBy: { isDefault: 'desc' } // เอาที่อยู่หลักขึ้นก่อน
        } 
      } 
    })

    return NextResponse.json(user?.addresses || [])
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching addresses' }, { status: 500 })
  }
}

// POST: เพิ่มที่อยู่ใหม่
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json()
    
    // ถ้าตั้งเป็น Default ให้เคลียร์ค่า Default อันเก่า
    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      })
    }

    // ถ้าเป็นที่อยู่แรก ให้บังคับเป็น Default เสมอ
    const addressCount = await prisma.address.count({ where: { userId: user.id } })
    const isFirstAddress = addressCount === 0

    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        name: body.name,
        phone: body.phone,
        houseNumber: body.houseNumber,
        subdistrict: body.subdistrict,
        district: body.district,
        province: body.province,
        zipcode: body.zipcode,
        isDefault: body.isDefault || isFirstAddress
      }
    })

    return NextResponse.json(newAddress)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 })
  }
}

// DELETE: ลบที่อยู่
export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    // ตรวจสอบว่าเป็นเจ้าของ
    const address = await prisma.address.findUnique({ where: { id } })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })

    if (!address || address.userId !== user?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.address.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

// ✅ เพิ่มใหม่ PATCH: อัปเดต/แก้ไขที่อยู่ หรือตั้งเป็นที่อยู่หลัก
export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json()
    const { id, isDefault, ...updateData } = body

    if (!id) return NextResponse.json({ error: 'Address ID required' }, { status: 400 })

    // ตรวจสอบความเป็นเจ้าของ
    const address = await prisma.address.findUnique({ where: { id } })
    if (!address || address.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ถ้ากดให้เป็นที่อยู่หลัก ให้เคลียร์ค่าของอันอื่นๆ ออกก่อน
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      })
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        ...updateData,
        ...(isDefault !== undefined && { isDefault })
      }
    })

    return NextResponse.json(updatedAddress)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 })
  }
}