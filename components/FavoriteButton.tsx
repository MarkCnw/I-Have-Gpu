// components/FavoriteButton.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function FavoriteButton({ productId, initialIsFavorite }: { productId: string, initialIsFavorite: boolean }) {
  const router = useRouter()
  const [isFav, setIsFav] = useState(initialIsFavorite)
  const [loading, setLoading] = useState(false)

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault() // ป้องกันไม่ให้คลิกทะลุไปโดน Product Card
    e.stopPropagation()

    setLoading(true)
    // Optimistic Update (เปลี่ยนสีก่อนยิง API เพื่อความลื่น)
    setIsFav(!isFav) 

    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    })

    if (!res.ok) {
      // ถ้า Error ให้เปลี่ยนสีกลับ
      setIsFav(!isFav)
      if (res.status === 401) toast.error('กรุณาเข้าสู่ระบบก่อนกดถูกใจ')
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`absolute top-2 left-2 p-2 rounded-full shadow-md transition-all z-20
        ${isFav 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-slate-800/80 text-slate-400 hover:text-red-400 hover:bg-slate-800'
        }
      `}
    >
      {/* Icon หัวใจ SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    </button>
  )
}