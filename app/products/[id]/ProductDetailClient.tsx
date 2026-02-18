'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    ChevronRight,
    Star,
    User,
    ShieldCheck,
    Truck,
    RotateCcw,
    Package
} from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t as translate } from '@/lib/i18n'
import FavoriteButton from '@/components/FavoriteButton'
import AddToCartSection from '@/components/AddToCartSection'
import ReviewForm from '@/components/ReviewForm'
import ProductGallery from '@/components/ProductGallery'

// Define types locally since we want to avoid complex Prisma imports in client components if possible, 
// or just use flexible types for simplicity in this migration.
// However, exact types are better.
interface ReviewUser {
    name: string | null
    image: string | null
}

interface ReviewType {
    id: string
    rating: number
    comment: string | null
    createdAt: Date | string
    user: ReviewUser
}

interface ProductType {
    id: string
    name: string
    price: number
    stock: number
    image: string | null
    category: string
    description: string | null
    specs: any
    isArchived: boolean
    reviews: ReviewType[]
    createdAt: Date | string
    updatedAt: Date | string
}

interface ProductDetailClientProps {
    product: ProductType
    relatedProducts: ProductType[]
    images: string[]
    isFavorite: boolean
    averageRating: number
    totalReviews: number
}

export default function ProductDetailClient({
    product,
    relatedProducts,
    images,
    isFavorite,
    averageRating,
    totalReviews
}: ProductDetailClientProps) {
    const { locale } = useLanguageStore()
    const t = (key: string) => translate(key, locale)

    return (
        <div className="min-h-screen bg-background font-sans text-foreground pb-24">
            {/* Breadcrumb */}
            <div className="border-b border-border-light bg-surface-card">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center text-sm text-txt-muted">
                    <Link href="/" className="hover:text-foreground">
                        {t('orders.breadcrumbHome')}
                    </Link>
                    <ChevronRight size={14} className="mx-2 text-txt-muted" />
                    <Link href={`/?category=${product.category}`} className="hover:text-foreground capitalize">
                        {product.category}
                    </Link>
                    <ChevronRight size={14} className="mx-2 text-txt-muted" />
                    <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8 md:mt-12">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-20">
                    {/* Images Section */}
                    <div className="relative">
                        {/* Favorite Button */}
                        <div className="absolute top-5 right-5 z-20">
                            <div className="bg-surface-card rounded-full p-2.5 shadow-lg border border-border-light hover:scale-110 transition-transform cursor-pointer">
                                <FavoriteButton productId={product.id} initialIsFavorite={isFavorite} />
                            </div>
                        </div>

                        <ProductGallery images={images} />
                    </div>

                    {/* Product Info Section */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 bg-surface-bg text-txt-secondary text-xs font-bold rounded-full uppercase mb-4">
                                {product.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                                            className={i < Math.round(averageRating) ? "" : "text-neutral-200"}
                                        />
                                    ))}
                                    <span className="text-txt-muted font-medium ml-1 text-foreground">
                                        ({totalReviews} {t('product.reviews')})
                                    </span>
                                </div>
                                <span className="text-txt-muted">| {t('product.id')}: {product.id.split('-')[0].toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="mb-8 p-6 bg-surface-bg rounded-2xl border border-border-light">
                            <div className="text-4xl font-bold text-foreground mb-2">
                                ฿{product.price.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 mb-6 text-sm">
                                {product.stock > 0 ? (
                                    <span className="flex items-center gap-1.5 text-success font-bold">
                                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div> {t('product.inStock')}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-danger font-bold">
                                        <div className="w-2 h-2 bg-danger rounded-full"></div> {t('product.outOfStock')}
                                    </span>
                                )}
                                <span className="text-txt-muted">| {t('product.readyToShip')}</span>
                            </div>
                            <AddToCartSection product={product} />
                        </div>

                        {/* Trust Signals */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-txt-secondary">
                            <div className="flex gap-3">
                                <ShieldCheck size={20} className="text-foreground" />
                                <div>
                                    <span className="font-bold text-foreground block">{t('product.warranty')}</span>
                                    {t('product.authentic')}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Truck size={20} className="text-foreground" />
                                <div>
                                    <span className="font-bold text-foreground block">{t('product.freeShipping')}</span>
                                    {t('product.fastDelivery')}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <RotateCcw size={20} className="text-foreground" />
                                <div>
                                    <span className="font-bold text-foreground block">{t('product.returnPolicy')}</span>
                                    {t('product.claim')}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Package size={20} className="text-foreground" />
                                <div>
                                    <span className="font-bold text-foreground block">{t('product.safePacking')}</span>
                                    {t('product.safePackingDesc')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details / Specs / Reviews */}
                <div className="grid lg:grid-cols-3 gap-12 mb-20">
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h3 className="text-2xl font-bold mb-6 flex gap-2">
                                <span className="w-1 h-8 bg-foreground rounded-full"></span> {t('product.details')}
                            </h3>
                            <div className="prose max-w-none text-txt-secondary bg-surface-card p-8 rounded-2xl border border-border-light">
                                <p>{product.description || t('product.noSpecs')}</p>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-2xl font-bold mb-6 flex gap-2">
                                <span className="w-1 h-8 bg-foreground rounded-full"></span> {t('product.specs')}
                            </h3>
                            <div className="bg-surface-card rounded-2xl border border-border-light overflow-hidden">
                                {product.specs && Object.keys(product.specs).length > 0 ? (
                                    <table className="w-full text-left text-sm">
                                        <tbody className="divide-y divide-border-light">
                                            {Object.entries(product.specs as object).map(([key, value], index) => (
                                                <tr key={key} className={index % 2 === 0 ? "bg-surface-bg" : "bg-surface-card"}>
                                                    <td className="py-4 px-6 font-medium w-1/3 capitalize">{key.replace(/_/g, ' ')}</td>
                                                    <td className="py-4 px-6 text-txt-secondary">{String(value)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-8 text-center text-txt-muted">{t('product.noSpecs')}</div>
                                )}
                            </div>
                        </section>

                        <section>
                            <div className="flex justify-between mb-8">
                                <h3 className="text-2xl font-bold flex gap-2">
                                    <span className="w-1 h-8 bg-foreground rounded-full"></span> {t('product.customerReviews')}
                                </h3>
                                <ReviewForm productId={product.id} />
                            </div>
                            <div className="space-y-6">
                                {totalReviews === 0 ? (
                                    <div className="bg-surface-bg rounded-2xl p-12 text-center border border-dashed border-border-main">
                                        <Star size={40} className="text-txt-muted mx-auto mb-4" />
                                        <p className="text-txt-muted">{t('product.noReviews')}</p>
                                    </div>
                                ) : (
                                    product.reviews.map((review) => (
                                        <div key={review.id} className="bg-surface-card p-6 rounded-2xl border border-border-light">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-surface-bg rounded-full overflow-hidden">
                                                    {review.user.image ? (
                                                        <img src={review.user.image} className="w-full h-full object-cover" alt={review.user.name || 'User'} />
                                                    ) : (
                                                        <User className="p-2 w-full h-full text-txt-muted" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm">{review.user.name || 'User'}</div>
                                                    <div className="flex text-yellow-400 text-xs">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={12}
                                                                fill={i < review.rating ? "currentColor" : "none"}
                                                                className={i < review.rating ? "" : "text-neutral-200"}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-txt-secondary text-sm">{review.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-border-light pt-16 mb-16">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            <span className="w-1 h-8 bg-foreground rounded-full"></span> {t('product.related')}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/products/${related.id}`}
                                    className="group bg-surface-card border border-border-light rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all"
                                >
                                    <div className="aspect-square relative bg-surface-bg rounded-xl mb-4 overflow-hidden">
                                        <Image
                                            src={related.image || '/placeholder.png'}
                                            alt={related.name}
                                            fill
                                            className="object-contain p-4 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-txt-muted bg-surface-bg px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                                        {related.category}
                                    </span>
                                    <h4 className="font-bold text-foreground text-sm mb-2 line-clamp-2 h-10 group-hover:text-txt-secondary transition-colors">
                                        {related.name}
                                    </h4>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-foreground">฿{related.price.toLocaleString()}</span>
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
