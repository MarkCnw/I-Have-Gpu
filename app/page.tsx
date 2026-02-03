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
import NavbarCart from '@/components/NavbarCart' // ✅ 1. Import ตรงนี้
import { auth } from '@/auth'
import { Prisma } from '@prisma/client'
import {
  Cpu, CircuitBoard, Gamepad2, MemoryStick, HardDrive, Zap, Box,
  Fan, Monitor, Laptop, Mouse, Keyboard, Headphones, Armchair,
  Sparkles, LayoutGrid, LogIn
} from 'lucide-react'

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

  const andConditions: Prisma.ProductWhereInput[] = []

  // กรองสินค้าที่ถูกลบ (Soft Delete)
  andConditions.push({ isArchived: false })

  if (q) {
    andConditions.push({ name: { contains: q, mode: 'insensitive' } })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (category && category !== 'ALL') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    andConditions.push({ category: category as any })
  }

  for (const key of Object.keys(params)) {
    if (key.startsWith('spec_') && params[key]) {
      const specKey = key.replace('spec_', '')
      const specValue = params[key]

      if (specValue) {
        andConditions.push({
          specs: {
            path: [specKey],
            equals: specValue
          }
        })
      }
    }
  }

  const whereCondition: Prisma.ProductWhereInput = {
    AND: andConditions
  }

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
    <div className="min-h-screen bg-white font-sans text-neutral-900 pb-32">

      {/* ================= HEADER ================= */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-100">
        
        {/* Top Row: Logo, Search, Actions */}
        <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center justify-between gap-8">

          {/* 1. LEFT: Logo */}
          <Link href="/" className="flex-shrink-0 group flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.svg"
              alt="iHAVEGPU Logo"
              width={200}
              height={60}
              className="object-contain h-16 w-auto"
              priority
            />
          </Link>

          {/* 2. CENTER: Search Bar */}
          <div className="hidden lg:block flex-1 max-w-2xl px-8">
             <SearchBar />
          </div>

          {/* 3. RIGHT: User Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
             <div className="lg:hidden">
                <SearchBar />
             </div>

             {/* ✅ 2. แทนที่ Link เดิมด้วย NavbarCart */}
             <NavbarCart />

             {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
             {(user as any)?.role === 'ADMIN' && (
                 <Link href="/admin" className="text-[10px] font-bold bg-black text-white px-2 py-1 rounded hover:bg-neutral-800">ADMIN</Link>
             )}

             {user ? (
                <ProfileDropdown user={user} />
             ) : (
                <Link href="/login" className="text-sm font-medium hover:text-neutral-500 flex items-center gap-2">
                  <LogIn size={20} /> Log in
                </Link>
             )}
          </div>
        </div>

        {/* Secondary Navigation */}
        <div>
          <div className="max-w-[1400px] mx-auto px-4 h-12 flex items-center justify-end gap-10 text-sm font-bold text-neutral-500">
            <Link href="/" className="hover:text-black transition hover:underline underline-offset-4 decoration-2">หน้าแรก</Link>
            <Link href="/warranty" className="hover:text-black transition hover:underline underline-offset-4 decoration-2">การรับประกัน</Link>
            <Link href="/contact" className="hover:text-black transition hover:underline underline-offset-4 decoration-2">ติดต่อเรา</Link>
            <Link href="/about" className="hover:text-black transition hover:underline underline-offset-4 decoration-2">เกี่ยวกับเรา</Link>
          </div>
        </div>

      </header>

      {/* ================= HERO & FEATURES SECTION ================= */}
      {!q && currentCategory === 'ALL' && !Object.keys(params).some(k => k.startsWith('spec_')) && (
        <>
          <HeroCarousel />
          <StoreFeatures />
          <BrandMarquee />
        </>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        
        {/* Categories Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-wider mb-3">
             <LayoutGrid size={14} /> Categories
          </div>
          
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.id}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all
                  ${currentCategory === cat.id
                    ? 'bg-black text-white border-black shadow-lg'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-black'
                  }
                `}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        <main>
          <div className="mb-6">
             <CategoryFilter />
          </div>

          <div className="flex items-baseline justify-between mb-8 border-b border-neutral-100 pb-4">
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
               {currentCategory === 'ALL' ? 'Selected for You' : CATEGORIES.find(c => c.id === currentCategory)?.name}
            </h2>
            <span className="text-neutral-400 text-sm font-medium">{products.length} Products</span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favoriteIds.includes(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-neutral-300">
               <Box size={64} className="mb-4 opacity-20" />
               <p className="text-neutral-400">No products found matching your filters.</p>
               <Link href="/" className="mt-4 text-black text-sm font-bold border-b border-black hover:opacity-70">Clear Filters</Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}