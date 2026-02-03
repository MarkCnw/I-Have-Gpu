// app/favorites/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import ProductCard from '@/components/ProductCard'
import { Heart, HeartCrack, Lock, ArrowLeft, ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function FavoritesPage() {
  const session = await auth()
  
  // 1. กรณีไม่ได้ Login -> ดีไซน์แบบ Clean
  if (!session?.user?.email) {
    return (
      <div className="min-h-[70vh] bg-[#FDFDFD] flex flex-col items-center justify-center p-8 font-sans">
        <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6 border border-neutral-100">
          <Lock size={40} className="text-neutral-400" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">กรุณาเข้าสู่ระบบ</h1>
        <p className="mb-8 text-neutral-500">คุณต้องล็อกอินก่อนเพื่อดูรายการสินค้าที่ถูกใจ</p>
        <Link 
          href="/login" 
          className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
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
        orderBy: { createdAt: 'desc' } // เรียงจากใหม่ไปเก่า
      }
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const favProducts = userWithFavs?.favorites.map((f: any) => ({
    ...f.product,
    price: Number(f.product.price)
  })) || []

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-neutral-900 pb-24">
      
      {/* ================= HEADER ================= */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-10">
         <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Heart className="text-red-500" fill="currentColor" /> My Wishlist
              <span className="text-sm font-normal text-neutral-400 ml-2 bg-neutral-50 px-2 py-1 rounded-full">
                {favProducts.length} items
              </span>
            </h1>
            <Link 
              href="/" 
              className="text-sm font-medium text-neutral-500 hover:text-black flex items-center gap-2 transition-colors"
            >
               <ArrowLeft size={16} /> ซื้อสินค้าต่อ
            </Link>
         </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        
        {favProducts.length === 0 ? (
          // Empty State Design
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-neutral-200">
            <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
              <HeartCrack size={48} className="text-neutral-300" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">ยังไม่มีสินค้าที่ถูกใจ</h2>
            <p className="text-neutral-500 mb-8 text-center max-w-md">
              บันทึกสินค้าที่คุณชอบไว้ที่นี่ เพื่อกลับมาดูหรือสั่งซื้อในภายหลัง
            </p>
            <Link 
              href="/" 
              className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
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