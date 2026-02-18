/* eslint-disable @typescript-eslint/no-explicit-any */
// app/store/useCartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  name: string
  price: number
  image: string | null
  quantity: number
  category?: string
}

type CartState = {
  items: CartItem[]
  addToCart: (product: any) => void
  addMultipleToCart: (products: any[]) => void // 🔥 ต้องมีบรรทัดนี้
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalPrice: () => number
  getCartCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product) => set((state) => {
        const existing = state.items.find(item => item.id === product.id)
        if (existing) {
          return {
            items: state.items.map(item => 
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          }
        }
        return {
          items: [...state.items, { 
            id: product.id, 
            name: product.name, 
            price: Number(product.price), 
            image: product.image,
            category: product.category,
            quantity: 1 
          }]
        }
      }),

      // 🔥 ฟังก์ชันสำคัญที่ต้องเพิ่ม เพื่อให้ AI ยัดของลงตะกร้าได้
      addMultipleToCart: (products) => set((state) => {
        let newItems = [...state.items]
        
        products.forEach(product => {
          const existingIndex = newItems.findIndex(item => item.id === product.id)
          
          if (existingIndex > -1) {
            // ถ้ามีอยู่แล้ว ให้บวกจำนวนเพิ่ม
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + 1
            }
          } else {
            // ถ้ายังไม่มี ให้เพิ่มใหม่
            newItems.push({
              id: product.id,
              name: product.name,
              price: Number(product.price),
              image: product.image,
              category: product.category,
              quantity: 1 
            })
          }
        })
        
        return { items: newItems }
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, quantity: quantity } : item
        )
      })),

      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    { name: 'shopping-cart' }
  )
)