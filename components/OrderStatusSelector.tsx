// components/OrderStatusSelector.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import ConfirmModal from './ConfirmModal'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function OrderStatusSelector({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [pendingStatus, setPendingStatus] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { locale } = useLanguageStore()

  const handleChange = (newStatus: string) => {
    setPendingStatus(newStatus)
    setIsConfirmOpen(true)
  }

  const confirmChange = async () => {
    setLoading(true)
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: pendingStatus })
    })

    if (res.ok) {
      setStatus(pendingStatus)
      router.refresh()
      toast.success(t('orderStatus.success', locale))
    } else {
      toast.error('❌ ' + t('orderStatus.error', locale))
    }
    setLoading(false)
    setIsConfirmOpen(false)
  }

  const getColors = (s: string) => {
    switch (s) {
      case 'PAID': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'SHIPPED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'COMPLETED': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-700 text-slate-400'
    }
  }

  return (
    <>
      <select
        value={status}
        disabled={loading}
        onChange={(e) => handleChange(e.target.value)}
        className={`px-2 py-1 rounded text-xs font-bold border outline-none cursor-pointer appearance-none text-center min-w-[100px] ${getColors(status)}`}
      >
        <option value="PAID">{t('status.paid', locale)}</option>
        <option value="SHIPPED">{t('status.shipped', locale)}</option>
        <option value="COMPLETED">{t('status.completed', locale)}</option>
        <option value="CANCELLED">{t('status.cancelled', locale)}</option>
      </select>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmChange}
        title={t('orderStatus.confirmTitle', locale)}
        message={`${t('orderStatus.confirmMsg', locale)} → ${pendingStatus}`}
        confirmText={t('orderStatus.confirm', locale)}
        loading={loading}
        variant={pendingStatus === 'CANCELLED' ? 'danger' : 'info'}
      />
    </>
  )
}