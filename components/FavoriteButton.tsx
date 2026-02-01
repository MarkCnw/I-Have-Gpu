'use client'

import { Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast' // 👈 Toast

export default function FavoriteButton({ productId, initialIsFavorite }: { productId: string, initialIsFavorite: boolean }) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [loading, setLoading] = useState(false)

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault() // กันลิ้งค์กดไปหน้าอื่น
    if (loading) return
    
    // Optimistic UI update (เปลี่ยนสีก่อนค่อยยิง API)
    const previousState = isFavorite
    setIsFavorite(!isFavorite)
    setLoading(true)

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (res.status === 401) {
        toast.error('กรุณาเข้าสู่ระบบก่อนกดถูกใจ') // 🔥 Toast
        setIsFavorite(previousState) // คืนค่าเดิม
      } else if (!res.ok) {
        throw new Error()
      } else {
        const data = await res.json()
        // ถ้า API บอกว่า favorited: true ให้เป็น true
        setIsFavorite(data.favorited) 
        toast.success(data.favorited ? 'เพิ่มในรายการโปรด ❤️' : 'ลบจากรายการโปรด')
      }
    } catch (error) {
      setIsFavorite(previousState)
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={toggleFavorite}
      className={`p-2 rounded-full transition-all duration-200 active:scale-90 ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'}`}
    >
      <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
    </button>
  )
}