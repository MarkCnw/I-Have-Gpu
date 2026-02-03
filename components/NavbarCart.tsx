// components/NavbarCart.tsx
'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function NavbarCart() {
  const [count, setCount] = useState(0)

  // ฟังก์ชันดึงข้อมูลตะกร้า
  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCount(cart.length)
    } catch (error) {
      setCount(0)
    }
  }

  useEffect(() => {
    // 1. เช็คครั้งแรกตอนโหลด
    updateCartCount()

    // 2. ดักจับ Event 'cart-updated' (ที่เราจะสร้างในปุ่ม AddToCart)
    const handleCartUpdate = () => updateCartCount()
    window.addEventListener('cart-updated', handleCartUpdate)

    // 3. ดักจับ storage event (เผื่อเปิดหลาย tab)
    window.addEventListener('storage', updateCartCount)

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate)
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  return (
    <Link 
      href="/cart" 
      className="relative group p-2 hover:bg-neutral-100 rounded-full transition text-neutral-600 hover:text-black"
    >
      <ShoppingBag size={24} />
      
      {/* Badge แจ้งเตือนตัวเลข */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full border-2 border-white shadow-sm transform group-hover:scale-110 transition-transform">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}