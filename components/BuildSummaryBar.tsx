// components/BuildSummaryBar.tsx
'use client'

import { useBuilderStore } from '@/app/store/useBuilderStore'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import ConfirmModal from './ConfirmModal'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function BuildSummaryBar() {
  const { selectedParts, getTotalPrice, removePart } = useBuilderStore()
  const [loading, setLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { locale } = useLanguageStore()

  const totalPrice = getTotalPrice()
  const selectedItems = Object.values(selectedParts).filter((item) => item !== null)

  if (selectedItems.length === 0) return null

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedItems,
          totalPrice: totalPrice
        })
      })

      const data = await res.json()

      if (data.success) {
        toast.success('✅ ' + t('buildSummary.orderSuccess', locale) + ' Order ID: ' + data.orderId)
        window.location.reload()
      } else {
        toast.error('❌ ' + t('buildSummary.orderError', locale) + ': ' + data.error)
      }
    } catch (err) {
      toast.error('❌ ' + t('buildSummary.connectionError', locale))
    } finally {
      setLoading(false)
      setIsConfirmOpen(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-surface-card border-t-2 border-border-main shadow-xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center gap-4">

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 flex-1">
              <span className="text-sm font-medium text-txt-secondary whitespace-nowrap">
                {t('buildSummary.yourBuild', locale)} ({selectedItems.length}):
              </span>
              <div className="flex gap-2">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative group flex-shrink-0 bg-surface-bg rounded-lg p-2 hover:bg-surface-card-hover transition"
                  >
                    <div className="w-12 h-12 bg-surface-card rounded overflow-hidden">
                      <img
                        src={item.image || ''}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      onClick={() => removePart(item.category)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right">
                <div className="text-xs text-txt-muted">{t('buildSummary.totalPrice', locale)}</div>
                <div className="text-2xl font-bold text-foreground">
                  ฿{totalPrice.toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => setIsConfirmOpen(true)}
                disabled={loading}
                className={`
                  px-8 py-3 rounded-lg font-medium text-white transition-all
                  ${loading
                    ? 'bg-gray-400 cursor-wait'
                    : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {loading ? t('buildSummary.processing', locale) : t('buildSummary.checkout', locale)}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleCheckout}
        title={t('buildSummary.confirmTitle', locale)}
        message={`฿${totalPrice.toLocaleString()} — ${t('buildSummary.confirmMsg', locale)}`}
        confirmText={t('buildSummary.pay', locale)}
        loading={loading}
        variant="info"
      />
    </>
  )
}