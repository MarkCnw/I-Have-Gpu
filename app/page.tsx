// app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import ProfileDropdown from '@/components/ProfileDropdown'
import HeroCarousel from '@/components/HeroCarousel'
import StoreFeatures from '@/components/StoreFeatures'

import BrandMarquee from '@/components/BrandMarquee'
import CategoryFilter from '@/components/CategoryFilter'
import NavbarCart from '@/components/NavbarCart' 
import ThemeToggle from '@/components/ThemeToggle'
import { auth } from '@/auth'
import { Prisma } from '@prisma/client'
import {
  Cpu, CircuitBoard, Gamepad2, MemoryStick, HardDrive, Zap, Box,
  Fan, Monitor, Laptop, Mouse, Keyboard, Headphones, Armchair,
  Sparkles, LayoutGrid, LogIn, ArrowUpRight 
} from 'lucide-react'
import { NEWS_DATA } from '@/lib/news-data'
import { Suspense } from 'react'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'


export const dynamic = 'force-dynamic'

const CATEGORIES = [
  { id: 'ALL', name: 'All Products', icon: <Sparkles size={18} /> },
  { id: 'CPU', name: 'Processors', icon: <Cpu size={18} /> },
  { id: 'MOTHERBOARD', name: 'Motherboards', icon: <CircuitBoard size={18} /> },
  { id: 'GPU', name: 'Graphics Cards', icon: <Gamepad2 size={18} /> },
  { id: 'RAM', name: 'Memory', icon: <MemoryStick size={18} /> },
  { id: 'STORAGE', name: 'Storage', icon: <HardDrive size={18} /> },
  { id: 'PSU', name: 'Power Supply', icon: <Zap size={18} /> },
  { id: 'CASE', name: 'Cases', icon: <Box size={18} /> },
  { id: 'COOLER', name: 'Cooling', icon: <Fan size={18} /> },
  { id: 'MONITOR', name: 'Monitors', icon: <Monitor size={18} /> },
  { id: 'LAPTOP', name: 'Laptops', icon: <Laptop size={18} /> },
  { id: 'MOUSE', name: 'Mice', icon: <Mouse size={18} /> },
  { id: 'KEYBOARD', name: 'Keyboards', icon: <Keyboard size={18} /> },
  { id: 'HEADSET', name: 'Audio', icon: <Headphones size={18} /> },
  { id: 'CHAIR', name: 'Furniture', icon: <Armchair size={18} /> },
]

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 animate-pulse">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex flex-col h-[400px]">
          <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-2xl mb-4" />
          <div className="h-4 w-1/3 bg-neutral-100 dark:bg-neutral-800 rounded mb-2" />
          <div className="h-6 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded mb-2" />
          <div className="h-4 w-full bg-neutral-50 dark:bg-neutral-700 rounded mb-1" />
          <div className="h-4 w-5/6 bg-neutral-50 dark:bg-neutral-700 rounded" />
          <div className="mt-auto h-8 w-1/2 bg-neutral-100 dark:bg-neutral-800 rounded" />
        </div>
      ))}
    </div>
  )
}

