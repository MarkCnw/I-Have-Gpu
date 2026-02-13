// app/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Package, Upload, QrCode, X, Copy, Truck, ExternalLink, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// 🔥 ตัวแปลงภาษา (ฝั่ง User)
const STATUS_LABEL_TH: Record<string, string> = {
  PENDING: 'รอชำระเงิน',
  VERIFYING: 'รอตรวจสอบ',
  PAID: 'ชำระแล้ว',
  SHIPPED: 'จัดส่งแล้ว',
  CANCELLED: 'ยกเลิก',
  COMPLETED: 'สำเร็จ',
  PAYMENT_FAILED: 'ชำระเงินไม่สำเร็จ', // ✅ เพิ่มสถานะ
  // เผื่อตัวเล็ก
  pending: 'รอชำระเงิน',
  verifying: 'รอตรวจสอบ',
  paid: 'ชำระแล้ว',
  shipped: 'จัดส่งแล้ว',
  cancelled: 'ยกเลิก',
  completed: 'สำเร็จ',
  payment_failed: 'ชำระเงินไม่สำเร็จ'
}

// ✅ ส่วนที่เพิ่ม: Component สำหรับ Skeleton Loading ของการ์ดคำสั่งซื้อ
const OrderSkeleton = () => (
  <div className="bg-surface-card rounded-2xl shadow-sm border border-border-light overflow-hidden animate-pulse">
    <div className="bg-surface-bg p-4 border-b border-border-light flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-3 w-16 bg-border-main rounded"></div>
        <div className="h-4 w-32 bg-border-main rounded"></div>
      </div>
      <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
    </div>
    <div className="p-5 space-y-4">
      <div className="flex gap-3">
        <div className="w-12 h-12 bg-slate-200 rounded-lg flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
          <div className="h-3 w-1/4 bg-slate-200 rounded"></div>
        </div>
        <div className="h-4 w-20 bg-slate-200 rounded"></div>
      </div>
      <div className="border-t border-border-light my-4"></div>
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-slate-200 rounded"></div>
          <div className="h-6 w-28 bg-slate-200 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  </div>
)

