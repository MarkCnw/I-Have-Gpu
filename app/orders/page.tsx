// app/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Package, Upload, QrCode, X, Copy, Truck, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function OrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [uploading, setUploading] = useState(false)

  // ใช้ fetch แบบธรรมดา (ไม่ต้องใช้ toast ก็ได้ ถ้าชอบแบบเดิม)
  const fetchOrders = async () => {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      const data = await res.json()
      if (Array.isArray(data)) setOrders(data)
  }

  useEffect(() => { fetchOrders() }, [])

  const handleUploadSlip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedOrder) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()

      await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'VERIFYING', slipImage: uploadData.url })
      })

      alert('✅ แจ้งโอนเงินเรียบร้อย!')
      await fetchOrders()
      setSelectedOrder(null)
    } catch (err) {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Package className="text-blue-600" /> คำสั่งซื้อของฉัน
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
                
                {/* Header */}
                <div className="bg-slate-50 p-4 flex justify-between items-center border-b border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 font-mono">Order ID: #{order.id.split('-')[0]}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="p-4">
                  {/* Items */}
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
                  
                  {/* 🔥 ส่วนแสดง Tracking Number (เพิ่มให้แล้วตามที่ขอ) */}
                  {order.status === 'SHIPPED' && order.trackingNumber && (
                    <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="flex items-center gap-2 text-blue-800">
                            <Truck size={18} />
                            <div>
                                <span className="text-xs font-bold uppercase">{order.carrier || 'Shipping'}: </span>
                                <span className="font-mono font-bold text-lg">{order.trackingNumber}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => navigator.clipboard.writeText(order.trackingNumber)} className="px-3 py-1 bg-white text-xs border border-blue-200 rounded hover:bg-blue-50">Copy</button>
                            <a href={`https://www.google.com/search?q=${order.trackingNumber}`} target="_blank" className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Track</a>
                        </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <div>
                        <p className="text-xs text-slate-400">ยอดสุทธิ</p>
                        <span className="font-bold text-xl text-slate-900">฿{Number(order.total).toLocaleString()}</span>
                    </div>
                    
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => setSelectedOrder(order)} 
                        className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <QrCode size={18} /> แจ้งโอนเงิน
                      </button>
                    )}
                    
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

      {/* Popup QR Code (เหมือนเดิมเป๊ะ) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-[99] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-slate-400 hover:text-black">
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold mb-6 text-center">แจ้งชำระเงิน</h3>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6 text-center">
              <div className="bg-white p-3 inline-block rounded-lg shadow-sm border border-slate-100 mb-4">
                 <img 
                   src={`https://promptpay.io/0123456789/${Number(selectedOrder.total)}.png`} 
                   alt="PromptPay QR" 
                   className="w-40 h-40 object-contain"
                 />
              </div>
              <p className="text-sm text-slate-500 mb-1">ธนาคารกสิกรไทย (KBANK)</p>
              <p className="text-xl font-bold font-mono text-black tracking-wider">012-3-45678-9</p>
              <div className="my-4 border-t border-dashed border-slate-300"></div>
              <div className="flex justify-between items-end px-4">
                  <span className="text-sm text-slate-500">ยอดที่ต้องโอน</span>
                  <span className="text-3xl font-bold text-emerald-600">฿{Number(selectedOrder.total).toLocaleString()}</span>
              </div>
            </div>

            <label className={`block w-full border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex flex-col items-center gap-2">
                <Upload size={32} className="text-slate-400" />
                <span className="font-bold text-slate-700 block">{uploading ? 'กำลังอัปโหลด...' : 'แนบสลิปการโอนเงิน'}</span>
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
    PENDING: "bg-yellow-100 text-yellow-700",
    VERIFYING: "bg-blue-100 text-blue-700",
    PAID: "bg-green-100 text-green-700",
    SHIPPED: "bg-black text-white",
    CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-purple-100 text-purple-700"
  }
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}