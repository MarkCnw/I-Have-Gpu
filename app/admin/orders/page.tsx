// app/admin/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, Check, X, Truck, ExternalLink } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminOrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState('ALL') // ALL, VERIFYING, PAID, SHIPPED

  useEffect(() => {
    fetch('/api/orders').then(res => res.json()).then(setOrders)
  }, [])

  // ฟังก์ชันเปลี่ยนสถานะ (Confirm Payment)
  const updateStatus = async (id: string, status: string) => {
    if(!confirm(`เปลี่ยนสถานะเป็น ${status}?`)) return
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    window.location.reload()
  }

  // ฟังก์ชันส่งสินค้า (ใส่เลขพัสดุ)
  const handleShip = async (id: string) => {
    const tracking = prompt('กรุณากรอกเลขพัสดุ (Tracking Number):')
    if (!tracking) return

    const carrier = prompt('ชื่อขนส่ง (เช่น Kerry, Flash):', 'Kerry Express')
    
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: 'SHIPPED', 
        trackingNumber: tracking,
        carrier: carrier 
      })
    })
    window.location.reload()
  }

  // กรองออเดอร์
  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">จัดการคำสั่งซื้อ (Orders)</h1>
        
        {/* Filter Tabs */}
        <div className="flex bg-white p-1 rounded-lg border border-slate-200">
          {['ALL', 'VERIFYING', 'PAID', 'SHIPPED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${filter === f ? 'bg-black text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {f} {f === 'VERIFYING' && orders.filter(o => o.status === 'VERIFYING').length > 0 && <span className="ml-1 text-red-400">●</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono">{order.id.split('-')[0]}</td>
                <td className="p-4">
                  <p className="font-bold">{order.shippingName}</p>
                  <p className="text-xs text-slate-400">{order.shippingPhone}</p>
                </td>
                <td className="p-4 font-bold">฿{Number(order.total).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                    ${order.status === 'VERIFYING' ? 'bg-yellow-100 text-yellow-700' : 
                      order.status === 'PAID' ? 'bg-indigo-100 text-indigo-700' :
                      order.status === 'SHIPPED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {order.status}
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
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* 1. ปุ่ม Verify (สำหรับสถานะ VERIFYING) */}
                    {order.status === 'VERIFYING' && (
                      <>
                        <button onClick={() => updateStatus(order.id, 'PAID')} className="bg-green-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-green-700">
                          <Check size={14} /> Confirm
                        </button>
                        <button onClick={() => updateStatus(order.id, 'PENDING')} className="bg-red-50 text-red-600 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-red-100 border border-red-200">
                          <X size={14} /> Reject
                        </button>
                      </>
                    )}

                    {/* 2. ปุ่ม Ship (สำหรับสถานะ PAID) */}
                    {order.status === 'PAID' && (
                      <button onClick={() => handleShip(order.id)} className="bg-black text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-neutral-800">
                        <Truck size={14} /> Ship Order
                      </button>
                    )}

                    {/* 3. ดูเลขพัสดุ (สำหรับ SHIPPED) */}
                    {order.status === 'SHIPPED' && (
                      <span className="text-green-600 font-mono text-xs border border-green-200 bg-green-50 px-2 py-1 rounded">
                        {order.trackingNumber}
                      </span>
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