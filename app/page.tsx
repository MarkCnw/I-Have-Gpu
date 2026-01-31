// app/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import ProfileDropdown from '@/components/ProfileDropdown'
import { auth, signOut } from '@/auth'
import { Prisma } from '@prisma/client'
// 1. Import ไอคอนจาก Lucide
import { 
  Cpu, CircuitBoard, Gamepad2, MemoryStick, HardDrive, Zap, Box, 
  Fan, Monitor, Laptop, Mouse, Keyboard, Headphones, Armchair, 
  Sparkles, LayoutGrid, ShoppingBag, LogIn 
} from 'lucide-react'

export const dynamic = 'force-dynamic'

// 2. เปลี่ยน Emoji เป็น Component
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
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const session = await auth()
  const user = session?.user
  const { q, category } = await searchParams
  const currentCategory = category || 'ALL'

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
    <div className="min-h-screen bg-white font-sans text-neutral-900 pb-32">
      
      {/* ================= HEADER ================= */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-100">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
            
            <Link href="/" className="flex-shrink-0 group flex items-center gap-2">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg font-bold italic text-lg group-hover:bg-neutral-800 transition">i</div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900 group-hover:opacity-70 transition">
                iHAVE<span className="font-normal text-neutral-500">GPU</span>
              </h1>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-500">
               <Link href="/" className="hover:text-black transition">Store</Link>
               <Link href="/?category=CPU" className="hover:text-black transition">Components</Link>
               <Link href="/locations" className="hover:text-black transition">Support</Link>
            </nav>

            <div className="flex items-center gap-4">
               <div className="w-48 hidden lg:block">
                  <SearchBar /> 
               </div>

               <div className="flex items-center gap-4 pl-4 border-l border-neutral-200">
                 
                 {/* ปุ่มตะกร้าสินค้า (ใช้ Icon) */}
                 <Link href="/cart" className="relative group p-2 hover:bg-neutral-100 rounded-full transition text-neutral-600 hover:text-black">
                    <ShoppingBag size={20} />
                 </Link>

                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                 {(user as any)?.role === 'ADMIN' && (
                    <Link href="/admin" className="text-[10px] font-bold bg-black text-white px-2 py-1 rounded hover:bg-neutral-800">ADMIN</Link>
                 )}

                 {user ? (
                   <ProfileDropdown user={user} />
                 ) : (
                   <Link href="/login" className="text-sm font-medium hover:text-neutral-500 flex items-center gap-2">
                     <LogIn size={16} /> Log in
                   </Link>
                 )}
               </div>
            </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      {!q && currentCategory === 'ALL' && (
        <div className="w-full px-6 mt-6 mb-12">
           <div className="max-w-[1400px] mx-auto bg-[#F5F5F7] rounded-3xl overflow-hidden relative min-h-[400px] flex flex-col md:flex-row items-center">
              
              <div className="w-full md:w-1/2 p-12 z-10 flex flex-col justify-center items-start">
                 <span className="text-xs font-bold tracking-widest text-neutral-400 mb-4 uppercase">New Arrivals</span>
                 <h2 className="text-5xl font-bold mb-6 leading-tight text-neutral-900">
                   Pro Performance.<br/>
                   <span className="text-neutral-400">Minimal Design.</span>
                 </h2>
                 <p className="text-neutral-500 mb-8 max-w-md text-lg">
                   Upgrade your setup with the latest high-performance hardware, curated for creators and gamers.
                 </p>
                 <Link href="/?category=GPU" className="bg-black text-white px-8 py-3.5 rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-xl shadow-black/10 flex items-center gap-2">
                   Shop Now <ShoppingBag size={16} />
                 </Link>
              </div>

              <div className="w-full md:w-1/2 h-64 md:h-full relative">
                 <img 
                   src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2642" 
                   className="w-full h-full object-cover mix-blend-overlay opacity-80" 
                   alt="Hero Banner" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-[#F5F5F7]"></div>
              </div>
           </div>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row gap-12 pt-4">
        
        {/* SIDEBAR */}
        <aside className="hidden md:block w-48 flex-shrink-0">
           <div className="sticky top-28">
             <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-6 px-2 flex items-center gap-2">
               <LayoutGrid size={14} /> Browse
             </h3>
             <div className="flex flex-col space-y-1">
                {CATEGORIES.map((cat) => (
                   <Link 
                     key={cat.id} 
                     href={`/?category=${cat.id}`}
                     className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center justify-between group
                       ${currentCategory === cat.id 
                         ? 'bg-black text-white font-medium shadow-md' 
                         : 'text-neutral-500 hover:bg-neutral-100 hover:text-black'
                       }
                     `}
                   >
                      <div className="flex items-center gap-3">
                        <span className={currentCategory === cat.id ? 'text-white' : 'text-neutral-400 group-hover:text-black'}>
                          {cat.icon}
                        </span>
                        <span>{cat.name}</span>
                      </div>
                      {currentCategory === cat.id && <span className="text-[10px]">●</span>}
                   </Link>
                ))}
             </div>
           </div>
        </aside>

        {/* PRODUCT GRID */}
        <main className="flex-1">
           <div className="flex items-baseline justify-between mb-8 border-b border-neutral-100 pb-4">
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
                 {currentCategory === 'ALL' ? 'Selected for You' : CATEGORIES.find(c => c.id === currentCategory)?.name}
              </h2>
              <span className="text-neutral-400 text-sm font-medium">{products.length} Products</span>
           </div>

           {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
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
                <p className="text-neutral-400">No products found.</p>
                <Link href="/" className="mt-4 text-black text-sm font-bold border-b border-black hover:opacity-70">Clear Filters</Link>
             </div>
           )}
        </main>
      </div>
    </div>
  )
}