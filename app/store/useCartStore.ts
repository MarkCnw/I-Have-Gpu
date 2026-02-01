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
  category?: string // เพิ่ม field นี้เผื่อไว้โชว์ในตะกร้า
}

type CartState = {
  items: CartItem[] // เปลี่ยนชื่อจาก cart -> items ให้ตรงกับหน้า CartPage
  addToCart: (product: any) => void
  removeItem: (productId: string) => void // เปลี่ยนชื่อจาก removeFromCart -> removeItem
  updateQuantity: (productId: string, quantity: number) => void // 🔥 เพิ่มฟังก์ชันนี้
  clearCart: () => void
  totalPrice: () => number // เปลี่ยนชื่อจาก getCartTotal -> totalPrice
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

      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      // 🔥 ฟังก์ชันสำหรับปุ่ม + / - ในหน้าตะกร้า
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