// components/ReviewForm.tsx
'use client'

import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import ConfirmModal from './ConfirmModal'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { locale } = useLanguageStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConfirmOpen(true)
  }

  const submitReview = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment })
      })

      if (res.ok) {
        toast.success(t('review.success', locale))
        setComment('')
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error(t('review.error', locale))
      }
    } catch (err) {
      toast.error(t('review.connectionError', locale))
    } finally {
      setLoading(false)
      setIsConfirmOpen(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-foreground text-surface-card px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition flex items-center gap-2"
      >
        <Star size={16} /> {t('review.writeReview', locale)}
      </button>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-surface-bg p-6 rounded-xl border border-border-main mb-8 animate-in slide-in-from-top-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-foreground">{t('review.yourReview', locale)}</h3>
          <button type="button" onClick={() => setIsOpen(false)} className="text-xs text-txt-muted hover:text-red-500">{t('review.cancel', locale)}</button>
        </div>

        {/* Star Rating */}
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`${star <= rating ? 'text-yellow-400' : 'text-txt-muted'} transition hover:scale-110`}
            >
              <Star size={24} fill="currentColor" />
            </button>
          ))}
          <span className="ml-2 text-sm text-txt-muted font-medium">({rating}/5 {t('review.score', locale)})</span>
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('review.placeholder', locale)}
          className="w-full p-3 border border-border-main rounded-lg mb-4 outline-none focus:border-foreground resize-none h-24 bg-surface-card text-foreground"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground text-surface-card py-2.5 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send size={16} /> {loading ? t('review.sending', locale) : t('review.submit', locale)}
        </button>
      </form>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={submitReview}
        title={t('review.confirmTitle', locale)}
        message={t('review.confirmMsg', locale)}
        confirmText={t('review.submit', locale)}
        loading={loading}
        variant="info"
      />
    </>
  )
}