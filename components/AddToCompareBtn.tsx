'use client'

import { useCompareStore, Product } from '@/app/store/useCompareStore'
import { Scale } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AddToCompareBtn({ product }: { product: Product }) {
  const { addToCompare, compareList, removeFromCompare } = useCompareStore()

  const isAdded = compareList.some(p => p.id === product.id)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault() // ป้องกันไม่ให้กดแล้ว Link ไปหน้า Product Detail
    e.stopPropagation()

    if (isAdded) {
      removeFromCompare(product.id)
      toast.success('ลบออกจากรายการเปรียบเทียบ')
    } else {
      if (compareList.length >= 3) {
        return toast.error('เปรียบเทียบได้สูงสุด 3 ชิ้น')
      }
      // เช็คหมวดหมู่
      if (compareList.length > 0 && compareList[0].category !== product.category) {
        return toast.error(`สินค้าต้องอยู่ในหมวด ${compareList[0].category} เหมือนกัน`)
      }

      addToCompare(product)
      toast.success('เพิ่มลงรายการเปรียบเทียบแล้ว')
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all border ${isAdded
          ? 'bg-foreground text-surface-card border-foreground'
          : 'bg-surface-card text-txt-muted border-border-main hover:border-foreground hover:text-foreground'
        }`}
      title="เปรียบเทียบสินค้า"
    >
      <Scale size={18} />
    </button>
  )
}