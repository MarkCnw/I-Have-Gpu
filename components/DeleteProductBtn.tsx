// components/DeleteProductBtn.tsx
'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import ConfirmModal from '@/components/ConfirmModal' // 👈 Import Modal

export default function DeleteProductBtn({ id }: { id: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      
      toast.success('ลบสินค้าเรียบร้อย')
      router.refresh()
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการลบ')
    } finally {
      setLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} // 🔥 เปิด Modal
        className="text-red-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-full"
      >
        <Trash2 size={20} />
      </button>

      <ConfirmModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="ลบสินค้า?"
        message="สินค้าที่ลบจะไม่สามารถกู้คืนได้ คุณแน่ใจหรือไม่?"
        confirmText="ลบสินค้า"
        loading={loading}
        variant="danger"
      />
    </>
  )
}