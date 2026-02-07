// app/products/[id]/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import FavoriteButton from '@/components/FavoriteButton'
import AddToCartSection from '@/components/AddToCartSection'
import ReviewForm from '@/components/ReviewForm'
import ProductGallery from '@/components/ProductGallery'
import { 
  ChevronRight, AlertCircle, Star, User, 
  ShieldCheck, Truck, RotateCcw, Package 
} from 'lucide-react'
import Image from 'next/image'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  // 1. ดึงข้อมูลสินค้า
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
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-neutral-500">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertCircle size={40} className="text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">ไม่พบสินค้า</h1>
      <Link href="/" className="mt-4 px-6 py-2.5 bg-black text-white rounded-lg hover:bg-neutral-800">กลับไปหน้าแรก</Link>
    </div>
  )

  // 2. ดึงสินค้าหมวดหมู่เดียวกัน (Related Products)
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
      isArchived: false
    },
    take: 4
  })

  // 3. เตรียมรูปภาพ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productImages = (product as any).images as string[] | null | undefined
  const images: string[] = (productImages && productImages.length > 0)
    ? productImages
    : product.image 
      ? [product.image] 
      : ['/placeholder.png']

  // คำนวณรีวิว & Favorite
  const totalReviews = product.reviews.length
  const averageRating = totalReviews > 0 ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews : 0
  
  let isFavorite = false
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { favorites: true } })
    isFavorite = user?.favorites.some(f => f.productId === product.id) || false
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-neutral-900 pb-24">
      
      {/* Breadcrumb */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center text-sm text-neutral-500">
          <Link href="/" className="hover:text-black">หน้าแรก</Link>
          <ChevronRight size={14} className="mx-2 text-neutral-300" />
          <Link href={`/?category=${product.category}`} className="hover:text-black capitalize">{product.category}</Link>
          <ChevronRight size={14} className="mx-2 text-neutral-300" />
          <span className="text-neutral-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 md:mt-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-20">
          
          {/* ส่วนแสดงรูปภาพ */}
          <div className="relative">
             
             {/* ✅ ปุ่ม Favorite (ขวาบน) */}
             <div className="absolute top-5 right-5 z-20">
                 <div className="bg-white rounded-full p-2.5 shadow-lg border border-neutral-100 hover:scale-110 transition-transform cursor-pointer">
                    <FavoriteButton productId={product.id} initialIsFavorite={isFavorite} />
                 </div>
             </div>

             <ProductGallery images={images} />
          </div>

          {/* ข้อมูลสินค้า */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold rounded-full uppercase mb-4">{product.category}</span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-yellow-400">
                   {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.round(averageRating) ? "currentColor" : "none"} className={i < Math.round(averageRating) ? "" : "text-neutral-200"} />)}
                   <span className="text-neutral-500 font-medium ml-1 text-black">({totalReviews} รีวิว)</span>
                </div>
                <span className="text-neutral-400">| รหัส: {product.id.split('-')[0].toUpperCase()}</span>
              </div>
            </div>

            <div className="mb-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
               <div className="text-4xl font-bold text-neutral-900 mb-2">฿{Number(product.price).toLocaleString()}</div>
               <div className="flex items-center gap-2 mb-6 text-sm">
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-1.5 text-green-600 font-bold"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> มีสินค้า</span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-red-600 font-bold"><div className="w-2 h-2 bg-red-500 rounded-full"></div> สินค้าหมด</span>
                  )}
                  <span className="text-neutral-400">| พร้อมจัดส่งภายใน 24 ชม.</span>
               </div>
               <AddToCartSection product={{...product, price: Number(product.price)}} />
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
               <div className="flex gap-3"><ShieldCheck size={20} className="text-black" /><div><span className="font-bold text-black block">ประกันศูนย์ไทย</span>ของแท้ 100%</div></div>
               <div className="flex gap-3"><Truck size={20} className="text-black" /><div><span className="font-bold text-black block">ส่งฟรีทั่วไทย</span>ถึงไว 1-2 วัน</div></div>
               <div className="flex gap-3"><RotateCcw size={20} className="text-black" /><div><span className="font-bold text-black block">เปลี่ยนคืน 30 วัน</span>มีปัญหาเคลมได้</div></div>
               <div className="flex gap-3"><Package size={20} className="text-black" /><div><span className="font-bold text-black block">แพ็คแน่นหนา</span>ปลอดภัยทุกชิ้น</div></div>
            </div>
          </div>
        </div>

        {/* รายละเอียด / สเปค / รีวิว */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-2xl font-bold mb-6 flex gap-2"><span className="w-1 h-8 bg-black rounded-full"></span> รายละเอียด</h3>
              <div className="prose max-w-none text-neutral-600 bg-white p-8 rounded-2xl border border-neutral-100">
                 <p>{product.description || "ไม่มีรายละเอียด"}</p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-6 flex gap-2"><span className="w-1 h-8 bg-black rounded-full"></span> สเปคสินค้า</h3>
              <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-neutral-100">
                      {Object.entries(product.specs as object).map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? "bg-neutral-50/50" : "bg-white"}>
                          <td className="py-4 px-6 font-medium w-1/3 capitalize">{key.replace(/_/g, ' ')}</td>
                          <td className="py-4 px-6 text-neutral-600">{String(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <div className="p-8 text-center text-neutral-400">ไม่ระบุข้อมูล</div>}
              </div>
            </section>

            <section>
               <div className="flex justify-between mb-8">
                 <h3 className="text-2xl font-bold flex gap-2"><span className="w-1 h-8 bg-black rounded-full"></span> รีวิวลูกค้า</h3>
                 <ReviewForm productId={product.id} />
               </div>
               <div className="space-y-6">
                 {totalReviews === 0 ? (
                    <div className="bg-neutral-50 rounded-2xl p-12 text-center border border-dashed border-neutral-200">
                       <Star size={40} className="text-neutral-300 mx-auto mb-4" />
                       <p className="text-neutral-500">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวสินค้านี้เลย!</p>
                    </div>
                 ) : (
                    product.reviews.map((review) => (
                      <div key={review.id} className="bg-white p-6 rounded-2xl border border-neutral-100">
                         <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-neutral-100 rounded-full overflow-hidden">
                               {review.user.image ? <img src={review.user.image} className="w-full h-full object-cover"/> : <User className="p-2 w-full h-full text-neutral-400"/>}
                            </div>
                            <div>
                               <div className="font-bold text-sm">{review.user.name || 'User'}</div>
                               <div className="flex text-yellow-400 text-xs">
                                 {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-neutral-200"} />)}
                               </div>
                            </div>
                         </div>
                         <p className="text-neutral-600 text-sm">{review.comment}</p>
                      </div>
                    ))
                 )}
               </div>
            </section>
          </div>
          
          <div className="hidden lg:block space-y-8">
             <div className="sticky top-24 p-6 bg-neutral-900 text-white rounded-2xl">
                <h4 className="text-xl font-bold mb-2">ต้องการคำปรึกษา?</h4>
                <p className="text-sm text-neutral-300 mb-6">ทีมงานผู้เชี่ยวชาญพร้อมช่วยคุณจัดสเปค</p>
                <Link href="/contact" className="block w-full py-3 bg-white text-black font-bold text-center rounded-lg hover:bg-neutral-200">ติดต่อเรา</Link>
             </div>
          </div>
        </div>

        {/* สินค้าแนะนำ */}
        {relatedProducts.length > 0 && (
            <div className="border-t border-neutral-100 pt-16 mb-16">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <span className="w-1 h-8 bg-black rounded-full"></span> สินค้าที่คุณอาจสนใจ
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedProducts.map((related) => (
                        <Link key={related.id} href={`/products/${related.id}`} className="group bg-white border border-neutral-100 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="aspect-square relative bg-neutral-50 rounded-xl mb-4 overflow-hidden">
                                <Image 
                                    src={related.image || '/placeholder.png'} 
                                    alt={related.name} 
                                    fill 
                                    className="object-contain p-4 mix-blend-multiply group-hover:scale-105 transition-transform"
                                />
                            </div>
                            <span className="text-[10px] font-bold text-neutral-400 bg-neutral-50 px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                                {related.category}
                            </span>
                            <h4 className="font-bold text-neutral-900 text-sm mb-2 line-clamp-2 h-10 group-hover:text-neutral-600 transition-colors">
                                {related.name}
                            </h4>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-neutral-900">฿{Number(related.price).toLocaleString()}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  )
}