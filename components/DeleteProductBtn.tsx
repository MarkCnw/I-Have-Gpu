// components/DeleteProductBtn.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ConfirmModal from './ConfirmModal'

export default function DeleteProductBtn({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      router.refresh()
      toast.success('ลบสินค้าสำเร็จ')
    } else {
      toast.error('❌ ลบไม่สำเร็จ (อาจมีออเดอร์ค้างอยู่)')
    }
    setLoading(false)
    setIsConfirmOpen(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsConfirmOpen(true)}
        disabled={loading}
        className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded transition"
        title="Delete Product"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="ยืนยันการลบสินค้า"
        message="คุณต้องการลบสินค้านี้ใช่หรือไม่? การกระทำนี้ไม่สามารถกู้คืนได้"
        confirmText="ลบสินค้า"
        loading={loading}
        variant="danger"
      />
    </>
  )
}