// components/AddToCartSection.tsx
'use client'

import { useCartStore } from '@/app/store/useCartStore'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AddToCartSection({ product }: { product: any }) {
  const { addToCart } = useCartStore()
  const router = useRouter()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000) // Reset ปุ่มหลัง 2 วิ
  }

  const handleBuyNow = () => {
    addToCart(product)
    router.push('/cart') // ไปหน้าตะกร้าทันที
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <button 
          onClick={handleAddToCart}
          className={`flex-1 py-3 rounded-lg font-bold border-2 transition
            ${isAdded 
              ? 'border-green-500 text-green-500 bg-green-50' 
              : 'border-slate-900 text-slate-900 hover:bg-slate-50'
            }
          `}
        >
          {isAdded ? '✔ ใส่ตะกร้าแล้ว' : 'ใส่ตะกร้า'}
        </button>
        
        <button 
          onClick={handleBuyNow}
          className="flex-1 py-3 rounded-lg font-bold bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30 transition"
        >
          ซื้อเลย ⚡
        </button>
      </div>
      <p className="text-xs text-slate-400 text-center mt-2">
        📦 จัดส่งฟรีทั่วไทย เมื่อช้อปครบ 5,000.-
      </p>
    </div>
  )
}