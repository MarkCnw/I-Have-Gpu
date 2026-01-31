// store/useBuilderStore.ts
import { create } from 'zustand'

// กำหนดหน้าตาของข้อมูลสินค้า (Copy มาให้ตรงกับ Prisma)
type Product = {
    id: string
    name: string
    price: number // Prisma Decimal จะถูกแปลงเป็น number หรือ string ใน JS
    category: string
    image: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    specs: any
}

type BuilderState = {
    // เก็บของที่เลือกตามหมวดหมู่ (Key เป็นชื่อ Category)
    selectedParts: Record<string, Product | null>

    // ฟังก์ชันสำหรับเลือกของ
    selectPart: (category: string, product: Product) => void

    // ฟังก์ชันสำหรับลบของ
    removePart: (category: string) => void

    // คำนวณราคารวม
    getTotalPrice: () => number
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
    selectedParts: {},

    selectPart: (category, product) =>
        set((state) => ({
            selectedParts: { ...state.selectedParts, [category]: product }
        })),

    removePart: (category) =>
        set((state) => {
            const newParts = { ...state.selectedParts }
            delete newParts[category]
            return { selectedParts: newParts }
        }),

    getTotalPrice: () => {
        const parts = get().selectedParts
        return Object.values(parts).reduce((total, part) => {
            return total + (part ? Number(part.price) : 0)
        }, 0)
    }
}))