// components/OrderStatusSelector.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import ConfirmModal from './ConfirmModal'

export default function OrderStatusSelector({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [pendingStatus, setPendingStatus] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleChange = (newStatus: string) => {
    setPendingStatus(newStatus)
    setIsConfirmOpen(true)
  }

  const confirmChange = async () => {
    setLoading(true)
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: pendingStatus })
    })

    if (res.ok) {
      setStatus(pendingStatus)
      router.refresh() // รีโหลดข้��มูลใหม่
      toast.success('อัปเดตสถานะสำเร็จ')
    } else {
      toast.error('❌ อัปเดตไม่สำเร็จ')
    }
    setLoading(false)
    setIsConfirmOpen(false)
  }

  // สีของแต่ละสถานะ
  const getColors = (s: string) => {
    switch(s) {
      case 'PAID': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'SHIPPED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'COMPLETED': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-700 text-slate-400'
    }
  }

  return (
    <>
      <select 
        value={status}
        disabled={loading}
        onChange={(e) => handleChange(e.target.value)}
        className={`px-2 py-1 rounded text-xs font-bold border outline-none cursor-pointer appearance-none text-center min-w-[100px] ${getColors(status)}`}
      >
        <option value="PAID">PAID</option>
        <option value="SHIPPED">SHIPPED</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmChange}
        title="ยืนยันการเปลี่ยนสถานะ"
        message={`คุณต้องการเปลี่ยนสถานะเป็น "${pendingStatus}" ใช่หรือไม่?`}
        confirmText="ยืนยัน"
        loading={loading}
        variant={pendingStatus === 'CANCELLED' ? 'danger' : 'info'}
      />
    </>
  )
}