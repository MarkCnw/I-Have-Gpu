// app/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import HeroCarousel from '@/components/HeroCarousel'
import StoreFeatures from '@/components/StoreFeatures'
import BrandMarquee from '@/components/BrandMarquee'
import CategoryFilter from '@/components/CategoryFilter'
import { auth } from '@/auth'
import { Prisma } from '@prisma/client'
import { Box } from 'lucide-react'
import { Suspense } from 'react'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import HomeClient from '@/components/HomeClient'
import ProductSectionHeader from '@/components/ProductSectionHeader'
import NewsSectionHome from '@/components/NewsSectionHome'
import CommunityShowcase from '@/components/CommunityShowcase'


export const dynamic = 'force-dynamic'

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 animate-pulse">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex flex-col h-[400px]">
          <div className="aspect-square bg-skeleton rounded-2xl mb-4" />
          <div className="h-4 w-1/3 bg-skeleton-light rounded mb-2" />
          <div className="h-6 w-3/4 bg-skeleton rounded mb-2" />
          <div className="h-4 w-full bg-skeleton-light rounded mb-1" />
          <div className="h-4 w-5/6 bg-skeleton-light rounded" />
          <div className="mt-auto h-8 w-1/2 bg-skeleton rounded" />
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
        <ProductSectionHeader type="empty" />
        <Link href="/" className="mt-4 text-foreground text-sm font-bold border-b border-foreground hover:opacity-70 transition-opacity">
          <ProductSectionHeader type="clearFilters" />
        </Link>
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
          <ProductSectionHeader type="title" q={q} currentCategory={currentCategory} />
        </h2>
        <span className="text-txt-muted text-sm font-medium"><ProductSectionHeader type="products" /></span>
      </div>

      <Suspense key={q + currentCategory} fallback={<ProductGridSkeleton />}>
        <ProductList searchParams={params} />
      </Suspense>
    </>
  )

  const newsSection = (
    <>
      <section className="mt-24 border-t border-border-main pt-16">
        <NewsSectionHome />
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
      showcaseSection={<CommunityShowcase />} // ✅ ส่ง Component เข้าไปที่ HomeClient
    />
  )
}