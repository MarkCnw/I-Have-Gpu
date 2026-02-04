// app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { items, totalPrice, addressId, taxInfo } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!addressId) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 })
    }

    // 1. ✅ ดึงข้อมูล User จาก Email (เพื่อเอา User ID)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 2. ✅ ดึงรายละเอียดที่อยู่ (Address) จาก addressId
    // (ต้องดึงมาเพื่อบันทึกเป็น Snapshot ลงใน Order ป้องกันกรณี User ไปแก้ที่อยู่ใน Profile ทีหลัง)
    const addressData = await prisma.address.findUnique({
      where: { id: addressId }
    })

    if (!addressData) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // รวมที่อยู่เป็น String เดียว (หรือจะแยกก็ได้ตามสะดวก)
    const fullAddress = `
      ${addressData.houseNumber} 
      ต.${addressData.subdistrict} 
      อ.${addressData.district} 
      จ.${addressData.province} 
      ${addressData.zipcode}
    `.trim().replace(/\s+/g, ' ')

    // 3. ✅ สร้าง Order พร้อมบันทึกข้อมูลทุกอย่าง
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: totalPrice,
        status: 'PENDING', // สถานะเริ่มต้น

        // --- บันทึกข้อมูลจัดส่ง (Snapshot) ---
        shippingName: addressData.name,
        shippingPhone: addressData.phone,
        shippingAddress: fullAddress,
        shippingZipcode: addressData.zipcode,

        // --- บันทึกข้อมูลใบกำกับภาษี (ถ้ามี) ---
        taxId: taxInfo?.taxId || null,
        taxName: taxInfo?.taxName || null,
        taxAddress: taxInfo?.taxAddress || null,

        // --- บันทึกรายการสินค้า (Order Items) ---
        items: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price // บันทึกราคา ณ ตอนสั่งซื้อ
          }))
        }
      }
    })

    // 4. (Optional) ตัดสต็อกสินค้า (Stock) ที่นี่ก็ได้
    // ... (logic ตัดสต็อก)

    return NextResponse.json({ success: true, orderId: order.id })

  } catch (error) {
    console.error('Checkout Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}