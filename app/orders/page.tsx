// app/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Package, Clock, CheckCircle, Truck, XCircle, Upload, QrCode, Copy } from 'lucide-react'
import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([])
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/orders').then(res => res.json()).then(data => setOrders(data))
  }, [])

  // ฟังก์ชันอัปโหลดสลิป
  const handleUploadSlip = async (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if(!confirm('ยืนยันการส่งหลักฐานการโอนเงิน?')) return

    setUploadingId(orderId)
    try {
      // 1. Upload รูป
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const { url } = await uploadRes.json()

      // 2. Update Order
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'VERIFYING', slipImage: url })
      })

      alert('✅ ส่งหลักฐานเรียบร้อย! กรุณารอตรวจสอบ')
      window.location.reload() // รีโหลดเพื่ออัปเดตสถานะ
    } catch (err) {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setUploadingId(null)
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
              
              {/* Header */}
              <div className="bg-slate-50 p-4 flex justify-between items-center border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Order ID: {order.id.split('-')[0]}</p>
                  <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('th-TH')}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Items */}
              <div className="p-4 border-b border-slate-100">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between py-2 text-sm">
                    <span className="text-slate-700">{item.product.name} (x{item.quantity})</span>
                    <span className="font-mono">฿{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between font-bold text-lg">
                  <span>ยอดสุทธิ</span>
                  <span className="text-black">฿{Number(order.total).toLocaleString()}</span>
                </div>
              </div>

              {/* Action Section (Payment / Tracking) */}
              <div className="p-4 bg-slate-50">
                
                {/* 1. กรณีรอจ่ายเงิน (PENDING) -> โชว์เลขบัญชี + ปุ่มอัปสลิป */}
                {order.status === 'PENDING' && (
                  <div className="grid md:grid-cols-2 gap-6 animate-in fade-in">
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><QrCode size={16}/> ช่องทางการชำระเงิน</h4>
                      <p className="text-sm text-slate-600">ธนาคารกสิกรไทย (KBANK)</p>
                      <p className="text-lg font-bold text-black font-mono my-1">012-3-45678-9</p>
                      <p className="text-xs text-slate-500">ชื่อบัญชี: บจก. ไอแฮฟจีพียู</p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <label className="block w-full cursor-pointer bg-black text-white text-center py-3 rounded-lg font-bold hover:bg-neutral-800 transition">
                        {uploadingId === order.id ? 'กำลังอัปโหลด...' : '📸 อัปโหลดสลิปโอนเงิน'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          disabled={!!uploadingId}
                          onChange={(e) => handleUploadSlip(order.id, e)} 
                        />
                      </label>
                      <p className="text-xs text-center text-slate-400 mt-2">รองรับไฟล์ JPG, PNG</p>
                    </div>
                  </div>
                )}

                {/* 2. กรณีรอตรวจสอบ (VERIFYING) */}
                {order.status === 'VERIFYING' && (
                  <div className="text-center py-2 text-yellow-600 bg-yellow-50 rounded-lg border border-yellow-100">
                    <Clock size={20} className="inline mr-2" />
                    กำลังตรวจสอบการชำระเงิน (รอแอดมินยืนยัน)
                  </div>
                )}

                {/* 3. กรณีส่งแล้ว (SHIPPED) -> โชว์เลขพัสดุ */}
                {order.status === 'SHIPPED' && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-green-600 font-bold uppercase mb-1">Tracking Number</p>
                      <p className="font-mono text-lg font-bold text-green-800 tracking-wider">{order.trackingNumber}</p>
                      <p className="text-xs text-green-600 mt-1">ขนส่ง: {order.carrier}</p>
                    </div>
                    <Truck size={32} className="text-green-300" />
                  </div>
                )}

              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-20 text-slate-400">ยังไม่มีคำสั่งซื้อ</div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    VERIFYING: "bg-blue-100 text-blue-700",
    PAID: "bg-indigo-100 text-indigo-700",
    SHIPPED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-gray-100 text-gray-700"
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const style = (styles as any)[status] || "bg-gray-100 text-gray-700"
  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${style}`}>
      {status}
    </span>
  )
}