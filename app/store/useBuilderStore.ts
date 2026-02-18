// app/store/useBuilderStore.ts
import { create } from 'zustand'

type Product = {
    id: string
    name: string
    price: number
    category: string
    image: string | null
    specs: any
}

type BuilderState = {
    selectedParts: Record<string, Product | null>
    selectPart: (category: string, product: Product) => void
    removePart: (category: string) => void
    // 🔥 เพิ่มฟังก์ชันนี้
    setAiBuild: (products: Product[]) => void 
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

    // 🔥 Implementation: รับ Array สินค้ามา แล้ว Loop ใส่ State ตามหมวดหมู่
    setAiBuild: (products) => {
        const newParts: Record<string, Product> = {}
        products.forEach(p => {
            if (p) newParts[p.category] = p
        })
        set({ selectedParts: newParts })
    },

    getTotalPrice: () => {
        const parts = get().selectedParts
        return Object.values(parts).reduce((total, part) => {
            return total + (part ? Number(part.price) : 0)
        }, 0)
    }
}))