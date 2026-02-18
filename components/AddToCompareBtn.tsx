'use client'

import { useCompareStore, Product } from '@/app/store/useCompareStore'
import { Scale } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function AddToCompareBtn({ product }: { product: Product }) {
  const { addToCompare, compareList, removeFromCompare } = useCompareStore()
  const { locale } = useLanguageStore()

  const isAdded = compareList.some(p => p.id === product.id)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAdded) {
      removeFromCompare(product.id)
      toast.success(t('compare.removedFromList', locale))
    } else {
      if (compareList.length >= 3) {
        return toast.error(t('compare.max3', locale))
      }
      if (compareList.length > 0 && compareList[0].category !== product.category) {
        return toast.error(t('compare.sameCategory', locale))
      }

      addToCompare(product)
      toast.success(t('compare.addedToList', locale))
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all border ${isAdded
        ? 'bg-foreground text-surface-card border-foreground'
        : 'bg-surface-card text-txt-muted border-border-main hover:border-foreground hover:text-foreground'
        }`}
      title={t('compare.compareBtn', locale)}
    >
      <Scale size={18} />
    </button>
  )
}