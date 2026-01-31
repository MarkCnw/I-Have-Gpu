// app/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import BuildSummaryBar from '@/components/BuildSummaryBar'
import SearchBar from '@/components/SearchBar'
import { auth, signOut } from '@/auth'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

// ไอคอนหมวดหมู่ (Sidebar)
const CATEGORIES = [
  { id: 'ALL', name: 'สินค้าทั้งหมด', icon: '⚡' },
  { id: 'CPU', name: 'ซีพียู (CPU)', icon: '🧠' },
  { id: 'MOTHERBOARD', name: 'เมนบอร์ด', icon: '🔌' },
  { id: 'GPU', name: 'การ์ดจอ (VGA)', icon: '🎮' },
  { id: 'RAM', name: 'แรม (RAM)', icon: '💾' },
  { id: 'STORAGE', name: 'ฮาร์ดดิสก์/SSD', icon: '💿' },
  { id: 'PSU', name: 'พาวเวอร์ซัพพลาย', icon: '⚡' },
  { id: 'CASE', name: 'เคสคอมพิวเตอร์', icon: '📦' },
  { id: 'COOLER', name: 'ชุดระบายความร้อน', icon: '❄️' },
  { id: 'MONITOR', name: 'จอมอนิเตอร์', icon: '🖥️' },
  { id: 'LAPTOP', name: 'โน้ตบุ๊ก', icon: '💻' },
  { id: 'MOUSE', name: 'เมาส์', icon: '🖱️' },
  { id: 'KEYBOARD', name: 'คีย์บอร์ด', icon: '⌨️' },
  { id: 'HEADSET', name: 'หูฟัง', icon: '🎧' },
  { id: 'CHAIR', name: 'เก้าอี้เกมมิ่ง', icon: '💺' },
]

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const session = await auth()
  const user = session?.user
  const { q, category } = await searchParams
  const currentCategory = category || 'ALL'

  // Query Data
  const whereCondition: Prisma.ProductWhereInput = {}
  if (q) whereCondition.name = { contains: q, mode: 'insensitive' }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (category && category !== 'ALL') whereCondition.category = category as any

  const rawProducts = await prisma.product.findMany({
    where: whereCondition,
    orderBy: { category: 'asc' },
  })

  let favoriteIds: string[] = []
  if (user?.email) {
    const currentUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { favorites: true }
    })
    favoriteIds = currentUser?.favorites.map(f => f.productId) || []
  }

  const products = rawProducts.map((p) => ({ ...p, price: Number(p.price) }))

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900 pb-32">
      
      {/* ================= HEADER STYLE iHAVECPU ================= */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        
        {/* 1. TOP BAR (แถบดำบนสุด) */}
        <div className="bg-black text-white text-[11px] py-2 px-4">
          <div className="max-w-[1400px] mx-auto flex justify-between items-center">
            <div className="flex gap-6 items-center">
              <span className="flex items-center gap-2">📞 02-123-4567</span>
              <span className="flex items-center gap-2">✉️ info@ihavegpushop.com</span>
              <span className="hidden md:inline text-slate-400">|</span>
              <span className="hidden md:inline">iHAVEGPU ถ้าคุณชอบคอมพิวเตอร์ เราคือเพื่อนกัน</span>
            </div>
            <Link href="/locations" className="flex items-center gap-2 hover:text-red-500 transition">
              <span>📍</span> ค้นหาร้านค้าใกล้คุณ &gt;
            </Link>
          </div>
        </div>

        {/* 2. MAIN HEADER (โลโก้ + ค้นหา + User) */}
        <div className="border-b border-slate-100">
          <div className="max-w-[1400px] mx-auto px-4 py-4 md:py-5">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              
              {/* LOGO */}
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-4xl font-black italic tracking-tighter text-slate-800 hover:opacity-80 transition">
                  iHAVE<span className="text-red-600 border-2 border-slate-800 px-1 ml-1 rounded-sm text-3xl not-italic font-bold">GPU</span>
                </h1>
              </Link>

              {/* SEARCH BAR (ยาวๆ ตรงกลาง) */}
              <div className="flex-1 w-full relative">
                 <div className="relative w-full">
                    {/* เราต้องส่ง Class ไปให้ SearchBar เพื่อให้มันยืดเต็ม */}
                    <div className="w-full">
                      <SearchBar /> 
                    </div>
                 </div>
              </div>

              {/* USER MENU (ขวาสุด) */}
              <div className="flex items-center gap-3 flex-shrink-0">
                 {/* Admin Btn */}
                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                 {(user as any)?.role === 'ADMIN' && (
                    <Link href="/admin" className="px-3 py-1 bg-red-100 text-red-600 rounded text-xs font-bold uppercase hover:bg-red-200">Admin</Link>
                 )}

                 {user ? (
                   <div className="flex items-center gap-4">
                     {/* ชื่อ User (วงกลม) */}
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-200">
                        {user.name?.substring(0, 2).toUpperCase()}
                     </div>
                     
                     {/* ตะกร้าสินค้า (จำลอง) */}
                     <div className="relative cursor-pointer hover:opacity-70">
                        <span className="text-2xl">🛍️</span>
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                     </div>

                     {/* Logout */}
                     <form action={async () => { 'use server'; await signOut() }}>
                        <button className="text-xs text-slate-400 hover:text-red-600 underline">Logout</button>
                     </form>
                   </div>
                 ) : (
                   <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-red-600 flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-full hover:border-red-600 transition">
                     👤 เข้าสู่ระบบ
                   </Link>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. NAVIGATION BAR (แถบเมนูล่าง) */}
        <div className="hidden md:block bg-white shadow-sm">
           <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-12">
              
              {/* ปุ่มหมวดหมู่ (ซ้ายสุด) */}
              <div className="relative group h-full flex items-center">
                 <button className="flex items-center gap-2 bg-slate-50 text-slate-700 px-4 h-10 rounded-md text-sm font-bold border border-slate-200 hover:bg-slate-100 transition">
                    <span className="text-lg">::</span> หมวดหมู่สินค้า
                 </button>
                 
                 {/* Dropdown Menu (ซ่อนอยู่ จะโชว์เมื่อ Hover) */}
                 <div className="absolute top-full left-0 w-64 bg-white shadow-xl border border-slate-100 rounded-b-lg hidden group-hover:block z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {CATEGORIES.map((cat) => (
                       <Link 
                         key={cat.id} 
                         href={`/?category=${cat.id}`}
                         className="block px-6 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 hover:pl-8 transition-all border-b border-slate-50 last:border-0"
                       >
                          <span className="mr-2 opacity-70">{cat.icon}</span> {cat.name}
                       </Link>
                    ))}
                 </div>
              </div>

              {/* เมนูหลัก (ขวา) */}
              <nav className="flex gap-8 text-sm font-bold text-slate-600">
                 <Link href="/" className="text-red-600 border-b-2 border-red-600 h-12 flex items-center px-2">หน้าแรก</Link>
                 <Link href="/?category=CPU" className="h-12 flex items-center px-2 hover:text-red-600 transition">คอมพิวเตอร์เซต</Link>
                 <Link href="/?category=GPU" className="h-12 flex items-center px-2 hover:text-red-600 transition">จัดสเปคคอม</Link>
                 <Link href="/locations" className="h-12 flex items-center px-2 hover:text-red-600 transition">บทความ</Link>
                 <Link href="/locations" className="h-12 flex items-center px-2 hover:text-red-600 transition">ติดต่อเรา</Link>
                 <Link href="/locations" className="h-12 flex items-center px-2 hover:text-red-600 transition">เกี่ยวกับเรา</Link>
              </nav>

           </div>
        </div>
      </header>

      {/* ================= HERO BANNER ================= */}
      {/* (ส่วนนี้เหมือนเดิม) */}
      {!q && currentCategory === 'ALL' && (
        <div className="w-full bg-white mb-8 border-b border-slate-100">
           <div className="max-w-[1400px] mx-auto">
              <div className="relative h-[200px] md:h-[400px] w-full overflow-hidden bg-slate-200">
                <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2642" className="w-full h-full object-cover" alt="Banner" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-8 md:px-16">
                   <div className="text-white">
                      <h1 className="text-3xl md:text-6xl font-black mb-2 italic">DOMINATE THE BEST</h1>
                      <p className="text-slate-200 text-sm md:text-lg mb-6 max-w-lg">
                        พบกับอุปกรณ์คอมพิวเตอร์ระดับ High-End ที่คัดสรรมาเพื่อคุณโดยเฉพาะ
                      </p>
                      <Link href="/?category=CPU" className="bg-red-600 text-white px-8 py-3 rounded font-bold hover:bg-red-700 transition">
                        ช้อปเลย &gt;
                      </Link>
                   </div>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row gap-8 mt-8">
        
        {/* SIDEBAR (เมนูซ้าย - แสดงตลอดเหมือนเว็บต้นฉบับ) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
           <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden sticky top-40">
              <div className="bg-slate-50 text-slate-800 px-4 py-3 font-bold border-b border-slate-100 flex items-center justify-between">
                 <span>📂 หมวดหมู่สินค้า</span>
                 <span className="text-xs text-red-600 cursor-pointer">ดูทั้งหมด &gt;</span>
              </div>
              <div className="flex flex-col">
                 {CATEGORIES.map((cat) => (
                    <Link 
                      key={cat.id} 
                      href={`/?category=${cat.id}`}
                      className={`px-4 py-3 text-sm font-medium border-b border-slate-50 hover:bg-red-50 hover:text-red-600 hover:pl-6 transition-all flex items-center gap-3
                        ${currentCategory === cat.id ? 'bg-red-50 text-red-600 font-bold' : 'text-slate-600'}
                      `}
                    >
                       <span className="opacity-70 w-5 text-center">{cat.icon}</span> {cat.name}
                    </Link>
                 ))}
              </div>
           </div>
        </aside>

        {/* PRODUCT GRID (ขวา) */}
        <main className="flex-1">
           <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 <span className="text-red-600 text-2xl">⚡</span>
                 {currentCategory === 'ALL' ? 'สินค้าแนะนำ' : CATEGORIES.find(c => c.id === currentCategory)?.name || currentCategory}
              </h2>
              <span className="text-slate-500 text-sm">{products.length} รายการ</span>
           </div>

           {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  isFavorite={favoriteIds.includes(product.id)} 
                />
              ))}
            </div>
           ) : (
             <div className="bg-white p-12 rounded-lg border border-slate-100 text-center shadow-sm h-96 flex flex-col items-center justify-center">
                <p className="text-6xl mb-4 grayscale opacity-20">📦</p>
                <p className="text-slate-400 text-lg">ไม่พบสินค้าในหมวดหมู่นี้</p>
                <Link href="/" className="mt-4 text-red-600 hover:underline">กลับหน้าแรก</Link>
             </div>
           )}
        </main>
      </div>
      
      <BuildSummaryBar />
    </div>
  )
}