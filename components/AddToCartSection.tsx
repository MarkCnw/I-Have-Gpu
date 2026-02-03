// components/AddToCartSection.tsx
'use client'

import { useState } from 'react'
import { ShoppingCart, Zap } from 'lucide-react'
import toast from 'react-hot-toast'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AddToCartSection({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    try {
      // 1. ดึงตะกร้าเดิมมา
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]')

      // 2. สร้างสินค้าชิ้นใหม่ที่จะเพิ่ม
      const newItem = {
        ...product,
        cartId: `${product.id}-${Date.now()}`, // Unique ID สำหรับตะกร้า
        quantity: quantity,
        addedAt: new Date().toISOString()
      }

      // 3. บันทึกลง LocalStorage
      const updatedCart = [...currentCart, newItem]
      localStorage.setItem('cart', JSON.stringify(updatedCart))

      // 🔥 4. ส่งสัญญาณให้ NavbarCart รู้ว่ามีของใหม่มาแล้ว! (สำคัญ)
      window.dispatchEvent(new Event('cart-updated'))

      toast.success('เพิ่มสินค้าลงตะกร้าเรียบร้อย')
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการหยิบใส่ตะกร้า')
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    window.location.href = '/cart'
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity Selector (ถ้ามี) หรือจะข้ามไปปุ่มเลยก็ได้ */}
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-neutral-900 text-neutral-900 font-bold hover:bg-neutral-50 transition-all active:scale-95"
        >
          <ShoppingCart size={20} />
          ใส่ตะกร้า
        </button>

        <button
          onClick={handleBuyNow}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
        >
          ซื้อเลย <Zap size={18} fill="currentColor" />
        </button>
      </div>
      
      <p className="text-xs text-neutral-400 text-center flex items-center justify-center gap-1 mt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        จัดส่งฟรีทั่วไทย เมื่อช้อปครบ 5,000.-
      </p>
    </div>
  )
}