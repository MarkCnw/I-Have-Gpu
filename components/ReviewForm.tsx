// components/ReviewForm.tsx
'use client'

import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import ConfirmModal from './ConfirmModal'

export default function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false) // เปิด/ปิดฟอร์ม
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

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
        toast.success('ขอบคุณสำหรับรีวิวครับ! 🎉')
        setComment('')
        setIsOpen(false)
        router.refresh() // รีโหลดหน้าเพื่อโชว์รีวิวใหม่
      } else {
        toast.error('เกิดข้อผิดพลาด หรือคุณยังไม่ได้เข้าสู่ระบบ')
      }
    } catch (err) {
      toast.error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้')
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
        <Star size={16} /> เขียนรีวิวสินค้า
      </button>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-surface-bg p-6 rounded-xl border border-border-main mb-8 animate-in slide-in-from-top-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-foreground">เขียนรีวิวของคุณ</h3>
          <button type="button" onClick={() => setIsOpen(false)} className="text-xs text-txt-muted hover:text-red-500">ยกเลิก</button>
        </div>

        {/* เลือกดาว */}
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
          <span className="ml-2 text-sm text-txt-muted font-medium">({rating}/5 คะแนน)</span>
        </div>

        {/* ช่องพิมพ์รีวิว */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="เขียนความคิดเห็นของคุณ..."
          className="w-full p-3 border border-border-main rounded-lg mb-4 outline-none focus:border-foreground resize-none h-24 bg-surface-card text-foreground"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground text-surface-card py-2.5 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send size={16} /> {loading ? 'กำลังส่ง...' : 'ส่งรีวิว'}
        </button>
      </form>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={submitReview}
        title="ยืนยันการส่งรีวิว"
        message="คุณต้องการส่งรีวิวนี้ใช่หรือไม่?"
        confirmText="ส่งรีวิว"
        loading={loading}
        variant="info"
      />
    </>
  )
}