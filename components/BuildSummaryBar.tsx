// components/BuildSummaryBar.tsx
'use client'

import { useBuilderStore } from '@/app/store/useBuilderStore'
import { useState } from 'react' // 👈 เพิ่ม


export default function BuildSummaryBar() {
  const { selectedParts, getTotalPrice, removePart } = useBuilderStore()
  const [loading, setLoading] = useState(false) // 👈 เพิ่มสถานะ Loading

  const totalPrice = getTotalPrice()
  const selectedItems = Object.values(selectedParts).filter((item) => item !== null)

  if (selectedItems.length === 0) return null

  // 🔥 ฟังก์ชันกดสั่งซื้อ
  const handleCheckout = async () => {
    const confirm = window.confirm(`ยืนยันการสั่งซื้อรวม ฿${totalPrice.toLocaleString()}?`)
    if (!confirm) return

    setLoading(true)
    try {
      // ยิงข้อมูลไปหา API หลังบ้าน
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedItems,
          totalPrice: totalPrice
        })
      })

      const data = await res.json()

      if (data.success) {
        alert('🎉 สั่งซื้อสำเร็จ! Order ID: ' + data.orderId)
        // ของจริงควรเคลียร์ตะกร้า หรือ redirect ไปหน้า Thank you
        window.location.reload() // รีเฟรชหน้าเพื่อเริ่มใหม่
      } else {
        alert('❌ เกิดข้อผิดพลาด: ' + data.error)
      }
    } catch (err) {
      alert('❌ เชื่อมต่อ Server ไม่ได้')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-md border-t border-slate-700 p-4 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* ... (ส่วนแสดงรายการ icon สินค้า เหมือนเดิม ไม่ต้องแก้) ... */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
           {/* Copy โค้ดเดิมส่วน map selectedItems มาวางตรงนี้ */}
           {selectedItems.map((item) => (
            <div key={item.id} className="relative group flex-shrink-0">
               <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-slate-600">
                  <img src={item.image || ''} alt={item.name} className="w-full h-full object-contain" />
               </div>
               <button
                  onClick={() => removePart(item.category)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-sm"
               >
                  ×
               </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right">
            <p className="text-sm text-slate-400">Total Price</p>
            <p className="text-3xl font-bold text-emerald-400">
              ฿{totalPrice.toLocaleString()}
            </p>
          </div>
          
          {/* ปรับปรุงปุ่มให้รองรับ Loading */}
          <button 
            onClick={handleCheckout}
            disabled={loading}
            className={`px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition transform 
              ${loading 
                ? 'bg-slate-600 cursor-wait' 
                : 'bg-emerald-600 hover:bg-emerald-500 hover:scale-105 active:scale-95 text-white shadow-emerald-500/20'
              }
            `}
          >
            {loading ? 'Processing...' : 'Checkout ➔'}
          </button>
        </div>

      </div>
    </div>
  )
}