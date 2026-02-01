// components/DeleteProductBtn.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react' // 👈 Import

export default function DeleteProductBtn({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('ยืนยันที่จะลบสินค้านี้? (กู้คืนไม่ได้นะ)')) return

    setLoading(true)
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      router.refresh() 
    } else {
      alert('❌ ลบไม่สำเร็จ (อาจมีออเดอร์ค้างอยู่)')
    }
    setLoading(false)
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded transition"
      title="Delete Product"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  )
}