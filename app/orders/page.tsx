// app/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Package, Upload, QrCode, X, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function OrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedOrder, setSelectedOrder] = useState<any>(null) // State สำหรับเปิด Popup
  
  const [uploading, setUploading] = useState(false)
  const [loadingPage, setLoadingPage] = useState(true)

  // 1. ดึงข้อมูลออเดอร์
  const fetchOrders = async () => {
    try {
      // 🔥 เพิ่ม { cache: 'no-store' } เพื่อไม่ให้จำค่าเก่า (แก้ปุ่มค้าง)
      const res = await fetch('/api/orders', { cache: 'no-store' })
      const data = await res.json()
      if (Array.isArray(data)) setOrders(data)
    } catch (error) {
      toast.error('ไม่สามารถโหลดข้อมูลได้')
    } finally {
      setLoadingPage(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // 2. ฟังก์ชันอัปโหลดสลิป
  const handleUploadSlip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedOrder) return

    setUploading(true)
    const toastId = toast.loading('กำลังอัปโหลดสลิป...')

    try {
      // 2.1 Upload รูป
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()

      if (!uploadData.success) throw new Error('Upload failed')

      // 2.2 อัปเดตสถานะออเดอร์
      const updateRes = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'VERIFYING', slipImage: uploadData.url })
      })

      if (!updateRes.ok) throw new Error('Update failed')

      toast.success('แจ้งโอนเงินเรียบร้อย! รอตรวจสอบครับ', { id: toastId })
      
      // รีโหลดข้อมูลใหม่ทันที
      await fetchOrders()
      setSelectedOrder(null) // ปิด Popup

    } catch (err) {
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่', { id: toastId })
    } finally {
      setUploading(false)
    }
  }

  if (loadingPage) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Package className="text-blue-600" /> ประวัติคำสั่งซื้อ
        </h1>

        <div className="space-y-6">
          {orders.length === 0 ? (
             <div className="text-center py-20 text-slate-400 bg-white rounded-xl border border-dashed">
                ยังไม่มีคำสั่งซื้อ
             </div>
          ) : (
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition hover:shadow-md">
                
                {/* Header Card */}
                <div className="bg-slate-50 p-4 flex justify-between items-center border-b border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 font-mono">Order ID: #{order.id.split('-')[0]}</p>
                    {/* 🔥 แก้ไขวันที่ให้ถูกต้อง (ใช้ toLocaleString แทน) */}
                    <p className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="p-4">
                  {/* รายการสินค้าในออเดอร์ */}
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between py-2 text-sm border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-slate-100 rounded flex-shrink-0 overflow-hidden">
                            {item.product?.image && <img src={item.product.image} className="w-full h-full object-cover" />}
                         </div>
                         <div>
                            <span className="font-medium text-slate-700">{item.product?.name}</span>
                            <span className="text-slate-400 text-xs ml-2">x{item.quantity}</span>
                         </div>
                      </div>
                      <span className="font-mono text-slate-600">฿{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  
                  {/* Footer Card */}
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <div>
                        <p className="text-xs text-slate-400">ยอดสุทธิ</p>
                        <span className="font-bold text-xl text-slate-900">฿{Number(order.total).toLocaleString()}</span>
                    </div>
                    
                    {/* ปุ่มนี้แหละ! ที่กดแล้วจะเปิด Popup QR Code */}
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => setSelectedOrder(order)} 
                        className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-neutral-800 transition flex items-center gap-2 shadow-lg shadow-black/10 active:scale-95"
                      >
                        <QrCode size={18} /> แจ้งโอนเงิน
                      </button>
                    )}
                    
                    {/* ถ้าไม่ใช่ PENDING ให้ปุ่มเป็น Link ดูรายละเอียดแทน */}
                    {order.status !== 'PENDING' && (
                       <Link href={`/order-success?id=${order.id}`} className="text-sm font-bold text-blue-600 hover:underline">
                          ดูรายละเอียด
                       </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🔥 Popup (Modal) แจ้งโอนเงิน + QR Code */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-[99] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* ปุ่มปิด X */}
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-slate-400 hover:text-black transition">
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold mb-6 text-center">แจ้งชำระเงิน</h3>
            
            {/* รายละเอียดบัญชี & QR Code */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6 text-center">
              <p className="text-sm text-slate-500 mb-1">สแกน QR เพื่อชำระเงิน</p>
              
              {/* QR Code */}
              <div className="bg-white p-3 inline-block rounded-lg shadow-sm border border-slate-100 mb-4">
                 <img 
                   src={`https://promptpay.io/0123456789/${Number(selectedOrder.total)}.png`} 
                   alt="PromptPay QR" 
                   className="w-40 h-40 object-contain"
                 />
              </div>

              <p className="text-sm text-slate-500 mb-1">ธนาคารกสิกรไทย (KBANK)</p>
              <p className="text-xl font-bold font-mono text-black tracking-wider">012-3-45678-9</p>
              <p className="text-xs text-slate-400 mt-1">บจก. ไอแฮฟจีพียู</p>
              
              <div className="my-4 border-t border-dashed border-slate-300"></div>
              
              <div className="flex justify-between items-end px-4">
                  <span className="text-sm text-slate-500">ยอดที่ต้องโอน</span>
                  <span className="text-3xl font-bold text-emerald-600">฿{Number(selectedOrder.total).toLocaleString()}</span>
              </div>
            </div>

            {/* พื้นที่แนบสลิป */}
            <label className={`block w-full border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex flex-col items-center gap-3">
                <div className="bg-slate-100 p-3 rounded-full group-hover:bg-white transition">
                    {uploading ? <Loader2 size={32} className="text-slate-400 animate-spin" /> : <Upload size={32} className="text-slate-400 group-hover:text-black" />}
                </div>
                <div>
                    <span className="font-bold text-slate-700 block text-lg">{uploading ? 'กำลังอัปโหลด...' : 'แตะเพื่อแนบสลิป'}</span>
                    <span className="text-xs text-slate-400">รองรับไฟล์ JPG, PNG</span>
                </div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleUploadSlip} disabled={uploading} />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    VERIFYING: "bg-blue-100 text-blue-700 border-blue-200",
    PAID: "bg-green-100 text-green-700 border-green-200",
    SHIPPED: "bg-black text-white border-black",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
    COMPLETED: "bg-purple-100 text-purple-700 border-purple-200"
  }
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  )
}