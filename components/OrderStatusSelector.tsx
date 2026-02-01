// components/OrderStatusSelector.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import ConfirmModal from '@/components/ConfirmModal'

// 🔥 เพิ่มตัวแปลงภาษา
const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'รอชำระเงิน' },
  { value: 'VERIFYING', label: 'รอตรวจสอบ' },
  { value: 'PAID', label: 'ชำระแล้ว' },
  { value: 'SHIPPED', label: 'จัดส่งแล้ว' },
  { value: 'COMPLETED', label: 'สำเร็จ' },
  { value: 'CANCELLED', label: 'ยกเลิก' },
]

export default function OrderStatusSelector({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [targetStatus, setTargetStatus] = useState<string | null>(null)

  const handleChange = (newStatus: string) => {
    setTargetStatus(newStatus)
  }

  const confirmChange = async () => {
    if (!targetStatus) return
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: targetStatus })
      })

      if (res.ok) {
        setStatus(targetStatus)
        toast.success(`อัปเดตสถานะเรียบร้อย`)
        router.refresh()
      } else {
        toast.error('อัปเดตไม่สำเร็จ')
      }
    } catch (err) {
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
      setTargetStatus(null)
    }
  }

  const getColors = (s: string) => {
    switch(s) {
      case 'PAID': return 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
      case 'SHIPPED': return 'bg-blue-500/20 text-blue-600 border-blue-500/30'
      case 'COMPLETED': return 'bg-purple-500/20 text-purple-600 border-purple-500/30'
      case 'CANCELLED': return 'bg-red-500/20 text-red-600 border-red-500/30'
      case 'VERIFYING': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
      default: return 'bg-slate-200 text-slate-600 border-slate-300'
    }
  }

  const targetLabel = STATUS_OPTIONS.find(o => o.value === targetStatus)?.label

  return (
    <>
      <select 
        value={targetStatus || status}
        disabled={loading}
        onChange={(e) => handleChange(e.target.value)}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer appearance-none text-center min-w-[110px] transition-all hover:brightness-95 ${getColors(status)}`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <ConfirmModal 
        isOpen={!!targetStatus}
        onClose={() => setTargetStatus(null)}
        onConfirm={confirmChange}
        title="เปลี่ยนสถานะ?"
        message={`ต้องการเปลี่ยนสถานะออเดอร์เป็น "${targetLabel}" ใช่หรือไม่?`}
        confirmText="ยืนยัน"
        loading={loading}
        variant="info"
      />
    </>
  )
}