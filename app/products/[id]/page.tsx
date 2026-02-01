// app/products/[id]/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import FavoriteButton from '@/components/FavoriteButton'
import AddToCartSection from '@/components/AddToCartSection'
import ReviewForm from '@/components/ReviewForm' // 👈 1. Import ฟอร์มรีวิว
import { ChevronRight, CheckCircle, XCircle, AlertCircle, Star, User } from 'lucide-react'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  // ดึงข้อมูลสินค้า + รีวิว
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-neutral-500">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h1 className="text-xl font-bold text-neutral-800">ไม่พบสินค้า</h1>
      <Link href="/" className="mt-4 text-black border-b border-black hover:opacity-50">กลับหน้าแรก</Link>
    </div>
  )

  // คำนวณคะแนน
  const totalReviews = product.reviews.length
  const averageRating = totalReviews > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
    : 0

  // เช็ค Favorite
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
        <div className="text-sm text-slate-500 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-black">หน้าแรก</Link>
          <ChevronRight size={14} />
          <span className="text-slate-800 font-medium truncate">{product.name}</span>
        </div>

        {/* ข้อมูลสินค้าหลัก */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            <div className="p-8 md:p-12 flex items-center justify-center bg-white border-r border-slate-50 relative">
              <div className="absolute top-6 right-6 z-10">
                <FavoriteButton productId={product.id} initialIsFavorite={isFavorite} />
              </div>
              <img src={product.image || ''} alt={product.name} className="w-full max-h-[450px] object-contain hover:scale-105 transition duration-700" />
            </div>

            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full w-fit mb-4 border border-slate-200">
                {product.category}
              </span>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">{product.name}</h1>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill={i < Math.round(averageRating) ? "currentColor" : "none"} className={i < Math.round(averageRating) ? "" : "text-slate-200"} />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-500 underline decoration-slate-300 underline-offset-4 cursor-pointer">
                  {totalReviews} รีวิว
                </span>
              </div>

              <div className="text-sm text-slate-500 mb-8 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p>รหัสสินค้า: <span className="font-mono text-slate-700">{product.id.split('-')[0]}</span></p>
                <div className="flex items-center gap-2">
                  <span>สถานะ:</span>
                  {product.stock > 0 ? (
                    <span className="text-green-600 flex items-center gap-1.5 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100"><CheckCircle size={14} /> มีสินค้าพร้อมส่ง</span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1.5 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-100"><XCircle size={14} /> สินค้าหมดชั่วคราว</span>
                  )}
                </div>
              </div>

              <div className="text-5xl font-bold text-black mb-8 tracking-tight">฿{Number(product.price).toLocaleString()}</div>
              <AddToCartSection product={{...product, price: Number(product.price)}} />

              <div className="mt-10 pt-8 border-t border-slate-100">
                <h3 className="font-bold text-lg mb-4 text-slate-800">Specification Highlights</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  {product.specs && Object.entries(product.specs as object).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-slate-400 capitalize text-xs mb-1">{key}</span>
                      <span className="font-medium text-slate-800">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ส่วนรีวิว (Reviews Section) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Star className="text-yellow-400" fill="currentColor" /> 
              รีวิวจากลูกค้า
              <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{totalReviews}</span>
            </h2>
            
            {/* 👇 2. ใส่ปุ่ม ReviewForm ตรงนี้ */}
            <ReviewForm productId={product.id} /> 
          </div>

          {totalReviews === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-slate-300" />
              </div>
              <p className="text-lg text-slate-600 font-medium mb-1">ยังไม่มีรีวิวสำหรับสินค้านี้</p>
              <p className="text-slate-400 text-sm">เป็นเจ้าของสินค้านี้และเขียนรีวิวเป็นคนแรกเลย!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200 flex-shrink-0 overflow-hidden">
                      {review.user.image ? (
                        <img src={review.user.image} className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-slate-900">{review.user.name || 'ลูกค้าทั่วไป'}</p>
                        <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString('th-TH')}</span>
                      </div>
                      <div className="flex text-yellow-400 text-xs mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-200"} />
                        ))}
                      </div>
                      <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl rounded-tl-none inline-block">
                        {review.comment || "ไม่ได้ระบุความคิดเห็น"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}