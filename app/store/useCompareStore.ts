import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// กำหนด Type ให้ชัดเจน
export interface Product {
  id: string
  name: string
  price: number
  image: string | null
  category: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  specs?: any
}

interface CompareStore {
  compareList: Product[]
  addToCompare: (product: Product) => void
  removeFromCompare: (id: string) => void
  clearCompare: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      compareList: [],
      addToCompare: (product) => {
        const current = get().compareList
        // จำกัดไม่เกิน 3 ชิ้น และต้องไม่ซ้ำ
        if (current.length >= 3) return
        if (current.find((p) => p.id === product.id)) return
        
        // เช็คหมวดหมู่: ถ้ามีสินค้าอยู่แล้ว ต้องเป็นหมวดเดียวกันถึงจะเทียบได้
        if (current.length > 0 && current[0].category !== product.category) {
          alert(`กรุณาเลือกสินค้าในหมวด ${current[0].category} เหมือนกันเพื่อเปรียบเทียบ`)
          return
        }

        set({ compareList: [...current, product] })
      },
      removeFromCompare: (id) => {
        set({ compareList: get().compareList.filter((p) => p.id !== id) })
      },
      clearCompare: () => set({ compareList: [] }),
    }),
    {
      name: 'compare-storage', // เก็บลง LocalStorage กัน Refresh หาย
    }
  )
)