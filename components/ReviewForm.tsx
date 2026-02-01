// components/ReviewForm.tsx
'use client'

import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false) // เปิด/ปิดฟอร์ม
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirm('ยืนยันการส่งรีวิว?')) return

    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment })
      })

      if (res.ok) {
        alert('ขอบคุณสำหรับรีวิวครับ! 🎉')
        setComment('')
        setIsOpen(false)
        router.refresh() // รีโหลดหน้าเพื่อโชว์รีวิวใหม่
      } else {
        alert('เกิดข้อผิดพลาด หรือคุณยังไม่ได้เข้าสู่ระบบ')
      }
    } catch (err) {
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-neutral-800 transition flex items-center gap-2"
      >
        <Star size={16} /> เขียนรีวิวสินค้า
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 animate-in slide-in-from-top-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800">เขียนรีวิวของคุณ</h3>
        <button type="button" onClick={() => setIsOpen(false)} className="text-xs text-slate-400 hover:text-red-500">ยกเลิก</button>
      </div>

      {/* เลือกดาว */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`${star <= rating ? 'text-yellow-400' : 'text-slate-300'} transition hover:scale-110`}
          >
            <Star size={24} fill="currentColor" />
          </button>
        ))}
        <span className="ml-2 text-sm text-slate-500 font-medium">({rating}/5 คะแนน)</span>
      </div>

      {/* ช่องกรอกข้อความ */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="สินค้าเป็นอย่างไรบ้าง? เล่าให้เพื่อนๆ ฟังหน่อย..."
        className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/10 min-h-[100px] text-sm"
        required
      />

      <div className="mt-4 flex justify-end">
        <button 
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-neutral-800 transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? 'กำลังส่ง...' : <><Send size={16} /> ส่งรีวิว</>}
        </button>
      </div>
    </form>
  )
}