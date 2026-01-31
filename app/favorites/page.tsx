// app/favorites/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import ProductCard from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

export default async function FavoritesPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🔒 กรุณาเข้าสู่ระบบ</h1>
          <p className="mb-6 text-slate-400">คุณต้องล็อกอินก่อนถึงจะดูรายการโปรดได้</p>
          <Link href="/login" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold transition">
            ไปหน้า Login
          </Link>
        </div>
      </div>
    )
  }

  // ดึงสินค้าที่ user กด Fav ไว้
  const userWithFavs = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      favorites: {
        include: { product: true } // Join เอาข้อมูลสินค้ามาด้วย
      }
    }
  })

  // แปลงข้อมูลให้อยู่ในฟอร์มที่ ProductCard เข้าใจ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const favProducts = userWithFavs?.favorites.map((f: any) => ({
    ...f.product,
    price: Number(f.product.price)
  })) || []

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400">
            ❤️ My Favorites
          </h1>
          <Link href="/" className="text-slate-400 hover:text-white transition bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
            ← Back to Shop
          </Link>
        </div>

        {favProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
            <p className="text-2xl text-slate-500 mb-2">💔 ยังไม่มีสินค้าที่ถูกใจ</p>
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
                isFavorite={true} // หน้านี้คือหน้ารวม Fav ดังนั้นทุกชิ้นต้องเป็น Fav แน่นอน
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}