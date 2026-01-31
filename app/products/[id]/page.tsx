// app/products/[id]/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import FavoriteButton from '@/components/FavoriteButton'
import AddToCartSection from '@/components/AddToCartSection'


export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  // 1. ดึงข้อมูลสินค้า
  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) return <div className="p-20 text-center">❌ สินค้าไม่พบ</div>

  // 2. เช็ค Favorite
  let isFavorite = false
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { favorites: true }
    })
    isFavorite = user?.favorites.some(f => f.productId === product.id) || false
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:text-red-600">หน้าแรก</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{product.name}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* ฝั่งซ้าย: รูปภาพ */}
            <div className="p-8 flex items-center justify-center bg-white border-r border-slate-50 relative">
              <div className="absolute top-4 right-4 z-10">
                <FavoriteButton productId={product.id} initialIsFavorite={isFavorite} />
              </div>
              <img 
                src={product.image || ''} 
                alt={product.name} 
                className="w-full max-h-[400px] object-contain hover:scale-105 transition duration-500"
              />
            </div>

            {/* ฝั่งขวา: ข้อมูล & ปุ่มสั่งซื้อ */}
            <div className="p-8 flex flex-col">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full w-fit mb-4">
                {product.category}
              </span>
              
              <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="text-sm text-slate-500 mb-6 space-y-2">
                <p>รหัสสินค้า: {product.id.split('-')[0]}</p>
                <p>สถานะ: {product.stock > 0 ? '✅ มีสินค้า' : '❌ สินค้าหมด'}</p>
              </div>

              <div className="text-4xl font-bold text-red-600 mb-8">
                ฿{Number(product.price).toLocaleString()}
              </div>

              {/* ส่วนปุ่มกดใส่ตะกร้า (Client Component) */}
              <AddToCartSection product={{...product, price: Number(product.price)}} />

              {/* รายละเอียดสเปค */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="font-bold text-lg mb-4">สเปคสินค้า</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.specs && Object.entries(product.specs as object).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-slate-400 capitalize">{key}</span>
                      <span className="font-medium text-slate-700">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}