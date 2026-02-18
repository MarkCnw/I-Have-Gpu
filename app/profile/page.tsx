// app/profile/page.tsx
import { auth } from '@/auth'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProfileView from '@/components/ProfileView'

export default async function ProfilePage() {
  const session = await auth()

  // เช็คว่าล็อกอินหรือยัง
  if (!session?.user?.email) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 animate-in fade-in">
      <p className="text-txt-muted">กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์</p>
      <Link href="/login" className="bg-foreground text-surface-card px-6 py-2 rounded-lg font-bold hover:opacity-90 transition">
        เข้าสู่ระบบ
      </Link>
    </div>
  )

  // 1. ดึงข้อมูลจาก Database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      favorites: {
        include: { product: true }
      },
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } } // Include product เพื่อเอารูปมาโชว์ใน history ได้
      }
    }
  })

  if (!user) return null

  // 🔥 2. แปลงข้อมูล Decimal ให้เป็น Number ก่อนส่งไปหน้าเว็บ (ป้องกัน Error Serialization)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeOrders = user.orders.map((order: any) => ({
    ...order,
    total: Number(order.total),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: order.items.map((item: any) => ({
      ...item,
      price: Number(item.price),
      product: {
        ...item.product,
        ...item.product,
        price: Number(item.product.price)
      }
    }))
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeFavorites = user.favorites.map((fav: any) => ({
    ...fav,
    product: {
      ...fav.product,
      price: Number(fav.product.price)
    }
  }))

  // แยก User ออกมาเพื่อไม่ให้ติดข้อมูล Decimal ที่อยู่ใน Root object
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { orders, favorites, ...safeUser } = user

  // 3. ส่งข้อมูลที่ Clean แล้วไปแสดงผลที่ Client Component
  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-20">

      {/* Navbar เล็กๆ สำหรับหน้า Profile -> ปรับเป็น Breadcrumb Bar */}
      <div className="border-b border-border-light bg-surface-card sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center">
          {/* ✅ Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-txt-muted">
            <Link href="/" className="hover:text-foreground transition-colors">หน้าแรก</Link>
            <span className="text-txt-muted text-xs font-bold">{'>'}</span>
            <span className="text-foreground font-medium">บัญชีของฉัน</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <ProfileView
          user={safeUser}
          orders={safeOrders}
          favorites={safeFavorites}
        />
      </div>
    </div>
  )
}