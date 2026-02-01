// app/order-success/page.tsx
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Copy, FileText, CreditCard, Home } from 'lucide-react'
import { toast } from 'react-hot-toast'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('id')
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    // ดึงข้อมูลออเดอร์เพื่อมาโชว์
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setOrder(data)
      })
      .catch((err) => {
        console.error(err)
        toast.error('ไม่พบข้อมูลคำสั่งซื้อ')
      })
      .finally(() => setLoading(false))
  }, [orderId, router])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('คัดลอกเรียบร้อย!')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  if (!order) return null

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Success */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-in zoom-in duration-300">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">สั่งซื้อสำเร็จ!</h1>
          <p className="text-slate-500">ขอบคุณสำหรับการสั่งซื้อ หมายเลขคำสั่งซื้อของคุณคือ</p>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="font-mono font-bold text-lg text-slate-700">#{order.id.split('-')[0]}</span>
            <button onClick={() => copyToClipboard(order.id.split('-')[0])} className="text-slate-400 hover:text-black transition">
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Payment Info (QR Code) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <CreditCard size={20} className="text-emerald-600" /> ชำระเงิน (Payment)
            </h2>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center mb-6">
              <p className="text-sm text-slate-500 mb-2">สแกน QR Code เพื่อชำระเงิน</p>
              <div className="bg-white p-4 inline-block rounded-lg shadow-sm mb-4">
                 {/* สร้าง QR PromptPay อัตโนมัติด้วยยอดเงินจริง */}
                 <img 
                   src={`https://promptpay.io/0812345678/${order.total}.png`} 
                   alt="PromptPay QR" 
                   className="w-48 h-48 object-contain"
                 />
              </div>
              <div className="text-2xl font-bold text-emerald-600">฿{Number(order.total).toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-2">ธนาคารกสิกรไทย • บจก. ไอแฮฟจีพียู</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => router.push(`/orders?highlight=${order.id}`)}
                className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                <FileText size={18} /> แจ้งชำระเงิน / ดูสถานะ
              </button>
              <Link href="/" className="block w-full text-center py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition flex items-center justify-center gap-2">
                <Home size={18} /> กลับหน้าหลัก
              </Link>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <FileText size={20} className="text-blue-600" /> สรุปรายการ (Summary)
            </h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.product.image && <img src={item.product.image} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold line-clamp-2">{item.product.name}</p>
                    <p className="text-xs text-slate-500">x{item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold text-slate-700">
                    ฿{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>ยอดรวมสินค้า</span>
                <span>฿{order.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>ค่าจัดส่ง</span>
                <span className="text-green-600">ฟรี</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-100 mt-2">
                <span>ยอดสุทธิ</span>
                <span>฿{order.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Shipping Address Summary */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
               <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">ที่อยู่จัดส่ง</h3>
               <p className="text-sm font-bold text-slate-800">{order.shippingName}</p>
               <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                 {order.shippingAddress} {order.shippingZipcode}
               </p>
               <p className="text-xs text-slate-500 mt-1">📞 {order.shippingPhone}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}