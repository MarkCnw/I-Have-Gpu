// components/DeleteProductBtn.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ConfirmModal from './ConfirmModal'
import { useLanguageStore } from '@/app/store/useLanguageStore'

export default function DeleteProductBtn({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { locale } = useLanguageStore()

  const handleDelete = async () => {
    setLoading(true)
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      router.refresh()
      toast.success(locale === 'en' ? 'Product deleted' : locale === 'jp' ? '商品を削除しました' : 'ลบสินค้าสำเร็จ')
    } else {
      toast.error(locale === 'en' ? 'Delete failed (may have pending orders)' : locale === 'jp' ? '削除失敗（保留中の注文がある可能性）' : '❌ ลบไม่สำเร็จ (อาจมีออเดอร์ค้างอยู่)')
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
        title={locale === 'en' ? 'Confirm deletion' : locale === 'jp' ? '削除を確認' : 'ยืนยันการลบสินค้า'}
        message={locale === 'en' ? 'Are you sure you want to delete this product? This action cannot be undone.' : locale === 'jp' ? 'この商品を削除しますか？この操作は元に戻せません。' : 'คุณต้องการลบสินค้านี้ใช่หรือไม่? การกระทำนี้ไม่สามารถกู้คืนได้'}
        confirmText={locale === 'en' ? 'Delete' : locale === 'jp' ? '削除' : 'ลบสินค้า'}
        loading={loading}
        variant="danger"
      />
    </>
  )
}