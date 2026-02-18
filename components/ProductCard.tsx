// components/ProductCard.tsx
'use client'

import Link from 'next/link'
import FavoriteButton from './FavoriteButton'
import { Camera } from 'lucide-react'
import { useCompareStore } from '@/app/store/useCompareStore'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductCard({ product, isFavorite = false }: { product: any, isFavorite?: boolean }) {
  const { addToCompare, removeFromCompare, compareList } = useCompareStore()
  const { locale } = useLanguageStore()

  const isAdded = compareList.some(p => p.id === product.id)

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAdded) {
      removeFromCompare(product.id)
      toast.success(t('compare.removedFromList', locale))
    } else {
      if (compareList.length >= 3) return toast.error(t('compare.max3', locale))
      if (compareList.length > 0 && compareList[0].category !== product.category) {
        return toast.error(t('compare.sameCategory', locale))
      }

      addToCompare({ ...product, price: Number(product.price) })
      toast.success(t('compare.addedToList', locale))
    }
  }

  return (
    <Link href={`/products/${product.id}`} className="block group h-full">
      <div className="bg-surface-card rounded-xl overflow-hidden border border-border-light shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative">

        {/* Favorite Button */}
        <div className="absolute top-2 right-2 z-20" onClick={(e) => e.preventDefault()}>
          <FavoriteButton productId={product.id} initialIsFavorite={isFavorite} />
        </div>

        <div className="h-56 p-6 flex items-center justify-center bg-surface-card relative overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="text-txt-muted flex flex-col items-center gap-2">
              <Camera size={40} />
              <span className="text-xs">{t('common.noImage', locale)}</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-surface-card border-t border-border-light flex flex-col flex-grow">
          <div className="text-xs text-txt-muted font-medium mb-1 uppercase tracking-wide">
            {product.category}
          </div>

          <h2 className="text-sm font-bold text-foreground mb-2 line-clamp-2 h-10 leading-tight group-hover:text-red-600 transition-colors">
            {product.name}
          </h2>

          <div className="mt-auto pt-2 flex items-center justify-between">
            <span className="text-lg font-bold text-red-600">
              ฿{Number(product.price).toLocaleString()}
            </span>

            <button
              onClick={handleCompare}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${isAdded
                ? 'bg-foreground text-surface-card border-foreground'
                : 'bg-surface-card text-txt-secondary border-border-main hover:border-foreground hover:text-foreground'
                }`}
            >
              {isAdded ? t('compare.added', locale) : t('compare.compareBtn', locale)}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}