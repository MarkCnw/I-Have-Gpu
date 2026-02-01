// app/admin/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, Check, X, Truck, ExternalLink, Copy } from 'lucide-react'

// 🔥 เพิ่มส่วนนี้: แปลงรหัสสถานะเป็นภาษาไทยสำหรับแสดงผล
const STATUS_LABEL: Record<string, string> = {
  ALL: 'ทั้งหมด',
  PENDING: 'รอชำระเงิน',
  VERIFYING: 'รอตรวจสอบ',
  PAID: 'ชำระแล้ว',
  SHIPPED: 'จัดส่งแล้ว',
  CANCELLED: 'ยกเลิก',
  COMPLETED: 'สำเร็จ'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminOrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState('ALL') // ค่า filter ยังคงเป็นภาษาอังกฤษเพื่อ Logic

  useEffect(() => {
    fetch('/api/orders', { cache: 'no-store' }).then(res => res.json()).then(setOrders)
  }, [])

  // ฟังก์ชันเปลี่ยนสถานะ (Confirm Payment)
  const updateStatus = async (id: string, status: string) => {
    // แสดงชื่อสถานะภาษาไทยใน Confirm Box
    const statusTH = STATUS_LABEL[status] || status
    if(!confirm(`ยืนยันการเปลี่ยนสถานะเป็น "${statusTH}" ใช่หรือไม่?`)) return
    
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    
    alert('✅ อัปเดตสถานะเรียบร้อย')
    window.location.reload()
  }

  // ฟังก์ชันส่งสินค้า (ใส่เลขพัสดุ)
  const handleShip = async (id: string) => {
    const tracking = prompt('กรุณากรอกเลขพัสดุ (Tracking Number):')
    if (!tracking) return 

    const carrier = prompt('ชื่อบริษัทขนส่ง (เช่น Kerry, Flash):', 'Kerry Express')
    
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        orderId: id,
        status: 'SHIPPED', 
        trackingNumber: tracking,
        carrier: carrier || 'Kerry Express' 
      })
    })
    
    alert('✅ บันทึกเลขพัสดุเรียบร้อย')
    window.location.reload()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredOrders = filter === 'ALL' ? orders : orders.filter((o: any) => o.status === filter)

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">จัดการคำสั่งซื้อ (Orders)</h1>
        
        {/* Filter Tabs */}
        <div className="flex bg-white p-1 rounded-lg border border-slate-200">
          {['ALL', 'VERIFYING', 'PAID', 'SHIPPED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${filter === f ? 'bg-black text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {/* แสดงผลภาษาไทยบนปุ่ม Filter */}
              {STATUS_LABEL[f]} 
              {f === 'VERIFYING' && orders.filter((o: any) => o.status === 'VERIFYING').length > 0 && <span className="ml-1 text-red-400">●</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="p-4">รหัสออเดอร์</th>
              <th className="p-4">ลูกค้า</th>
              <th className="p-4">ยอดรวม</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4">หลักฐานโอน</th>
              <th className="p-4">เลขพัสดุ</th> 
              <th className="p-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {filteredOrders.map((order: any) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono">{order.id.split('-')[0]}</td>
                <td className="p-4">
                  <p className="font-bold">{order.shippingName}</p>
                  <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('th-TH')}</p>
                </td>
                <td className="p-4 font-bold text-emerald-600">฿{Number(order.total).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold 
                    ${order.status === 'VERIFYING' ? 'bg-yellow-100 text-yellow-700' : 
                      order.status === 'PAID' ? 'bg-indigo-100 text-indigo-700' :
                      order.status === 'SHIPPED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {/* แสดงสถานะภาษาไทยในตาราง */}
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </td>
                <td className="p-4">
                  {order.slipImage ? (
                    <a href={order.slipImage} target="_blank" className="text-blue-600 flex items-center gap-1 hover:underline text-xs">
                      <ExternalLink size={12} /> ดูสลิป
                    </a>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
                
                <td className="p-4">
                   {order.trackingNumber ? (
                      <div className="text-xs">
                         <span className="font-bold text-slate-700">{order.carrier}</span>
                         <br/>
                         <span className="font-mono text-slate-500">{order.trackingNumber}</span>
                      </div>
                   ) : '-'}
                </td>

                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* ปุ่ม Verify (สำหรับสถานะ รอตรวจสอบ) */}
                    {order.status === 'VERIFYING' && (
                      <>
                        <button onClick={() => updateStatus(order.id, 'PAID')} className="bg-green-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-green-700 text-xs font-bold">
                          <Check size={14} /> ยืนยัน
                        </button>
                        <button onClick={() => updateStatus(order.id, 'PENDING')} className="bg-red-50 text-red-600 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-red-100 border border-red-200 text-xs font-bold">
                          <X size={14} /> ปฏิเสธ
                        </button>
                      </>
                    )}

                    {/* ปุ่ม Ship (สำหรับสถานะ ชำระแล้ว) */}
                    {order.status === 'PAID' && (
                      <button onClick={() => handleShip(order.id)} className="bg-black text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-neutral-800 text-xs font-bold">
                        <Truck size={14} /> จัดส่งสินค้า
                      </button>
                    )}
                    
                    {/* ปุ่มแก้เลข (สำหรับสถานะ จัดส่งแล้ว) */}
                    {order.status === 'SHIPPED' && (
                       <button onClick={() => handleShip(order.id)} className="text-blue-600 hover:underline text-xs font-bold">
                          แก้ไขเลข
                       </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}