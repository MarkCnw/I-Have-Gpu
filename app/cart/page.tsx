// app/cart/page.tsx
'use client'

import { useCartStore } from '@/app/store/useCartStore'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Trash2 } from 'lucide-react' // 👈 Import

export default function CartPage() {
  const { cart, removeFromCart, getCartTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  const total = getCartTotal()

  const handleCheckout = async () => {
    if (!confirm(`ยืนยันการสั่งซื้อรวม ฿${total.toLocaleString()}?`)) return

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, totalPrice: total })
      })

      const data = await res.json()
      if (data.success) {
        alert('🎉 สั่งซื้อสำเร็จ!')
        clearCart()
        window.location.href = '/orders'
      } else {
        alert('❌ ' + data.error)
      }
    } catch (err) {
      alert('❌ เชื่อมต่อ Server ไม่ได้')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
        {/* Empty State */}
        <ShoppingCart size={64} className="text-neutral-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800">ตะกร้าของคุณว่างเปล่า</h1>
        <Link href="/" className="mt-6 bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-neutral-800 transition">
          กลับไปเลือกสินค้า
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <ShoppingCart /> ตะกร้าสินค้า ({cart.length})
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 flex gap-4 items-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="object-contain w-full h-full" />
                  ) : (
                    <Camera className="text-neutral-300" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{item.name}</h3>
                  <p className="text-sm text-slate-500">จำนวน: {item.quantity}</p>
                  <p className="text-red-600 font-bold">฿{item.price.toLocaleString()}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-600 p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <div className="w-full md:w-80 h-fit bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h2 className="font-bold text-lg mb-4">สรุปคำสั่งซื้อ</h2>
            <div className="flex justify-between mb-6 pt-4 border-t border-slate-100">
              <span className="font-bold">ยอดรวมสุทธิ</span>
              <span className="font-bold text-red-600 text-xl">฿{total.toLocaleString()}</span>
            </div>
            <button onClick={handleCheckout} disabled={loading} className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-neutral-800 disabled:opacity-50 transition">
              {loading ? 'กำลังดำเนินการ...' : 'ชำระเงิน'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}