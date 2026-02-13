// app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import HeroCarousel from '@/components/HeroCarousel'
import StoreFeatures from '@/components/StoreFeatures'
import BrandMarquee from '@/components/BrandMarquee'
import CategoryFilter from '@/components/CategoryFilter'
import { auth } from '@/auth'
import { Prisma } from '@prisma/client'
import { Box, ArrowUpRight } from 'lucide-react'
import { NEWS_DATA } from '@/lib/news-data'
import { Suspense } from 'react'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import HomeClient from '@/components/HomeClient'

export const dynamic = 'force-dynamic'

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 animate-pulse">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex flex-col h-[400px]">
          <div className="aspect-square bg-border-light rounded-2xl mb-4" />
          <div className="h-4 w-1/3 bg-border-light rounded mb-2" />
          <div className="h-6 w-3/4 bg-border-light rounded mb-2" />
          <div className="h-4 w-full bg-border-light rounded mb-1" />
          <div className="h-4 w-5/6 bg-border-light rounded" />
          <div className="mt-auto h-8 w-1/2 bg-border-light rounded" />
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
      <div className="flex flex-col items-center justify-center py-32 text-txt-muted">
        <Box size={64} className="mb-4 opacity-20" />
        <p className="text-txt-secondary">No products found matching your filters.</p>
        <Link href="/" className="mt-4 text-foreground text-sm font-bold border-b border-foreground hover:opacity-70 transition-opacity">Clear Filters</Link>
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

  const heroSection = (
    <>
      <HeroCarousel />
      <StoreFeatures />
      <BrandMarquee />
    </>
  )

  const productSection = (
    <>
      <div className="mb-6">
        <CategoryFilter />
      </div>

      <div className="flex items-baseline justify-between mb-8 border-b border-border-main pb-4">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          {q ? `Search results for "${q}"` : (currentCategory === 'ALL' ? 'Selected for You' : currentCategory)}
        </h2>
        <span className="text-txt-muted text-sm font-medium">Products</span>
      </div>

      <Suspense key={q + currentCategory} fallback={<ProductGridSkeleton />}>
        <ProductList searchParams={params} />
      </Suspense>
    </>
  )

  const newsSection = (
    <>
      <section className="mt-24 border-t border-border-main pt-16">
        <h2 className="text-2xl font-bold mb-10 flex items-center gap-2 text-foreground">
          <span className="w-1 h-8 bg-foreground rounded-full"></span> ข่าวสาร & รีวิวจากผู้เชี่ยวชาญ
        </h2>
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group cursor-pointer border border-border-main">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/h15-0I2JxOo"
                title="YouTube video"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            <h3 className="text-xl font-bold text-foreground">ศึกตัวท็อป GeForce RTX 5090 VS RTX 4090 บน AMD Ryzen 7 9800X3D แรงต่างกันขนาดไหน ? | iHAVECPU</h3>
            <p className="text-txt-secondary text-sm">เจาะลึกผลทดสอบกราฟิกการ์ดสถาปัตยกรรม Blackwell รุ่นล่าสุดปี 2025 และการดึงประสิทธิภาพสูงสุดด้วย CPU X3D</p>
          </div>

          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {NEWS_DATA.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.id}`}
                className="flex gap-5 group cursor-pointer p-2 rounded-2xl hover:bg-surface-card-hover transition"
              >
                <div className="relative w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-border-light">
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-foreground line-clamp-1 group-hover:text-red-500 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-txt-secondary mt-1 line-clamp-2">
                    {post.desc}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-txt-muted mt-2 uppercase tracking-widest">
                    Read more <ArrowUpRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FAQ />
      <Testimonials />
    </>
  )

  return (
    <HomeClient
      user={user}
      q={q}
      currentCategory={currentCategory}
      heroSection={heroSection}
      productSection={productSection}
      newsSection={newsSection}
    />
  )
}