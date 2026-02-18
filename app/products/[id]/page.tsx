// app/products/[id]/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { AlertCircle } from 'lucide-react'
import ProductDetailClient from './ProductDetailClient'

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
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-txt-muted">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertCircle size={40} className="text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">ไม่พบสินค้า</h1>
      <Link href="/" className="mt-4 px-6 py-2.5 bg-foreground text-surface-card rounded-lg hover:opacity-90">กลับไปหน้าแรก</Link>
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

  // Serialization for Client Component
  const serializedProduct = {
    ...product,
    price: Number(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    reviews: product.reviews.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString()
    }))
  }

  const serializedRelated = relatedProducts.map(p => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    reviews: [] // No reviews needed for related cards
  }))

  return (
    <ProductDetailClient
      product={serializedProduct}
      relatedProducts={serializedRelated}
      images={images}
      isFavorite={isFavorite}
      averageRating={averageRating}
      totalReviews={totalReviews}
    />
  )
}