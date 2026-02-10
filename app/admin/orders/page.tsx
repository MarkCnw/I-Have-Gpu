// app/admin/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, Check, X, Truck, ExternalLink, Copy, MapPin, Phone, Package } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ConfirmModal from '@/components/ConfirmModal'
import InputModal from '@/components/InputModal'
import Image from 'next/image'

const STATUS_LABEL: Record<string, string> = {
  ALL: 'ทั้งหมด',
  PENDING: 'รอชำระเงิน',
  VERIFYING: 'รอตรวจสอบ',
  PAID: 'ชำระแล้ว',
  SHIPPED: 'จัดส่งแล้ว',
  CANCELLED: 'ยกเลิก',
  COMPLETED: 'สำเร็จ',
  PAYMENT_FAILED: 'ชำระเงินไม่สำเร็จ' // ✅ เพิ่ม Label
}

// ✅ ส่วนที่เพิ่ม: Component สำหรับ Skeleton Loading ของแถวตารางคำสั่งซื้อ
const TableRowSkeleton = () => (
  <tr className="border-b border-slate-100">
    <td className="p-4"><div className="h-5 w-20 bg-slate-200 rounded animate-pulse" /></td>
    <td className="p-4">
      <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2" />
      <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
    </td>
    <td className="p-4"><div className="h-5 w-20 bg-slate-200 rounded animate-pulse" /></td>
    <td className="p-4"><div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" /></td>
    <td className="p-4"><div className="h-4 w-16 bg-slate-200 rounded animate-pulse" /></td>
    <td className="p-4"><div className="h-4 w-24 bg-slate-200 rounded animate-pulse" /></td>
    <td className="p-4 text-right"><div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse ml-auto" /></td>
  </tr>
)

