// app/profile/page.tsx
import { auth } from '@/auth'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProfileView from '@/components/ProfileView'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.email) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p>กรุณาเข้าสู่ระบบ</p>
      <Link href="/login" className="text-blue-500 underline">Login</Link>
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
        include: { items: true }
      }
    }
  })

  if (!user) return null

  // 🔥 2. (จุดที่แก้) แปลงข้อมูล Decimal ให้เป็น Number ก่อนส่งไปหน้าเว็บ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeOrders = user.orders.map((order: any) => ({
    ...order,
    total: Number(order.total), // แปลงยอดรวม
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: order.items.map((item: any) => ({
      ...item,
      price: Number(item.price) // แปลงราคาสินค้าในออเดอร์
    }))
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeFavorites = user.favorites.map((fav: any) => ({
    ...fav,
    product: {
      ...fav.product,
      price: Number(fav.product.price) // แปลงราคาสินค้าโปรด
    }
  }))

  // แยก User ออกมาเพื่อไม่ให้ติดข้อมูล Decimal เก่าไปด้วย
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { orders, favorites, ...safeUser } = user

  // 3. ส่งข้อมูลที่ Clean แล้วไปแสดงผล
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 pb-20">
      
      {/* Navbar เล็กๆ */}
      <div className="border-b border-neutral-100 bg-white sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold flex items-center gap-2 hover:opacity-70">
            ← Back to Store
          </Link>
          <span className="font-bold text-lg">My Account</span>
          <div className="w-20"></div> 
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