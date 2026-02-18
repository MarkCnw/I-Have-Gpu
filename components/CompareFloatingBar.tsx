// components/CompareFloatingBar.tsx
'use client'

import { useCompareStore } from '@/app/store/useCompareStore'
import { X, ArrowRight, Scale } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function CompareFloatingBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore()
  const { locale } = useLanguageStore()

  if (compareList.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
      <div className="max-w-3xl mx-auto bg-surface-card/80 backdrop-blur-2xl border border-border-main shadow-2xl shadow-black/10 rounded-2xl p-4 pointer-events-auto">
        <div className="flex items-center justify-between flex-wrap gap-y-3">

          {/* Left: Items */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <Scale size={20} className="mx-auto mb-1 text-txt-muted" />
              <span className="text-sm font-bold text-foreground leading-tight">{t('compare.list', locale)}</span>
              <p className="text-[9px] text-txt-muted tracking-wide">{t('compare.maxItems', locale)}</p>
            </div>

            <div className="flex gap-2 ml-2">
              {[0, 1, 2].map((i) => {
                const item = compareList[i]
                return (
                  <div key={i} className={`relative group w-16 h-16 rounded-xl border-2 border-dashed transition-all flex items-center justify-center overflow-hidden
                    ${item ? 'border-foreground bg-surface-bg' : 'border-border-light bg-surface-bg/50'}
                  `}>
                    {item ? (
                      <>
                        <Image src={item.image || '/placeholder.png'} alt={item.name} fill className="object-contain p-1.5" />
                        <button
                          onClick={() => removeFromCompare(item.id)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] font-medium uppercase tracking-wider group-hover:text-txt-secondary transition-colors">{t('compare.emptySlot', locale)}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button onClick={clearCompare} className="text-xs text-red-500 hover:text-red-600 font-bold hover:underline">
              {t('compare.clearAll', locale)}
            </button>
            <Link href="/compare" className="bg-foreground text-surface-card pl-6 pr-5 py-3 rounded-full font-bold text-sm sm:text-base flex items-center gap-2 hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 ring-4 ring-transparent hover:ring-foreground/5">
              {t('compare.compareBtn', locale)} <span className="bg-white/20 px-2 py-0.5 rounded-md text-xs font-mono">{compareList.length}</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}