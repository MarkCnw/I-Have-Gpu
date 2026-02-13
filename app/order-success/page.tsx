// app/order-success/page.tsx
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  CheckCircle, Copy, FileText, Printer, 
  Home, ShoppingBag, MapPin, CreditCard, 
  ChevronRight, Receipt, Truck 
} from 'lucide-react'
import { toast } from 'react-hot-toast'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('id')
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

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
    toast.success('คัดลอกรหัสออเดอร์แล้ว')
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mb-4"></div>
      <p className="text-neutral-400 font-medium">กำลังโหลดข้อมูลใบเสร็จ...</p>
    </div>
  )

  if (!order) return null

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans text-neutral-900 print:bg-white print:pb-0 print:text-black">
      
      {/* CSS สำหรับการพิมพ์โดยเฉพาะเพื่อบีบหน้ากระดาษ */}
      <style jsx global>{`
        @media print {
          @page { margin: 10mm; }
          body { background: white; }
          .custom-scrollbar { overflow: visible !important; }
        }
      `}</style>

      {/* Header (Hide when printing) */}
      <div className="border-b border-neutral-100 bg-white sticky top-0 z-30 shadow-sm print:hidden">
        <div className="max-w-[1000px] mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href="/" className="hover:text-black transition-colors">หน้าแรก</Link>
            <ChevronRight size={14} className="text-neutral-300" />
            <Link href="/orders" className="hover:text-black transition-colors">คำสั่งซื้อ</Link>
            <ChevronRight size={14} className="text-neutral-300" />
            <span className="text-neutral-900 font-medium">รายละเอียดออเดอร์</span>
           </div>
           
           <button 
            onClick={handlePrint}
            className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-black transition-colors"
           >
            <Printer size={18} /> พิมพ์ใบเสร็จ
           </button>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-12 print:py-0 print:px-0">
        
        {/* Success Banner (Hide when printing) */}
        <div className="text-center mb-12 print:hidden">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-6">
            <CheckCircle size={48} className="text-emerald-500" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-3">ขอบคุณที่สั่งซื้อ!</h1>
          <p className="text-neutral-400">เราได้รับคำสั่งซื้อของคุณแล้ว และจะดำเนินการจัดส่งโดยเร็วที่สุด</p>
        </div>

        {/* ✅ Main Receipt Card (Compact for Print) */}
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none">
          
          {/* Receipt Header (Reduced padding in print) */}
          <div className="bg-neutral-900 text-white p-10 print:p-6 flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-6 print:mb-2">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center print:w-8 print:h-8">
                    <Image src="/logo.svg" alt="iHAVEGPU" width={24} height={24} className="object-contain" />
                 </div>
                 <span className="text-xl font-black tracking-tighter print:text-lg">iHAVEGPU STORE</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest print:text-[10px]">หมายเลขคำสั่งซื้อ</p>
                <div className="flex items-center gap-2">
                   <h2 className="text-2xl font-mono font-bold print:text-xl">#{order.id.split('-')[0].toUpperCase()}</h2>
                   <button onClick={() => copyToClipboard(order.id)} className="text-neutral-500 hover:text-white transition print:hidden">
                      <Copy size={16} />
                   </button>
                </div>
              </div>
            </div>
            
            <div className="md:text-right flex flex-col justify-end">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1 print:text-[10px]">วันที่ทำรายการ</p>
              <p className="text-lg font-bold print:text-sm">
                {new Date(order.createdAt).toLocaleDateString('th-TH', { 
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="p-10 space-y-10 print:p-6 print:space-y-6">
            
            {/* 📦 Items List (Condensed) */}
            <div>
               <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2 print:mb-3 print:text-xs">
                 <ShoppingBag size={16} /> รายการสินค้า
               </h3>
               <div className="space-y-6 print:space-y-2">
                 {order.items?.map((item: any) => (
                   <div key={item.id} className="flex gap-6 items-center print:gap-3">
                     <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex-shrink-0 relative overflow-hidden border border-neutral-100 p-2 print:w-10 print:h-10 print:rounded-lg">
                        {item.product.image && <Image src={item.product.image} alt="" fill className="object-contain mix-blend-multiply" />}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="font-bold text-neutral-900 line-clamp-1 print:text-xs">{item.product.name}</p>
                        <p className="text-xs text-neutral-400 print:text-[10px]">
                          จำนวน: {item.quantity} • ฿{Number(item.price).toLocaleString()}
                        </p>
                     </div>
                     <div className="text-right">
                        <p className="font-mono font-bold text-neutral-900 print:text-xs">
                          ฿{(item.price * item.quantity).toLocaleString()}
                        </p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* 📍 Info Sections (Print-optimized grid) */}
            <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-neutral-50 print:pt-4 print:gap-4 print:grid-cols-2">
               {/* Shipping Info */}
               <div className="space-y-3 print:space-y-1">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} /> ข้อมูลการจัดส่ง
                  </h4>
                  <div className="text-sm leading-relaxed print:text-xs">
                     <p className="font-bold text-black">{order.shippingName}</p>
                     <p className="text-neutral-500 print:text-black">{order.shippingAddress} {order.shippingZipcode}</p>
                     <p className="font-medium text-black">📞 {order.shippingPhone}</p>
                  </div>
               </div>

               {/* Tax & Logistics */}
               <div className="space-y-6 print:space-y-2">
                  {order.taxId && (
                    <div className="space-y-2 print:space-y-0">
                       <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                        <Receipt size={14} /> ข้อมูลใบกำกับภาษี
                       </h4>
                       <div className="text-xs bg-neutral-50 p-4 rounded-2xl border border-neutral-100 print:p-2 print:bg-transparent print:border-none">
                          <p className="font-bold">{order.taxName}</p>
                          <p>เลขผู้เสียภาษี: {order.taxId}</p>
                       </div>
                    </div>
                  )}

                  {order.trackingNumber && (
                    <div className="space-y-1">
                       <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">ข้อมูลการขนส่ง</h4>
                       <p className="text-xs font-bold">{order.carrier}: {order.trackingNumber}</p>
                    </div>
                  )}
               </div>
            </div>

            {/* 💰 Totals Summary (Compact) */}
            <div className="bg-[#FAFAFA] rounded-3xl p-8 space-y-2 print:p-4 print:rounded-xl print:bg-neutral-50">
               <div className="flex justify-between text-sm print:text-xs">
                 <span className="text-neutral-400 font-bold uppercase">ยอดรวมสินค้า</span>
                 <span className="font-mono font-bold">฿{Number(order.total).toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-sm print:text-xs">
                 <span className="text-neutral-400 font-bold uppercase">ค่าจัดส่ง</span>
                 <span className="font-bold text-emerald-600">ฟรี</span>
               </div>
               <div className="pt-4 border-t border-neutral-200 mt-2 flex justify-between items-center print:pt-2">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase print:text-[10px]">ยอดชำระสุทธิ</h4>
                  <span className="text-4xl font-black text-black tracking-tighter print:text-2xl">
                    ฿{Number(order.total).toLocaleString()}
                  </span>
               </div>
            </div>
          </div>

          {/* Footer Receipt (Small text) */}
          <div className="p-8 border-t border-dashed border-neutral-100 text-center print:p-4">
             <p className="text-[10px] text-neutral-300 font-medium italic print:text-neutral-500">
               ขอบคุณที่ไว้วางใจ iHAVEGPU STORE - สินค้าทุกชิ้นมีการรับประกันตามเงื่อนไขที่บริษัทกำหนด
             </p>
          </div>
        </div>

        {/* Action Buttons (Hide when printing) */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
           <Link href="/" className="px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-neutral-800 transition shadow-xl flex items-center justify-center gap-2">
            <Home size={20} /> กลับหน้าแรก
           </Link>
           <Link href="/orders" className="px-8 py-4 bg-white border border-neutral-200 text-black rounded-2xl font-bold hover:bg-neutral-50 transition flex items-center justify-center gap-2">
            <ShoppingBag size={20} /> ดูคำสั่งซื้อทั้งหมด
           </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}