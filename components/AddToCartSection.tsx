// components/AddToCartSection.tsx
'use client'

import { useState } from 'react'
import { ShoppingCart, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AddToCartSection({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1)
  const { locale } = useLanguageStore()

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

      toast.success(t('product.addedToCart', locale))
    } catch (error) {
      toast.error(t('product.addToCartError', locale))
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
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-foreground text-foreground font-bold hover:bg-surface-bg transition-all active:scale-95"
        >
          <ShoppingCart size={20} />
          {t('product.addToCart', locale)}
        </button>

        <button
          onClick={handleBuyNow}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
        >
          {t('product.buyNow', locale)} <Zap size={18} fill="currentColor" />
        </button>
      </div>

      <p className="text-xs text-txt-muted text-center flex items-center justify-center gap-1 mt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        {t('product.freeShipping', locale)}
      </p>
    </div>
  )
}