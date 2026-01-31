// app/favorites/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import ProductCard from '@/components/ProductCard'
import { Heart, HeartCrack, Lock, ArrowLeft } from 'lucide-react' // 👈 Import

export const dynamic = 'force-dynamic'

export default async function FavoritesPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <Lock size={48} className="text-slate-600 mb-4" />
          <h1 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h1>
          <p className="mb-6 text-slate-400">คุณต้องล็อกอินก่อนถึงจะดูรายการโปรดได้</p>
          <Link href="/login" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold transition">
            ไปหน้า Login
          </Link>
        </div>
      </div>
    )
  }

  const userWithFavs = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      favorites: {
        include: { product: true }
      }
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const favProducts = userWithFavs?.favorites.map((f: any) => ({
    ...f.product,
    price: Number(f.product.price)
  })) || []

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400 flex items-center gap-3">
            <Heart className="text-pink-400" /> My Favorites
          </h1>
          <Link href="/" className="text-slate-400 hover:text-white transition bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </div>

        {favProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed flex flex-col items-center">
            <HeartCrack size={48} className="text-slate-600 mb-4" />
            <p className="text-2xl text-slate-500 mb-2">ยังไม่มีสินค้าที่ถูกใจ</p>
            <p className="text-slate-600 mb-6">ลองกลับไปเลือกสินค้าแล้วกดปุ่มหัวใจดูสิ!</p>
            <Link href="/" className="text-emerald-400 hover:underline">
              ไปเลือกสินค้า
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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