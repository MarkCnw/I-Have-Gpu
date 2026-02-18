// app/favorites/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import ProductCard from '@/components/ProductCard'
import { Heart, HeartCrack, Lock, ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function FavoritesPage() {
  const session = await auth()

  // 1. กรณีไม่ได้ Login
  if (!session?.user?.email) {
    return (
      <div className="min-h-[70vh] bg-background flex flex-col items-center justify-center p-8 font-sans">
        <div className="w-24 h-24 bg-surface-bg rounded-full flex items-center justify-center mb-6 border border-border-light">
          <Lock size={40} className="text-txt-muted" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">กรุณาเข้าสู่ระบบ</h1>
        <p className="mb-8 text-txt-muted">คุณต้องล็อกอินก่อนเพื่อดูรายการสินค้าที่ถูกใจ</p>
        <Link
          href="/login"
          className="bg-foreground text-surface-card px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    )
  }

  // 2. ดึงข้อมูล
  const userWithFavs = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      favorites: {
        include: { product: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const favProducts = userWithFavs?.favorites.map((f: any) => ({
    ...f.product,
    price: Number(f.product.price)
  })) || []

  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-24">

      {/* ================= HEADER ================= */}
      <div className="bg-surface-card border-b border-border-light sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* ✅ Breadcrumb Navigation: วางตำแหน่งซ้ายสุด */}
            <div className="flex items-center gap-2 text-sm text-txt-muted">
              <Link href="/" className="hover:text-foreground transition-colors">หน้าแรก</Link>
              <span className="text-txt-muted text-xs font-bold">{'>'}</span>
              <span className="text-foreground font-medium">สินค้าที่ถูกใจ</span>
            </div>

            {/* Vertical Divider */}
            <div className="h-6 w-[1px] bg-border-main hidden md:block"></div>

            {/* Page Title & Count */}
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Heart className="text-red-500" fill="currentColor" /> My Wishlist
              <span className="text-sm font-normal text-txt-muted ml-2 bg-surface-bg px-2 py-1 rounded-full">
                {favProducts.length} items
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">

        {favProducts.length === 0 ? (
          // Empty State Design
          <div className="flex flex-col items-center justify-center py-24 bg-surface-card rounded-2xl border border-dashed border-border-main">
            <div className="w-24 h-24 bg-surface-bg rounded-full flex items-center justify-center mb-6">
              <HeartCrack size={48} className="text-txt-muted" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">ยังไม่มีสินค้าที่ถูกใจ</h2>
            <p className="text-txt-muted mb-8 text-center max-w-md">
              บันทึกสินค้าที่คุณชอบไว้ที่นี่ เพื่อกลับมาดูหรือสั่งซื้อในภายหลัง
            </p>
            <Link
              href="/"
              className="px-8 py-3 bg-foreground text-surface-card rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
            >
              <ShoppingBag size={18} /> ไปเลือกสินค้า
            </Link>
          </div>
        ) : (
          // Grid Layout
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {favProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}