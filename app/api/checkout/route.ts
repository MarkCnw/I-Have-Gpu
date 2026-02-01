/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Please login first' }, { status: 401 })
    }

    const body = await request.json()
    const { items, totalPrice, addressId } = body // 👈 Expect addressId from frontend

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { addresses: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 1. Determine Shipping Address
    // If frontend sends addressId, use it. Otherwise, use default. Fallback to first address.
    let shippingAddress = user.addresses.find(a => a.id === addressId)
    if (!shippingAddress) {
      shippingAddress = user.addresses.find(a => a.isDefault) || user.addresses[0]
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: 'Please add a shipping address in your profile.' }, { status: 400 })
    }

    // 2. Transaction: Deduct stock + Create Order
    const newOrder = await prisma.$transaction(async (tx) => {
      
      // A. Check & Deduct Stock
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.id } })
        if (!product) throw new Error(`Product "${item.name}" not found`)
        
        const buyQty = item.quantity || 1
        if (product.stock < buyQty) {
          throw new Error(`Sorry, "${item.name}" is out of stock (Left: ${product.stock})`)
        }

        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: buyQty } }
        })
      }

      // B. Create Order with Address Snapshot 🔥
      return await tx.order.create({
        data: {
          userId: user.id,
          total: totalPrice,
          status: 'PAID',
          
          // 🔥 Save Address Snapshot (Critical!)
          shippingName: shippingAddress.name,
          shippingPhone: shippingAddress.phone,
          shippingAddress: `${shippingAddress.houseNumber}, ${shippingAddress.subdistrict}, ${shippingAddress.district}, ${shippingAddress.province}`,
          shippingZipcode: shippingAddress.zipcode,

          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity || 1,
              price: item.price
            }))
          }
        }
      })
    })

    return NextResponse.json({ success: true, orderId: newOrder.id })

  } catch (error: any) {
    console.error("Checkout Error:", error)
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 })
  }
}