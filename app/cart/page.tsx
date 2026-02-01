// app/cart/page.tsx
'use client'

import { useCartStore } from '@/app/store/useCartStore'
import { Trash2, Minus, Plus, ShoppingBag, MapPin, ArrowRight, AlertCircle, FileText } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast' // 👈 1. Import toast

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  // --- Address State ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')

  // --- Tax Invoice State ---
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
    if (!session) {
        toast.error('กรุณาเข้าสู่ระบบก่อนสั่งซื้อ') // 🔥 ใช้ toast แทน alert
        return router.push('/login')
    }
    if (addresses.length === 0) return toast.error('กรุณาเพิ่มที่อยู่จัดส่งก่อน')
    if (!selectedAddressId) return toast.error('กรุณาเลือกที่อยู่จัดส่ง')

    // --- Validation ---
    if (needTaxInvoice) {
      if (!taxInfo.taxName) return toast.error('กรุณากรอกชื่อบริษัท/บุคคล สำหรับใบกำกับภาษี')
      if (!/^\d{13}$/.test(taxInfo.taxId)) return toast.error('เลขผู้เสียภาษีต้องเป็นตัวเลข 13 หลักเท่านั้น')
      if (!taxInfo.taxAddress) return toast.error('กรุณากรอกที่อยู่สำหรับใบกำกับภาษี')
    }

    // ใช้ confirm แบบเดิมไปก่อน (หรือจะเปลี่ยนเป็น Custom Modal ก็ได้ แต่ toast.promise จะช่วยเรื่อง UX ตอนโหลด)
    if (!confirm('ยืนยันการสั่งซื้อ?')) return 

    setLoading(true)
    
    // 🔥 ใช้ toast.promise เพื่อโชว์สถานะ Loading -> Success/Error แบบสวยๆ
    const checkoutPromise = fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items, 
          totalPrice: totalPrice(),
          addressId: selectedAddressId,
          taxInfo: needTaxInvoice ? taxInfo : null
        })
    }).then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'สั่งซื้อไม่สำเร็จ')
        return data
    })

    toast.promise(checkoutPromise, {
        loading: 'กำลังดำเนินการ...',
        success: (data) => {
            clearCart()
            router.push(`/order-success?id=${data.orderId}`)
            return 'สั่งซื้อสำเร็จ! 🎉'
        },
        error: (err) => {
            setLoading(false)
            return err.message || 'เกิดข้อผิดพลาด'
        }
    })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-2">
          <ShoppingBag size={48} className="text-neutral-400" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-800">ตะกร้าว่างเปล่า</h1>
        <p className="text-neutral-500">ยังไม่มีสินค้าในตะกร้าของคุณ</p>
        <Link href="/" className="mt-4 bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-neutral-800 transition shadow-lg hover:shadow-xl hover:-translate-y-1">
          ไปเลือกซื้อสินค้า
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <ShoppingBag className="text-emerald-600" /> ตะกร้าสินค้า <span className="text-neutral-400 text-lg">({items.length} รายการ)</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* รายการสินค้า */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 p-4 border border-neutral-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition group">
              <div className="w-28 h-28 bg-neutral-50 rounded-xl flex-shrink-0 flex items-center justify-center p-2 overflow-hidden">
                <img src={item.image || ''} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-300" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-lg text-neutral-900 line-clamp-1">{item.name}</h3>
                  <p className="text-sm text-neutral-500">{item.category}</p>
                </div>
                <div className="flex justify-between items-end">
                  <div className="font-mono font-bold text-xl text-emerald-700">฿{item.price.toLocaleString()}</div>
                  <div className="flex items-center gap-3 bg-neutral-100 rounded-xl p-1 border border-neutral-200">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-neutral-50 transition"><Minus size={14} /></button>
                    <span className="font-bold w-6 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-neutral-50 transition"><Plus size={14} /></button>
                  </div>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-neutral-300 hover:text-red-500 transition self-start p-2 hover:bg-red-50 rounded-full"><Trash2 size={20} /></button>
            </div>
          ))}
        </div>

        {/* สรุปยอด & Checkout Form */}
        <div className="w-full lg:w-[400px] h-fit sticky top-24">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xl shadow-neutral-100/50">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <FileText size={20} className="text-neutral-400"/> สรุปคำสั่งซื้อ
            </h3>
            
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-neutral-600">
                <span>ยอดรวมสินค้า</span>
                <span>฿{totalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                <span>ค่าจัดส่ง</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-sm">ฟรี</span>
                </div>
            </div>
            
            <div className="border-t border-dashed border-neutral-200 my-4 pt-4 flex justify-between items-end">
              <span className="font-bold text-lg text-neutral-800">ยอดสุทธิ</span>
              <span className="font-bold text-3xl text-emerald-600">฿{totalPrice().toLocaleString()}</span>
            </div>

            {/* ส่วนเลือกที่อยู่ */}
            <div className="mb-6 pt-4 border-t border-neutral-100">
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-neutral-500"><MapPin size={16} /> ที่อยู่จัดส่ง</h4>
              {addresses.length > 0 ? (
                <div className="relative">
                    <select 
                        className="w-full p-3 pl-4 pr-10 text-sm border border-neutral-200 rounded-xl bg-neutral-50 outline-none focus:border-black focus:ring-1 focus:ring-black transition appearance-none cursor-pointer hover:bg-white" 
                        value={selectedAddressId} 
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                    >
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {addresses.map((addr: any) => (
                        <option key={addr.id} value={addr.id}>{addr.name} ({addr.province})</option>
                    ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">▼</div>
                </div>
              ) : (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex items-start gap-3 border border-red-100">
                   <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                   <div>
                       <p>ยังไม่มีที่อยู่จัดส่ง</p>
                       <Link href="/profile" className="underline font-bold hover:text-red-800">เพิ่มที่อยู่ใหม่</Link>
                   </div>
                </div>
              )}
            </div>

            {/* ส่วนขอใบกำกับภาษี */}
            <div className="mb-6 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-3 mb-3 p-3 hover:bg-neutral-50 rounded-xl transition cursor-pointer" onClick={() => setNeedTaxInvoice(!needTaxInvoice)}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${needTaxInvoice ? 'bg-black border-black text-white' : 'border-neutral-300 bg-white'}`}>
                    {needTaxInvoice && <FileText size={12} />}
                </div>
                <label className="font-bold text-sm cursor-pointer select-none">
                  ขอใบกำกับภาษีเต็มรูป
                </label>
              </div>

              {needTaxInvoice && (
                <div className="space-y-3 animate-in slide-in-from-top-2 fade-in pl-1">
                  <input 
                    placeholder="เลขประจำตัวผู้เสียภาษี (13 หลัก)" 
                    className="w-full p-3 text-sm border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition bg-neutral-50 focus:bg-white"
                    maxLength={13}
                    value={taxInfo.taxId}
                    onChange={(e) => setTaxInfo({...taxInfo, taxId: e.target.value.replace(/\D/g, '')})}
                  />
                  <input 
                    placeholder="ชื่อบริษัท / ชื่อบุคคล" 
                    className="w-full p-3 text-sm border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition bg-neutral-50 focus:bg-white"
                    value={taxInfo.taxName}
                    onChange={(e) => setTaxInfo({...taxInfo, taxName: e.target.value})}
                  />
                  <textarea 
                    placeholder="ที่อยู่ตาม ภ.พ. 20" 
                    className="w-full p-3 text-sm border border-neutral-200 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition bg-neutral-50 focus:bg-white resize-none h-20"
                    value={taxInfo.taxAddress}
                    onChange={(e) => setTaxInfo({...taxInfo, taxAddress: e.target.value})}
                  />
                </div>
              )}
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-neutral-800 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/10"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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