export default function AdminOrdersPage() {
  // ✅ แก้ไข: มั่นใจว่าเริ่มต้นด้วย Array ว่าง
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true) // ✅ ส่วนที่เพิ่ม: state สำหรับตรวจสอบการโหลด

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmData, setConfirmData] = useState<{ id: string; status: string } | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  // ✅ เพิ่ม State สำหรับ Modal ปฏิเสธ
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null)

  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null)
  const [trackingNumber, setTrackingNumber] = useState('')
  
  const [isCarrierModalOpen, setIsCarrierModalOpen] = useState(false)
  const [trackingLoading, setTrackingLoading] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const fetchOrders = async () => {
    setIsLoading(true) // ✅ ส่วนที่เพิ่ม: เริ่มต้นโหลด
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      const data = await res.json()
      
      // ✅ แก้ไข: ตรวจสอบว่าเป็น Array หรือไม่ก่อน set state
      if (Array.isArray(data)) {
        setOrders(data)
      } else {
        console.error('Data is not an array:', data)
        setOrders([])
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setOrders([])
    } finally {
      setIsLoading(false) // ✅ ส่วนที่เพิ่ม: โหลดเสร็จสิ้น
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const openStatusConfirm = (id: string, status: string) => {
    setConfirmData({ id, status })
    setIsConfirmOpen(true)
  }

  // ✅ ฟังก์ชันเปิด Modal ปฏิเสธ
  const openRejectModal = (id: string) => {
    setRejectOrderId(id)
    setIsRejectModalOpen(true)
  }

  // ✅ ฟังก์ชันส่งข้อมูลปฏิเสธไปยัง API
  const handleRejectSubmit = async (reason: string) => {
    if (!rejectOrderId) return
    setConfirmLoading(true)
    try {
      await fetch(`/api/orders/${rejectOrderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'PAYMENT_FAILED', 
          rejectionReason: reason 
        })
      })
      toast.success('ปฏิเสธการชำระเงินเรียบร้อย')
      await fetchOrders()
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setConfirmLoading(false)
      setIsRejectModalOpen(false)
      setRejectOrderId(null)
    }
  }

  const confirmStatusChange = async () => {
    if (!confirmData) return
    setConfirmLoading(true)
    try {
      await fetch(`/api/orders/${confirmData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: confirmData.status })
      })
      toast.success('✅ อัปเดตสถานะเรียบร้อย')
      await fetchOrders()
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setConfirmLoading(false)
      setIsConfirmOpen(false)
      setConfirmData(null)
    }
  }

  const openTrackingModal = (id: string) => {
    setTrackingOrderId(id)
    setTrackingNumber('')
    setIsTrackingModalOpen(true)
  }

  const handleTrackingSubmit = (value: string) => {
    setTrackingNumber(value)
    setIsTrackingModalOpen(false)
    setIsCarrierModalOpen(true)
  }

  const handleCarrierSubmit = async (carrier: string) => {
    if (!trackingOrderId || !trackingNumber) return
    setTrackingLoading(true)
    try {
      await fetch(`/api/orders/${trackingOrderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: trackingOrderId,
          status: 'SHIPPED', 
          trackingNumber: trackingNumber,
          carrier: carrier || 'Kerry Express' 
        })
      })
      toast.success('✅ บันทึกเลขพัสดุเรียบร้อย')
      await fetchOrders()
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setTrackingLoading(false)
      setIsCarrierModalOpen(false)
      setTrackingOrderId(null)
      setTrackingNumber('')
    }
  }

  // ✅ แก้ไข: ตรวจสอบความชัวร์ก่อนกรองข้อมูล
  const safeOrders = Array.isArray(orders) ? orders : []
  const filteredOrders = filter === 'ALL' ? safeOrders : safeOrders.filter((o: any) => o.status === filter)

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">จัดการคำสั่งซื้อ (Orders)</h1>
        
        <div className="flex bg-white p-1 rounded-lg border border-slate-200">
          {['ALL', 'VERIFYING', 'PAID', 'SHIPPED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${filter === f ? 'bg-black text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {STATUS_LABEL[f]}
              {/* ✅ แก้ไข: ป้องกัน filter error ใน badge */}
              {f === 'VERIFYING' && safeOrders.filter((o: any) => o.status === 'VERIFYING').length > 0 && <span className="ml-1 text-red-400">●</span>}
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
            {/* ✅ ส่วนที่เพิ่ม: แสดง Skeleton เมื่อกำลังโหลด */}
            {isLoading ? (
              [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-slate-400">ไม่พบรายการคำสั่งซื้อ</td>
              </tr>
            ) : (
              filteredOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono">{order.id.split('-')[0]}</td>
                  <td className="p-4">
                    <p className="font-bold">{order.shippingName}</p>
                    <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="p-4 font-bold text-emerald-600">฿{Number(order.total).toLocaleString()}</td>
                  
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold 
                      ${order.status === 'VERIFYING' ? 'bg-yellow-100 text-yellow-700' : 
                        order.status === 'PAYMENT_FAILED' ? 'bg-red-100 text-red-700' :
                        order.status === 'PAID' ? 'bg-indigo-100 text-indigo-700' :
                        order.status === 'SHIPPED' ? 'bg-green-100 text-green-700' : 
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
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
                      <button 
                        onClick={() => setSelectedOrder(order)} 
                        className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-slate-200 text-xs font-bold"
                        title="ดูรายละเอียดที่อยู่และสินค้า"
                      >
                        <Eye size={14} /> รายละเอียด
                      </button>

                      {order.status === 'VERIFYING' && (
                        <>
                          <button onClick={() => openStatusConfirm(order.id, 'PAID')} className="bg-green-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-green-700 text-xs font-bold">
                            <Check size={14} /> ยืนยัน
                          </button>
                          {/* ✅ เปลี่ยนปุ่มปฏิเสธให้เรียก Modal */}
                          <button onClick={() => openRejectModal(order.id)} className="bg-red-50 text-red-600 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-red-100 border border-red-200 text-xs font-bold">
                            <X size={14} /> ปฏิเสธ
                          </button>
                        </>
                      )}

                      {order.status === 'PAID' && (
                        <button onClick={() => openTrackingModal(order.id)} className="bg-black text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-neutral-800 text-xs font-bold">
                          <Truck size={14} /> จัดส่งสินค้า
                        </button>
                      )}
                      
                      {/* ✅ คงฟีเจอร์แก้ไขเลขพัสดุไว้ */}
                      {order.status === 'SHIPPED' && (
                        <button onClick={() => openTrackingModal(order.id)} className="text-blue-600 hover:underline text-xs font-bold">
                            แก้ไขเลข
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal สำหรับกรอกเหตุผลการปฏิเสธ */}
      <InputModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectSubmit}
        title="ระบุเหตุผลที่ปฏิเสธการชำระเงิน"
        placeholder="เช่น ยอดเงินไม่ถูกต้อง หรือ สลิปไม่ชัดเจน"
        confirmText="ยืนยันปฏิเสธ"
        loading={confirmLoading}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmStatusChange}
        title="ยืนยันการเปลี่ยนสถานะ"
        message={`คุณต้องการเปลี่ยนสถานะเป็น "${confirmData ? STATUS_LABEL[confirmData.status] || confirmData.status : ''}" ใช่หรือไม่?`}
        confirmText="ยืนยัน"
        loading={confirmLoading}
        variant={confirmData?.status === 'PENDING' ? 'danger' : 'info'}
      />

      <InputModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        onConfirm={handleTrackingSubmit}
        title="กรุณากรอกเลขพัสดุ (Tracking Number)"
        placeholder="เช่น TH12345678901"
        confirmText="ถัดไป"
      />

      <InputModal
        isOpen={isCarrierModalOpen}
        onClose={() => setIsCarrierModalOpen(false)}
        onConfirm={handleCarrierSubmit}
        title="ชื่อบริษัทขนส่ง"
        placeholder="เช่น Kerry, Flash, Thailand Post"
        defaultValue="Kerry Express"
        confirmText="บันทึก"
        loading={trackingLoading}
      />

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
              <div>
                <h3 className="font-bold text-lg text-slate-800">รายละเอียดคำสั่งซื้อ</h3>
                <p className="text-xs text-slate-500 font-mono">ID: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-neutral-200 rounded-full text-slate-500">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm flex items-center gap-2 text-slate-700"><MapPin size={16}/> ที่อยู่จัดส่ง</h4>
                <div className="text-sm text-slate-600 pl-6 space-y-1">
                  <p className="text-lg font-bold text-black">{selectedOrder.shippingName}</p>
                  <p>{selectedOrder.shippingAddress}</p>
                  <p className="text-slate-500">{selectedOrder.shippingZipcode}</p>
                  <div className="flex items-center gap-2 mt-2 text-black font-medium">
                    <Phone size={14}/> {selectedOrder.shippingPhone}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-700"><Package size={16}/> รายการสินค้า</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-3 border border-slate-100 rounded-lg bg-white">
                      <div className="w-12 h-12 bg-slate-50 rounded-md flex items-center justify-center relative overflow-hidden">
                        {item.product?.image ? (
                           <Image src={item.product.image} alt={item.product.name} fill className="object-contain mix-blend-multiply p-1" />
                        ) : (
                           <div className="text-xs text-slate-300">No Img</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm line-clamp-1 text-slate-800">{item.product?.name}</p>
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>จำนวน: x{item.quantity}</span>
                          <span>฿{Number(item.price).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.taxId && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm">
                  <h4 className="font-bold text-blue-800 mb-2">ขอใบกำกับภาษี</h4>
                  <p><strong>ชื่อ:</strong> {selectedOrder.taxName}</p>
                  <p><strong>เลขภาษี:</strong> {selectedOrder.taxId}</p>
                  <p><strong>ที่อยู่:</strong> {selectedOrder.taxAddress}</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
               <span className="text-slate-500 text-sm mr-2">ยอดสุทธิ</span>
               <span className="text-xl font-bold text-slate-900">฿{Number(selectedOrder.total).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}