// app/admin/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { MoreHorizontal, Copy, Eye, Check, X, Truck, Clock, XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast' // แนะนำให้ลง react-hot-toast เพิ่ม

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null) // สำหรับ Modal ตรวจสลิป

  useEffect(() => {
    fetch('/api/orders').then(r => r.json()).then(setOrders)
  }, [])

  // Quick Action: Copy Address
  const handleCopyAddress = (order: any) => {
    const text = `${order.shippingName} ${order.shippingPhone}\n${order.shippingAddress} ${order.shippingZipcode}`
    navigator.clipboard.writeText(text)
    toast.success('Address copied to clipboard!') // Toast Notification
  }

  // Update Status Logic
  const handleUpdateStatus = async (status: string) => {
    if (!selectedOrder) return
    if (status === 'CANCELLED' && !confirm('Are you sure to cancel this order?')) return

    try {
      await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status }) // ไม่ส่ง slipImage เพราะแค่เปลี่ยนสถานะ
      })
      toast.success(`Order marked as ${status}`)
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status } : o))
      setSelectedOrder(null) // ปิด Modal
    } catch (e) {
      toast.error('Failed to update status')
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="p-4">Time</th>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              // คำนวณเวลาที่ผ่านไป (Time Elapsed)
              const diffMs = new Date().getTime() - new Date(order.createdAt).getTime()
              const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
              const isLate = diffHrs > 24 && order.status !== 'COMPLETED' && order.status !== 'CANCELLED'

              return (
                <tr key={order.id} className="hover:bg-slate-50 group">
                  <td className={`p-4 font-bold ${isLate ? 'text-red-500' : 'text-slate-500'}`}>
                    {diffHrs < 1 ? 'Just now' : `${diffHrs}h ago`}
                  </td>
                  <td className="p-4 font-mono">{order.id.split('-')[0]}</td>
                  <td className="p-4">
                    <div className="font-bold">{order.shippingName}</div>
                    <div className="text-xs text-slate-400">{order.shippingAddress?.substring(0, 30)}...</div>
                  </td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                        ${order.status === 'VERIFYING' ? 'bg-orange-100 text-orange-700' : 
                          order.status === 'PAID' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}
                     `}>
                        {order.status}
                     </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => handleCopyAddress(order)} className="p-2 hover:bg-slate-200 rounded text-slate-500" title="Copy Address">
                        <Copy size={16} />
                      </button>
                      {order.status === 'VERIFYING' && (
                        <button onClick={() => setSelectedOrder(order)} className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded flex items-center gap-1 font-bold text-xs px-3">
                          <Eye size={14} /> Review Slip
                        </button>
                      )}
                      {order.status === 'PAID' && (
                         <button className="p-2 bg-black text-white hover:bg-slate-800 rounded flex items-center gap-1 font-bold text-xs px-3">
                            <Truck size={14} /> Ship
                         </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Slip Verification Drawer/Modal (Split View) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-5xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex">
            
            {/* Left: Image Viewer */}
            <div className="w-1/2 bg-slate-900 flex items-center justify-center p-8 relative">
               {selectedOrder.slipImage ? (
                 <img src={selectedOrder.slipImage} className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
               ) : (
                 <div className="text-slate-500">No Slip Uploaded</div>
               )}
            </div>

            {/* Right: Info & Actions */}
            <div className="w-1/2 p-8 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                 <h2 className="text-2xl font-bold">Verify Payment</h2>
                 <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24}/></button>
              </div>

              <div className="space-y-6 flex-1">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-slate-500 text-sm mb-1">Total Amount</div>
                    <div className="text-3xl font-bold text-emerald-600">฿{Number(selectedOrder.total).toLocaleString()}</div>
                 </div>
                 
                 <div className="space-y-4">
                    <div>
                       <div className="text-slate-500 text-xs uppercase font-bold mb-1">Customer</div>
                       <div className="font-bold">{selectedOrder.shippingName}</div>
                       <div className="text-sm text-slate-500">{selectedOrder.shippingPhone}</div>
                    </div>
                    <div>
                       <div className="text-slate-500 text-xs uppercase font-bold mb-1">Transfer Date</div>
                       <div className="text-sm">{new Date(selectedOrder.updatedAt).toLocaleString('th-TH')}</div>
                    </div>
                 </div>
              </div>

              {/* Fixed Action Buttons at Bottom */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                 <button 
                    onClick={() => handleUpdateStatus('PENDING')} // Reject
                    className="py-4 rounded-xl font-bold border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                 >
                    <XCircle size={20} /> Reject (Fake Slip)
                 </button>
                 <button 
                    onClick={() => handleUpdateStatus('PAID')} // Approve
                    className="py-4 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                 >
                    <Check size={20} /> Approve Payment
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}