async function ProductList({ searchParams }: { searchParams: any }) {
  const { q, category } = searchParams
  const session = await auth()
  const user = session?.user

  const andConditions: Prisma.ProductWhereInput[] = []
  andConditions.push({ isArchived: false })

  if (q) {
    andConditions.push({ name: { contains: q, mode: 'insensitive' } })
  }

  if (category && category !== 'ALL') {
    andConditions.push({ category: category as any })
  }

  const rawProducts = await prisma.product.findMany({
    where: { AND: andConditions },
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

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-neutral-300 dark:text-neutral-600">
         <Box size={64} className="mb-4 opacity-20" />
         <p className="text-neutral-400 dark:text-neutral-500">No products found matching your filters.</p>
         <Link href="/" className="mt-4 text-black dark:text-white text-sm font-bold border-b border-black dark:border-white hover:opacity-70">Clear Filters</Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} isFavorite={favoriteIds.includes(product.id)} />
      ))}
    </div>
  )
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const session = await auth()
  const user = session?.user
  const params = await searchParams
  const { q, category } = params
  const currentCategory = category || 'ALL'

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 font-sans text-neutral-900 dark:text-neutral-100 pb-32">
      {/* ================= HEADER ================= */}
      <header className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center justify-between gap-8">
          <Link href="/" className="flex-shrink-0 group flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logo.svg" alt="iHAVEGPU Logo" width={200} height={60} className="object-contain h-16 w-auto dark:brightness-0 dark:invert" priority />
          </Link>
          <div className="hidden lg:block flex-1 max-w-2xl px-8">
             <SearchBar />
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
             <div className="lg:hidden">
                <SearchBar />
             </div>
             <ThemeToggle />
             <NavbarCart />
             {(user as any)?.role === 'ADMIN' && (
                 <Link href="/admin" className="text-[10px] font-bold bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded hover:bg-neutral-800 dark:hover:bg-neutral-200">ADMIN</Link>
             )}
             {user ? (
                <ProfileDropdown user={user} />
             ) : (
                <Link href="/login" className="text-sm font-medium hover:text-neutral-500 dark:hover:text-neutral-400 flex items-center gap-2">
                  <LogIn size={20} /> Log in
                </Link>
             )}
          </div>
        </div>
        <div>
          <div className="max-w-[1400px] mx-auto px-4 h-12 flex items-center justify-end gap-10 text-sm font-bold text-neutral-500 dark:text-neutral-400">
            <Link href="/" className="hover:text-black dark:hover:text-white transition hover:underline underline-offset-4 decoration-2">หน้าแรก</Link>
            <Link href="/builder" className="hover:text-black dark:hover:text-white transition hover:underline underline-offset-4 decoration-2">จัดสเปคคอม</Link>
            <Link href="/warranty" className="hover:text-black dark:hover:text-white transition hover:underline underline-offset-4 decoration-2">การรับประกัน</Link>
            <Link href="/contact" className="hover:text-black dark:hover:text-white transition hover:underline underline-offset-4 decoration-2">ติดต่อเรา</Link>
            <Link href="/about" className="hover:text-black dark:hover:text-white transition hover:underline underline-offset-4 decoration-2">เกี่ยวกับเรา</Link>
          </div>
        </div>
      </header>

      {/* ================= HERO & FEATURES ================= */}
      {!q && currentCategory === 'ALL' && (
        <>
          <HeroCarousel />
          <StoreFeatures />
          <BrandMarquee />
        </>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500 text-xs font-bold uppercase tracking-wider mb-3">
             <LayoutGrid size={14} /> Categories
          </div>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.id}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all
                  ${currentCategory === cat.id ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-lg' : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:text-black dark:hover:text-white'}
                `}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <main>
          <div className="mb-6">
             <CategoryFilter />
          </div>

          <div className="flex items-baseline justify-between mb-8 border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
               {q ? `Search results for "${q}"` : (currentCategory === 'ALL' ? 'Selected for You' : CATEGORIES.find(c => c.id === currentCategory)?.name)}
            </h2>
            <span className="text-neutral-400 dark:text-neutral-500 text-sm font-medium">Products</span>
          </div>

          <Suspense key={q + currentCategory} fallback={<ProductGridSkeleton />}>
            <ProductList searchParams={params} />
          </Suspense>
        </main>

        {!q && currentCategory === 'ALL' && (
          <>
            <section className="mt-24 border-t border-neutral-100 dark:border-neutral-800 pt-16">
              <h2 className="text-2xl font-bold mb-10 flex items-center gap-2">
                <span className="w-1 h-8 bg-black dark:bg-white rounded-full"></span> ข่าวสาร & รีวิวจากผู้เชี่ยวชาญ
              </h2>
              <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group cursor-pointer border border-neutral-100 dark:border-neutral-800">
                    <iframe 
                      className="w-full h-full" 
                      src="https://www.youtube.com/embed/h15-0I2JxOo" 
                      title="YouTube video" 
                      frameBorder="0" 
                      allowFullScreen
                    ></iframe>
                  </div>
                  <h3 className="text-xl font-bold">ศึกตัวท็อป GeForce RTX 5090 VS RTX 4090 บน AMD Ryzen 7 9800X3D แรงต่างกันขนาดไหน ? | iHAVECPU</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">เจาะลึกผลทดสอบกราฟิกการ์ดสถาปัตยกรรม Blackwell รุ่นล่าสุดปี 2025 และการดึงประสิทธิภาพสูงสุดด้วย CPU X3D</p>
                </div>

                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"> 
                  {NEWS_DATA.map((post) => (
                    <Link 
                      key={post.id} 
                      href={`/news/${post.id}`} 
                      className="flex gap-5 group cursor-pointer p-2 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                    >
                      <div className="relative w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        <Image 
                          src={post.img} 
                          alt={post.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition duration-500" 
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1 group-hover:text-red-600 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                          {post.desc}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 mt-2 uppercase tracking-widest">
                          Read more <ArrowUpRight size={12} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
            <FAQ /> {/* ✅ วางไว้ตรงนี้ */}
            {/* ✅ เรียกใช้งานคอมโพเนนต์รีวิวที่แยกออกมา */}
            <Testimonials />
          </>
        )}
      </div>
    </div>
  )
}