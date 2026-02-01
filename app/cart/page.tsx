// app/cart/page.tsx
'use client'

import { useCartStore } from '@/app/store/useCartStore'
import { Trash2, Minus, Plus, ShoppingBag, MapPin, ArrowRight, AlertCircle, FileText } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  // --- Address State ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')

  // --- Tax Invoice State (ใหม่!) ---
  const [needTaxInvoice, setNeedTaxInvoice] = useState(false)
  const [taxInfo, setTaxInfo] = useState({
    taxId: '',
    taxName: '',
    taxAddress: ''
  })

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/addresses')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setAddresses(data)
            const defaultAddr = data.find((a: any) => a.isDefault) || data[0]
            setSelectedAddressId(defaultAddr.id)
          }
        })
    }
  }, [session])

  const handleCheckout = async () => {
    if (!session) return router.push('/login')
    if (addresses.length === 0) return alert('กรุณาเพิ่มที่อยู่จัดส่งก่อน')
    if (!selectedAddressId) return alert('กรุณาเลือกที่อยู่จัดส่ง')

    // --- Validation (ตรวจสอบความถูกต้อง) ---
    if (needTaxInvoice) {
      if (!taxInfo.taxName) return alert('กรุณากรอกชื่อบริษัท/บุคคล สำหรับใบกำกับภาษี')
      if (!/^\d{13}$/.test(taxInfo.taxId)) return alert('เลขผู้เสียภาษีต้องเป็นตัวเลข 13 หลักเท่านั้น')
      if (!taxInfo.taxAddress) return alert('กรุณากรอกที่อยู่สำหรับใบกำกับภาษี')
    }

    if (!confirm('ยืนยันการสั่งซื้อ?')) return

    setLoading(true) // 🔒 เริ่มโหลด (กันกดเบิ้ล)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items, 
          totalPrice: totalPrice(),
          addressId: selectedAddressId,
          taxInfo: needTaxInvoice ? taxInfo : null // ส่งข้อมูลภาษีไปด้วย (ถ้ามี)
        })
      })

      const data = await res.json()

      if (res.ok) {
        clearCart()
        // alert('🎉 สั่งซื้อสำเร็จ!') <-- ตัดออกเพื่อให้ flow ไหลลื่น
        router.push('/orders') 
      } else {
        alert(data.error || 'สั่งซื้อไม่สำเร็จ')
        setLoading(false) // 🔓 ปลดล็อกถ้าพัง
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center">
          <ShoppingBag size={40} className="text-neutral-400" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-800">ตะกร้าว่างเปล่า</h1>
        <Link href="/" className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-neutral-800 transition">
          ไปเลือกซื้อสินค้า
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <ShoppingBag /> ตะกร้าสินค้า ({items.length})
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* รายการสินค้า */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 p-4 border border-neutral-100 rounded-xl bg-white shadow-sm">
              <div className="w-24 h-24 bg-neutral-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                <img src={item.image || ''} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-neutral-900 line-clamp-1">{item.name}</h3>
                  <p className="text-sm text-neutral-500">{item.category}</p>
                </div>
                <div className="flex justify-between items-end">
                  <div className="font-mono font-bold text-lg">฿{item.price.toLocaleString()}</div>
                  <div className="flex items-center gap-3 bg-neutral-100 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-neutral-50"><Minus size={14} /></button>
                    <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-neutral-50"><Plus size={14} /></button>
                  </div>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-neutral-300 hover:text-red-500 transition self-start"><Trash2 size={20} /></button>
            </div>
          ))}
        </div>

        {/* สรุปยอด & Checkout Form */}
        <div className="w-full lg:w-[400px] h-fit sticky top-24">
          <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
            <h3 className="font-bold text-lg mb-4">สรุปคำสั่งซื้อ</h3>
            
            <div className="flex justify-between mb-2 text-neutral-600">
              <span>ยอดรวมสินค้า</span>
              <span>฿{totalPrice().toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-4 text-neutral-600">
              <span>ค่าจัดส่ง</span>
              <span className="text-green-600 font-bold">ฟรี</span>
            </div>
            <div className="border-t border-neutral-200 my-4 pt-4 flex justify-between items-end">
              <span className="font-bold text-xl">ยอดสุทธิ</span>
              <span className="font-bold text-2xl text-black">฿{totalPrice().toLocaleString()}</span>
            </div>

            {/* ส่วนเลือกที่อยู่ */}
            <div className="mb-6 pt-4 border-t border-neutral-200">
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><MapPin size={16} /> ที่อยู่จัดส่ง</h4>
              {addresses.length > 0 ? (
                <select className="w-full p-3 text-sm border border-neutral-300 rounded-lg bg-white outline-none focus:border-black transition" value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {addresses.map((addr: any) => (
                    <option key={addr.id} value={addr.id}>{addr.name} ({addr.province})</option>
                  ))}
                </select>
              ) : (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-start gap-2">
                   <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                   <Link href="/profile" className="underline font-bold">เพิ่มที่อยู่ใหม่</Link>
                </div>
              )}
            </div>

            {/* 🔥 ส่วนขอใบกำกับภาษี (ใหม่!) */}
            <div className="mb-6 pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-2 mb-3">
                <input 
                  type="checkbox" 
                  id="tax" 
                  className="w-4 h-4 accent-black"
                  checked={needTaxInvoice} 
                  onChange={(e) => setNeedTaxInvoice(e.target.checked)} 
                />
                <label htmlFor="tax" className="font-bold text-sm flex items-center gap-2 cursor-pointer">
                  <FileText size={16} /> ขอใบกำกับภาษีเต็มรูป
                </label>
              </div>

              {needTaxInvoice && (
                <div className="space-y-3 animate-in slide-in-from-top-2">
                  <input 
                    placeholder="เลขประจำตัวผู้เสียภาษี (13 หลัก)" 
                    className="w-full p-3 text-sm border rounded-lg outline-none focus:border-black"
                    maxLength={13}
                    value={taxInfo.taxId}
                    onChange={(e) => setTaxInfo({...taxInfo, taxId: e.target.value.replace(/\D/g, '')})} // รับเฉพาะตัวเลข
                  />
                  <input 
                    placeholder="ชื่อบริษัท / ชื่อบุคคล (สำนักงานใหญ่/สาขา)" 
                    className="w-full p-3 text-sm border rounded-lg outline-none focus:border-black"
                    value={taxInfo.taxName}
                    onChange={(e) => setTaxInfo({...taxInfo, taxName: e.target.value})}
                  />
                  <textarea 
                    placeholder="ที่อยู่ตาม ภ.พ. 20" 
                    className="w-full p-3 text-sm border rounded-lg outline-none focus:border-black resize-none h-20"
                    value={taxInfo.taxAddress}
                    onChange={(e) => setTaxInfo({...taxInfo, taxAddress: e.target.value})}
                  />
                </div>
              )}
            </div>

            {/* ปุ่ม Checkout (ป้องกันกดเบิ้ล) */}
            <button 
              onClick={handleCheckout}
              disabled={loading} // 🔒 Disable เมื่อโหลด
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-neutral-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>กำลังดำเนินการ...</>
              ) : (
                <><span className="text-lg">ยืนยันการสั่งซื้อ</span> <ArrowRight size={20} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}