// app/products/[id]/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import FavoriteButton from '@/components/FavoriteButton'
import AddToCartSection from '@/components/AddToCartSection'
import ReviewForm from '@/components/ReviewForm'
import ProductGallery from '@/components/ProductGallery' // ✅ Import Gallery ที่สร้างใหม่
import { 
  ChevronRight, AlertCircle, Star, User, 
  ShieldCheck, Truck, RotateCcw, Package 
} from 'lucide-react'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  // 1. ดึงข้อมูลสินค้า + รีวิว
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  // กรณีไม่พบสินค้า
  if (!product) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-neutral-500">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertCircle size={40} className="text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">ไม่พบสินค้า</h1>
      <p className="text-neutral-500 mb-8">สินค้าที่คุณค้นหาอาจไม่มีอยู่จริงหรือถูกลบออกไปแล้ว</p>
      <Link href="/" className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-neutral-800 transition-all font-medium">
        กลับไปหน้าแรก
      </Link>
    </div>
  )

  // 2. 🔥 ดึงสินค้าที่เกี่ยวข้อง (Related Products)
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category, // หมวดหมู่เดียวกัน
      id: { not: product.id }     // ไม่เอาสินค้าปัจจุบัน
    },
    take: 4 // แสดงสูงสุด 4 ชิ้น
  })

  // 3. จัดการรูปภาพ (รองรับทั้งระบบเก่าที่มี 1 รูป และระบบใหม่ที่มีหลายรูป)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const images = (product as any).images && (product as any).images.length > 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (product as any).images
    : [product.image || '/placeholder.png']

  // คำนวณคะแนนรีวิว
  const totalReviews = product.reviews.length
  const averageRating = totalReviews > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
    : 0

  // เช็คสถานะ Favorite
  let isFavorite = false
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { favorites: true }
    })
    isFavorite = user?.favorites.some(f => f.productId === product.id) || false
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-neutral-900 pb-24">
      
      {/* ================= BREADCRUMB ================= */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center text-sm text-neutral-500">
          <Link href="/" className="hover:text-black transition-colors">หน้าแรก</Link>
          <ChevronRight size={14} className="mx-2 text-neutral-300" />
          <Link href={`/?category=${product.category}`} className="hover:text-black transition-colors capitalize">
            {product.category}
          </Link>
          <ChevronRight size={14} className="mx-2 text-neutral-300" />
          <span className="text-neutral-900 font-medium truncate max-w-[200px] md:max-w-md">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 md:mt-12">
        
        {/* ================= PRODUCT HERO SECTION ================= */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-20">
          
          {/* ซ้าย: รูปสินค้า (Gallery) */}
          <div className="relative">
             {/* ปุ่ม Favorite (วางซ้อนทับ Gallery) */}
             <div className="absolute top-5 right-5 z-20 pointer-events-none"> {/* pointer-events-none เพื่อไม่ให้บังการคลิกรูป แต่ตัวปุ่มต้องเปิด pointer-events-auto */}
                 <div className="bg-white rounded-full p-2.5 shadow-lg border border-neutral-100 hover:scale-110 transition-transform cursor-pointer pointer-events-auto">
                    <FavoriteButton productId={product.id} initialIsFavorite={isFavorite} />
                 </div>
             </div>
             
             {/* ✅ เรียกใช้ Gallery Component */}
             <ProductGallery images={images} />
          </div>

          {/* ขวา: ข้อมูลสินค้า */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                {product.category}
              </span>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight mb-4">
                {product.name}
              </h1>
              
              {/* คะแนนและรหัสสินค้า */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.round(averageRating) ? "currentColor" : "none"} className={i < Math.round(averageRating) ? "" : "text-neutral-200"} />
                    ))}
                  </div>
                  <span className="text-neutral-500 font-medium ml-1">({totalReviews} รีวิว)</span>
                </div>
                <div className="w-1 h-1 bg-neutral-300 rounded-full"></div>
                <span className="text-neutral-400">รหัสสินค้า: {product.id.split('-')[0].toUpperCase()}</span>
              </div>
            </div>

            {/* ราคาและสต็อก */}
            <div className="mb-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
               <div className="flex items-end gap-3 mb-2">
                 <span className="text-4xl font-bold text-neutral-900">฿{Number(product.price).toLocaleString()}</span>
               </div>

               <div className="flex items-center gap-2 mb-6 text-sm">
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-1.5 text-green-600 font-bold">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> มีสินค้า
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-red-600 font-bold">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div> สินค้าหมดชั่วคราว
                    </span>
                  )}
                  <span className="text-neutral-400 font-medium">|</span>
                  <span className="text-neutral-500">พร้อมจัดส่งภายใน 24 ชม.</span>
               </div>

               <AddToCartSection product={{...product, price: Number(product.price)}} />
            </div>

            {/* ความน่าเชื่อถือ */}
            <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
               <div className="flex items-start gap-3">
                 <ShieldCheck className="text-neutral-900 shrink-0" size={20} />
                 <div>
                   <span className="font-bold text-neutral-900 block">รับประกันศูนย์ไทย</span>
                   สินค้าของแท้ 100%
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Truck className="text-neutral-900 shrink-0" size={20} />
                 <div>
                   <span className="font-bold text-neutral-900 block">จัดส่งรวดเร็ว</span>
                   ส่งด่วนทั่วประเทศ
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <RotateCcw className="text-neutral-900 shrink-0" size={20} />
                 <div>
                   <span className="font-bold text-neutral-900 block">เปลี่ยนคืนใน 7 วัน</span>
                   หากพบปัญหาจากการผลิต
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <Package className="text-neutral-900 shrink-0" size={20} />
                 <div>
                   <span className="font-bold text-neutral-900 block">แพ็คแน่นหนา</span>
                   รับประกันความปลอดภัย
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* ================= รายละเอียด & สเปค ================= */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-black rounded-full"></span> รายละเอียดสินค้า
              </h3>
              <div className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed bg-white p-8 rounded-2xl border border-neutral-100">
                 <p>{product.description || "ไม่มีรายละเอียดสำหรับสินค้านี้"}</p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-black rounded-full"></span> ข้อมูลจำเพาะ (Specifications)
              </h3>
              <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-neutral-100">
                      {Object.entries(product.specs as object).map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? "bg-neutral-50/50" : "bg-white"}>
                          <td className="py-4 px-6 font-medium text-neutral-900 w-1/3 capitalize">
                            {key.replace(/_/g, ' ')}
                          </td>
                          <td className="py-4 px-6 text-neutral-600">
                            {String(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-neutral-400 italic">ไม่มีข้อมูลจำเพาะสำหรับสินค้านี้</div>
                )}
              </div>
            </section>

            <section id="reviews">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-bold flex items-center gap-2">
                   <span className="w-1 h-8 bg-black rounded-full"></span> รีวิวจากลูกค้า
                 </h3>
                 <ReviewForm productId={product.id} />
               </div>

               <div className="space-y-6">
                 {totalReviews === 0 ? (
                    <div className="bg-neutral-50 rounded-2xl p-12 text-center border border-dashed border-neutral-200">
                       <Star size={40} className="text-neutral-300 mx-auto mb-4" />
                       <h4 className="font-bold text-neutral-900 mb-1">ยังไม่มีรีวิว</h4>
                       <p className="text-neutral-500 text-sm">ร่วมแบ่งปันประสบการณ์การใช้งานเป็นคนแรก</p>
                    </div>
                 ) : (
                    product.reviews.map((review) => (
                      <div key={review.id} className="bg-white p-6 rounded-2xl border border-neutral-100">
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center overflow-hidden border border-neutral-200">
                                  {review.user.image ? (
                                    <img src={review.user.image} alt={review.user.name || 'User'} className="w-full h-full object-cover" />
                                  ) : (
                                    <User size={20} className="text-neutral-400" />
                                  )}
                               </div>
                               <div>
                                  <h5 className="font-bold text-neutral-900 text-sm">{review.user.name || 'ผู้ใช้งานทั่วไป'}</h5>
                                  <div className="flex text-yellow-400 text-xs">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-neutral-200"} />
                                    ))}
                                  </div>
                               </div>
                            </div>
                            <span className="text-xs text-neutral-400">{new Date(review.createdAt).toLocaleDateString('th-TH')}</span>
                         </div>
                         <p className="text-neutral-600 text-sm leading-relaxed">
                           {review.comment || <span className="italic text-neutral-400">ไม่ได้ระบุความคิดเห็น</span>}
                         </p>
                      </div>
                    ))
                 )}
               </div>
            </section>
          </div>

          <div className="hidden lg:block space-y-8">
             <div className="sticky top-24 p-6 bg-neutral-900 text-white rounded-2xl bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80')] bg-cover bg-center bg-blend-overlay bg-opacity-90">
                <h4 className="text-xl font-bold mb-2">ต้องการคำปรึกษา?</h4>
                <p className="text-neutral-300 text-sm mb-6 leading-relaxed">
                  ไม่แน่ใจว่าอุปกรณ์นี้ใส่กับเครื่องของคุณได้ไหม? ผู้เชี่ยวชาญของเราพร้อมช่วยคุณจัดสเปคที่ลงตัวที่สุด
                </p>
                <Link href="/contact" className="block w-full py-3 bg-white text-black font-bold text-center rounded-lg hover:bg-neutral-200 transition-colors">
                  ติดต่อเรา
                </Link>
             </div>
          </div>
        </div>

        {/* ================= 🔥 RELATED PRODUCTS (สินค้าที่เกี่ยวข้อง) ================= */}
        {relatedProducts.length > 0 && (
            <div className="border-t border-neutral-100 pt-16">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <span className="w-1 h-8 bg-black rounded-full"></span> สินค้าที่เกี่ยวข้อง
                    </h3>
                    <Link href={`/?category=${product.category}`} className="text-sm font-bold border-b border-black hover:opacity-60 transition-opacity">
                        ดูทั้งหมด
                    </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedProducts.map((related) => (
                        <Link key={related.id} href={`/products/${related.id}`} className="group bg-white border border-neutral-100 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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