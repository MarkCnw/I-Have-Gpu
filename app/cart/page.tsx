// app/cart/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, CreditCard, MapPin, AlertCircle, FileText } from 'lucide-react'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
// 🔥 เรียกใช้ Store ที่เราทำไว้
import { useCartStore } from '@/app/store/useCartStore'

export default function CartPage() {
  // 🔥 ดึงข้อมูลและฟังก์ชันจาก Store โดยตรง (ไม่ต้องเขียน useState เอง)
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()
  
  // ใช้ State เพื่อจัดการเรื่อง Hydration (ป้องกัน Error: Text content does not match)
  const [isClient, setIsClient] = useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

  // --- Auth & Router ---
  const { data: session } = useSession()
  const router = useRouter()

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
    setIsClient(true) // บอกว่าโหลดฝั่ง Client เสร็จแล้ว

    // โหลดที่อยู่ (ถ้าล็อกอิน)
    if (session?.user) {
      fetch('/api/user/addresses')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setAddresses(data)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const defaultAddr = data.find((a: any) => a.isDefault) || data[0]
            setSelectedAddressId(defaultAddr.id)
          }
        })
        .catch(err => console.error('Failed to load addresses', err))
    }
  }, [session])

  const subtotal = totalPrice()
  const shipping = 0 // หรือใส่ Logic คำนวณค่าส่ง
  const total = subtotal + shipping

  // ฟังก์ชัน Checkout
  const handleCheckout = async () => {
    if (!session) {
        toast.error('กรุณาเข้าสู่ระบบก่อนชำระเงิน')
        return router.push('/login')
    }

    if (items.length === 0) return toast.error('ไม่มีสินค้าในตะกร้า')

    if (addresses.length === 0) {
        return toast.error('กรุณาเพิ่มที่อยู่จัดส่งก่อน')
    }

    if (needTaxInvoice) {
        if (!taxInfo.taxName) return toast.error('กรุณากรอกชื่อบริษัท/บุคคล สำหรับใบกำกับภาษี')
        if (!/^\d{13}$/.test(taxInfo.taxId)) return toast.error('เลขผู้เสียภาษีต้องเป็นตัวเลข 13 หลักเท่านั้น')
        if (!taxInfo.taxAddress) return toast.error('กรุณากรอกที่อยู่สำหรับใบกำกับภาษี')
    }

    setIsCheckoutLoading(true)

    try {
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: items, // ส่ง items จาก Store
                totalPrice: total,
                addressId: selectedAddressId,
                taxInfo: needTaxInvoice ? taxInfo : null
            })
        })

        const data = await res.json()

        if (res.ok) {
            clearCart() // 🔥 เคลียร์ตะกร้าด้วยฟังก์ชันของ Store
            toast.success('🎉 สั่งซื้อสำเร็จ!')
            router.push('/orders')
        } else {
            toast.error(data.error || 'สั่งซื้อไม่สำเร็จ')
        }
    } catch (error) {
        toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
        setIsCheckoutLoading(false)
    }
  }

  // ป้องกันการแสดงผลก่อนโหลดข้อมูลเสร็จ
  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white p-4">
        <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
           <ShoppingBag size={48} className="text-neutral-300" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">ตะกร้าสินค้าว่างเปล่า</h1>
        <p className="text-neutral-500 mb-8">คุณยังไม่ได้เลือกสินค้าที่ถูกใจเลย</p>
        <Link href="/" className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl">
          ไปเลือกซื้อสินค้า
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans">
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-10">
         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/" className="hover:text-black transition-colors">หน้าแรก</Link>
                <span className="text-neutral-300 text-xs font-bold">{'>'}</span>
                <span className="text-neutral-900 font-medium">ตะกร้าสินค้า</span>
               </div>
               
               <div className="h-6 w-[1px] bg-neutral-200 hidden md:block"></div>

               <h1 className="text-xl font-bold flex items-center gap-2">
                 <ShoppingBag size={20} /> ตะกร้าสินค้า ({items.length})
               </h1>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* รายการสินค้า (Left) */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-4 md:p-6 rounded-2xl border border-neutral-100 flex gap-6 items-center shadow-sm hover:shadow-md transition-shadow">
                
                {/* รูปสินค้า */}
                <div className="w-24 h-24 bg-neutral-50 rounded-xl flex-shrink-0 relative overflow-hidden border border-neutral-100">
                  <Image src={item.image || '/placeholder.png'} alt={item.name} fill className="object-contain p-2 mix-blend-multiply" />
                </div>

                {/* ข้อมูล */}
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start mb-1">
                      <div>
                        {item.category && (
                          <span className="text-[10px] font-bold bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                            {item.category}
                          </span>
                        )}
                        <h3 className="font-bold text-neutral-900 text-lg truncate pr-4 leading-tight">{item.name}</h3>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>
                   
                   <div className="flex items-end justify-between mt-2">
                      <div className="text-xl font-bold text-neutral-900">฿{Number(item.price).toLocaleString()}</div>
                      
                      {/* ปุ่มเพิ่ม/ลด จำนวน */}
                      <div className="flex items-center gap-3 bg-neutral-50 rounded-lg p-1 border border-neutral-200">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-neutral-100 disabled:opacity-50 text-neutral-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-neutral-100 text-neutral-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* สรุปยอดเงิน (Right - Sticky) */}
          <div className="lg:w-[380px] flex-shrink-0">
             <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold mb-6">สรุปคำสั่งซื้อ</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-neutral-600">
                    <span>ยอดรวมสินค้า</span>
                    <span>฿{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>ค่าจัดส่ง</span>
                    <span className={shipping === 0 ? "text-green-600 font-bold" : ""}>
                      {shipping === 0 ? "ฟรี" : `฿${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                     <p className="text-xs text-neutral-400 text-right">ช้อปครบ 5,000 ส่งฟรี</p>
                  )}
                </div>

                <div className="border-t border-dashed border-neutral-200 pt-6 mb-6">
                   <div className="flex justify-between items-end">
                      <span className="font-bold text-lg">ยอดชำระทั้งหมด</span>
                      <span className="text-3xl font-bold text-black">฿{total.toLocaleString()}</span>
                   </div>
                   <p className="text-xs text-neutral-400 mt-2 text-right">รวมภาษีมูลค่าเพิ่มแล้ว</p>
                </div>

                {/* --- ส่วนเลือกที่อยู่ --- */}
                <div className="mb-6">
                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-neutral-700"><MapPin size={16} /> ที่อยู่จัดส่ง</h4>
                    {addresses.length > 0 ? (
                        <select 
                            className="w-full p-3 text-sm border border-neutral-200 rounded-lg bg-neutral-50 outline-none focus:border-black transition cursor-pointer" 
                            value={selectedAddressId} 
                            onChange={(e) => setSelectedAddressId(e.target.value)}
                        >
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {addresses.map((addr: any) => (
                            <option key={addr.id} value={addr.id}>{addr.name} ({addr.province})</option>
                        ))}
                        </select>
                    ) : (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-start gap-2 border border-red-100">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                            <Link href="/profile" className="underline font-bold hover:text-red-800">กรุณาเพิ่มที่อยู่จัดส่ง</Link>
                        </div>
                    )}
                </div>

                {/* --- ส่วนขอใบกำกับภาษี --- */}
                <div className="mb-8 pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-2 mb-3">
                    <input 
                        type="checkbox" 
                        id="tax" 
                        className="w-4 h-4 accent-black cursor-pointer"
                        checked={needTaxInvoice} 
                        onChange={(e) => setNeedTaxInvoice(e.target.checked)} 
                    />
                    <label htmlFor="tax" className="font-bold text-sm flex items-center gap-2 cursor-pointer select-none text-neutral-700">
                        <FileText size={16} /> ขอใบกำกับภาษีเต็มรูป
                    </label>
                    </div>

                    {needTaxInvoice && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <input 
                        placeholder="เลขประจำตัวผู้เสียภาษี (13 หลัก)" 
                        className="w-full p-3 text-sm border border-neutral-200 rounded-lg outline-none focus:border-black bg-neutral-50"
                        maxLength={13}
                        value={taxInfo.taxId}
                        onChange={(e) => setTaxInfo({...taxInfo, taxId: e.target.value.replace(/\D/g, '')})}
                        />
                        <input 
                        placeholder="ชื่อบริษัท / ชื่อบุคคล" 
                        className="w-full p-3 text-sm border border-neutral-200 rounded-lg outline-none focus:border-black bg-neutral-50"
                        value={taxInfo.taxName}
                        onChange={(e) => setTaxInfo({...taxInfo, taxName: e.target.value})}
                        />
                        <textarea 
                        placeholder="ที่อยู่สำหรับออกใบกำกับภาษี" 
                        className="w-full p-3 text-sm border border-neutral-200 rounded-lg outline-none focus:border-black resize-none h-20 bg-neutral-50"
                        value={taxInfo.taxAddress}
                        onChange={(e) => setTaxInfo({...taxInfo, taxAddress: e.target.value})}
                        />
                    </div>
                    )}
                </div>

                <button 
                    onClick={handleCheckout}
                    disabled={isCheckoutLoading}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isCheckoutLoading ? (
                        <>กำลังดำเนินการ...</>
                    ) : (
                        <>ชำระเงิน <ArrowRight size={20} /></>
                    )}
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-neutral-400 text-xs">
                   <CreditCard size={14} /> ปลอดภัยด้วยระบบชำระเงินมาตรฐาน
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}