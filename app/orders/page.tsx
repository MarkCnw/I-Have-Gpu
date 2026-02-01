// app/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Package, Clock, CheckCircle, Truck, Upload, QrCode, X } from 'lucide-react'
import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null) // สำหรับ Popup
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch('/api/orders').then(res => res.json()).then(setOrders)
  }, [])

  // ฟังก์ชันอัปโหลดสลิป
  const handleUploadSlip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedOrder) return

    setUploading(true)
    try {
      // 1. Upload
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const { url } = await uploadRes.json()

      // 2. Update Status
      await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'VERIFYING', slipImage: url })
      })

      alert('✅ แจ้งโอนเงินเรียบร้อย!')
      window.location.reload()
    } catch (err) {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setUploading(false)
      setSelectedOrder(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Package /> ประวัติคำสั่งซื้อ
        </h1>

        <div className="space-y-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 p-4 flex justify-between items-center border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Order ID: {order.id.split('-')[0]}</p>
                  <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('th-TH')}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="p-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between py-1 text-sm">
                    <span>{item.product.name} (x{item.quantity})</span>
                    <span className="font-mono">฿{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="font-bold text-lg">฿{Number(order.total).toLocaleString()}</span>
                  
                  {/* ปุ่มแจ้งโอนเงิน (เฉพาะ PENDING) */}
                  {order.status === 'PENDING' && (
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-neutral-800 transition flex items-center gap-2"
                    >
                      <QrCode size={16} /> แจ้งโอนเงิน
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 Popup แจ้งโอนเงิน */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-slate-400 hover:text-black">
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold mb-6 text-center">แจ้งชำระเงิน</h3>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-center">
              <p className="text-sm text-slate-500 mb-1">ธนาคารกสิกรไทย (KBANK)</p>
              <p className="text-2xl font-bold font-mono text-black">012-3-45678-9</p>
              <p className="text-xs text-slate-400 mt-1">บจก. ไอแฮฟจีพียู</p>
              <div className="my-4 border-t border-slate-200"></div>
              <p className="text-sm text-slate-600">ยอดที่ต้องโอน</p>
              <p className="text-3xl font-bold text-green-600">฿{Number(selectedOrder.total).toLocaleString()}</p>
            </div>

            <label className={`block w-full border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex flex-col items-center gap-2">
                <Upload size={32} className="text-slate-400" />
                <span className="font-bold text-slate-600">{uploading ? 'กำลังอัปโหลด...' : 'แตะเพื่อแนบสลิป'}</span>
                <span className="text-xs text-slate-400">รองรับ JPG, PNG</span>
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
  const styles: any = {
    PENDING: "bg-yellow-100 text-yellow-700",
    VERIFYING: "bg-blue-100 text-blue-700",
    PAID: "bg-green-100 text-green-700",
    SHIPPED: "bg-black text-white",
    CANCELLED: "bg-red-100 text-red-700"
  }
  return <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${styles[status] || 'bg-gray-100'}`}>{status}</span>
}