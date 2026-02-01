// app/cart/page.tsx
'use client'

import { useCartStore } from '@/app/store/useCartStore'
import { Trash2, Minus, Plus, ShoppingBag, MapPin, ArrowRight, AlertCircle, FileText } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import ConfirmModal from '@/components/ConfirmModal' // 👈 1. Import Modal

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore()
  const router = useRouter()
  const { data: session } = useSession()

  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  
  // State สำหรับ Modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [needTaxInvoice, setNeedTaxInvoice] = useState(false)
  const [taxInfo, setTaxInfo] = useState({ taxId: '', taxName: '', taxAddress: '' })

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/addresses').then(res => res.json()).then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAddresses(data)
          const defaultAddr = data.find((a: any) => a.isDefault) || data[0]
          setSelectedAddressId(defaultAddr.id)
        }
      })
    }
  }, [session])

  // ฟังก์ชันแค่เปิด Modal เช็คความถูกต้องเบื้องต้น
  const onCheckoutClick = () => {
    if (!session) return toast.error('กรุณาเข้าสู่ระบบก่อนสั่งซื้อ')
    if (addresses.length === 0) return toast.error('กรุณาเพิ่มที่อยู่จัดส่งก่อน')
    if (needTaxInvoice && (!taxInfo.taxName || !taxInfo.taxId)) return toast.error('กรุณากรอกข้อมูลใบกำกับภาษีให้ครบ')
    
    setIsConfirmOpen(true) // 🔥 เปิด Modal แทน confirm()
  }

  // ฟังก์ชันสั่งซื้อจริง (จะถูกเรียกโดย Modal)
  const processCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items, 
          totalPrice: totalPrice(),
          addressId: selectedAddressId,
          taxInfo: needTaxInvoice ? taxInfo : null
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      clearCart()
      router.push(`/order-success?id=${data.orderId}`)
      toast.success('สั่งซื้อสำเร็จ!')
    } catch (error: any) {
      toast.error(error.message || 'สั่งซื้อไม่สำเร็จ')
    } finally {
      setLoading(false)
      setIsConfirmOpen(false)
    }
  }

  if (items.length === 0) return <div className="text-center py-20">ตะกร้าว่างเปล่า</div>

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* ... (ส่วนแสดงรายการสินค้า เหมือนเดิม) ... */}
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
           {items.map((item) => (
             <div key={item.id} className="flex gap-4 p-4 border rounded-xl">
               <img src={item.image || ''} className="w-20 h-20 object-contain" />
               <div className="flex-1">
                 <h3 className="font-bold">{item.name}</h3>
                 <p>฿{item.price.toLocaleString()}</p>
                 <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16}/></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16}/></button>
                 </div>
               </div>
               <button onClick={() => removeItem(item.id)} className="text-red-500"><Trash2/></button>
             </div>
           ))}
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="bg-slate-50 p-6 rounded-2xl border">
            {/* ... (ส่วนสรุปยอด เหมือนเดิม) ... */}
            <div className="flex justify-between font-bold text-xl mb-6">
               <span>รวมทั้งสิ้น</span>
               <span>฿{totalPrice().toLocaleString()}</span>
            </div>

            {/* ปุ่มกดสั่งซื้อ */}
            <button 
              onClick={onCheckoutClick}
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-neutral-800 transition"
            >
              ยืนยันการสั่งซื้อ
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 Modal ยืนยัน */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={processCheckout}
        title="ยืนยันการสั่งซื้อ?"
        message={`ยอดชำระทั้งหมด ฿${totalPrice().toLocaleString()} คุณต้องการดำเนินการต่อหรือไม่?`}
        confirmText="ชำระเงิน"
        loading={loading}
        variant="info"
      />
    </div>
  )
}