export default function OrdersPage() {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [loadingPage, setLoadingPage] = useState(true)

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      const data = await res.json()
      if (Array.isArray(data)) setOrders(data)
    } catch (error) {
      toast.error('ไม่สามารถโหลดข้อมูลได้')
    } finally {
      setLoadingPage(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  // ✅ ฟังก์ชันช่วยคัดลอก (แก้บั๊ก Clipboard undefined)
  const safeCopy = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
      toast.success('คัดลอกแล้ว')
    } else {
      // Fallback สำหรับ Browser เก่า หรือ HTTP
      toast.error('Browser ไม่รองรับการคัดลอก')
    }
  }

  const handleUploadSlip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedOrder) return

    setUploading(true)
    const toastId = toast.loading('กำลังอัปโหลดสลิป...')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()

      const updateRes = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'VERIFYING',
          slipImage: uploadData.url,
          rejectionReason: null // ✅ ล้างเหตุผลการปฏิเสธ
        })
      })

      if (!updateRes.ok) throw new Error('Update failed')

      toast.success('แจ้งโอนเงินเรียบร้อย!', { id: toastId })
      await fetchOrders()
      setSelectedOrder(null)
    } catch (err) {
      toast.error('เกิดข้อผิดพลาด', { id: toastId })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        {/* ✅ เพิ่ม Breadcrumb Navigation ที่นี่ */}
        <div className="flex items-center gap-2 text-sm text-txt-muted mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">หน้าแรก</Link>
          <span className="text-txt-muted text-xs font-bold">{'>'}</span>
          <span className="text-foreground font-medium">คำสั่งซื้อของฉัน</span>
        </div>

        <div className="flex items-center gap-4 mb-8">

          <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
            <Package className="text-foreground" /> คำสั่งซื้อของฉัน
          </h1>
        </div>

        <div className="space-y-6">
          {/* ✅ ส่วนที่แก้ไข: แสดง Skeleton เมื่อกำลังโหลด */}
          {loadingPage ? (
            [...Array(3)].map((_, i) => <OrderSkeleton key={i} />)
          ) : orders.length === 0 ? (
            <div className="text-center py-20 text-txt-muted bg-surface-card rounded-2xl border border-dashed border-border-main">
              ยังไม่มีคำสั่งซื้อ
            </div>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            orders.map((order: any) => (
              <div key={order.id} className="bg-surface-card rounded-2xl shadow-sm border border-border-light overflow-hidden transition hover:shadow-md">

                {/* Header Card */}
                <div className="bg-surface-bg p-4 flex justify-between items-center border-b border-border-light">
                  <div>
                    <p className="text-xs text-txt-muted font-bold uppercase tracking-wider mb-0.5">Order ID</p>
                    <p className="text-sm font-mono font-bold text-txt-secondary">#{order.id.split('-')[0]}</p>
                    <p className="text-[10px] text-txt-muted mt-1">
                      {new Date(order.createdAt).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                  </div>
                  {/* Status Badge ภาษาไทย */}
                  <StatusBadge status={order.status} />
                </div>

                <div className="p-5">
                  {/* Items */}
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm mb-3 last:mb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-surface-bg rounded-lg flex-shrink-0 overflow-hidden border border-border-main">
                          {item.product?.image && <img src={item.product.image} className="w-full h-full object-cover mix-blend-multiply" />}
                        </div>
                        <div>
                          <span className="font-bold text-foreground line-clamp-1">{item.product?.name}</span>
                          <span className="text-txt-muted text-xs">จำนวน: {item.quantity} ชิ้น</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-txt-secondary">฿{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}

                  {/* Divider */}
                  <div className="border-t border-border-light my-4"></div>

                  {/* ✅ ส่วนที่เพิ่ม: แสดงกล่องแจ้งเหตุผลหาก Admin ปฏิเสธสลิป */}
                  {order.status === 'PAYMENT_FAILED' && (
                    <div className="mb-4 bg-red-50 rounded-xl p-4 border border-red-100 flex items-start gap-3 animate-in slide-in-from-top-2">
                      <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-sm font-bold text-red-700">การชำระเงินถูกปฏิเสธ</p>
                        <p className="text-sm text-red-600 mt-1">
                          เหตุผล: {order.rejectionReason || 'หลักฐานไม่ถูกต้อง กรุณาตรวจสอบและแนบใหม่อีกครั้ง'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 🔥 Tracking Number (ภาษาไทย) */}
                  {order.status === 'SHIPPED' && order.trackingNumber && (
                    <div className="mb-4 bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                          <Truck size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">เลขพัสดุ ({order.carrier})</p>
                          <p className="text-lg font-mono font-bold text-blue-900 tracking-wide">{order.trackingNumber}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => safeCopy(order.trackingNumber)} // ✅ เรียกใช้ safeCopy แทน
                          className="flex-1 sm:flex-none px-3 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-50 transition flex items-center justify-center gap-1"
                        >
                          <Copy size={14} /> คัดลอก
                        </button>
                        <a
                          href={`https://www.google.com/search?q=${order.trackingNumber}`}
                          target="_blank"
                          className="flex-1 sm:flex-none px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition flex items-center justify-center gap-1"
                        >
                          <ExternalLink size={14} /> เช็คสถานะ
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-txt-muted font-bold uppercase">ยอดสุทธิ</p>
                      <span className="font-bold text-2xl text-foreground">฿{Number(order.total).toLocaleString()}</span>
                    </div>

                    {/* ✅ ปรับปรุง Logic ปุ่ม: แสดงตอน PENDING หรือ PAYMENT_FAILED */}
                    {['PENDING', 'PAYMENT_FAILED'].includes(order.status) ? (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-foreground text-surface-card px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-black/10 active:scale-95"
                      >
                        {order.status === 'PAYMENT_FAILED' ? <><Upload size={18} /> แนบสลิปใหม่</> : <><QrCode size={18} /> แจ้งชำระเงิน</>}
                      </button>
                    ) : (
                      <Link href={`/order-success?id=${order.id}`} className="px-4 py-2 rounded-lg border border-border-main text-txt-secondary text-sm font-bold hover:bg-surface-bg transition">
                        ดูบิลใบเสร็จ
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Popup (QrCode) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-[99] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-5 right-5 text-txt-muted hover:text-foreground transition bg-surface-bg rounded-full p-1">
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-6 text-center text-foreground">ชำระเงิน (Payment)</h3>

            <div className="bg-surface-bg p-6 rounded-2xl border border-border-main mb-6 text-center">
              <div className="bg-surface-card p-4 inline-block rounded-xl shadow-sm border border-border-light mb-4">
                <Image
                  src="/qrcodee.png"
                  alt="Payment QR Code"
                  width={192}
                  height={192}
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-txt-muted font-bold">สแกน QR เพื่อโอนเงิน</p>
              <p className="text-xs text-txt-muted mt-1">ธ.ออมสิน • บจก. ไอแฮฟจีพียู</p>
              <div className="my-4 border-t border-dashed border-border-main"></div>
              <div className="flex justify-between items-end px-4">
                <span className="text-sm text-txt-muted font-bold">ยอดที่ต้องโอน</span>
                <span className="text-3xl font-bold text-emerald-600">฿{Number(selectedOrder.total).toLocaleString()}</span>
              </div>
            </div>

            <label className={`block w-full border-2 border-dashed border-border-main rounded-xl p-6 text-center cursor-pointer hover:bg-surface-bg hover:border-txt-muted transition group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-surface-bg p-3 rounded-full group-hover:bg-surface-card transition mb-1">
                  {uploading ? <Loader2 size={24} className="text-txt-muted animate-spin" /> : <Upload size={24} className="text-txt-muted group-hover:text-foreground" />}
                </div>
                <div>
                  <span className="font-bold text-txt-secondary block">{uploading ? 'กำลังอัปโหลด...' : 'แนบสลิปการโอนเงิน'}</span>
                  <span className="text-[10px] text-txt-muted uppercase">Supports JPG, PNG</span>
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
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    VERIFYING: "bg-blue-100 text-blue-700 border-blue-200",
    PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
    SHIPPED: "bg-indigo-100 text-indigo-700 border-indigo-200",
    CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
    COMPLETED: "bg-purple-100 text-purple-700 border-purple-200",
    PAYMENT_FAILED: "bg-red-100 text-red-700 border-red-200" // ✅ เพิ่มสีแดงสำหรับสถานะนี้
  }

  // แปลงสถานะเป็นไทย
  const label = STATUS_LABEL_TH[status] || STATUS_LABEL_TH[status.toUpperCase()] || status

  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${styles[status.toUpperCase()] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {label}
    </span>
  )
}