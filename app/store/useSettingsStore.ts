// app/store/useSettingsStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 🔥 เพิ่ม 'jp' เข้าไปใน Type
export type Language = 'th' | 'en' | 'jp'

type SettingsState = {
  language: Language
  isDarkMode: boolean
  setLanguage: (lang: Language) => void
  toggleDarkMode: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'th', // ค่าเริ่มต้น
      isDarkMode: false,

      setLanguage: (lang) => set({ language: lang }),
      
      toggleDarkMode: () => set((state) => {
        // สลับ Class 'dark' ที่ <html> ทันที
        if (typeof document !== 'undefined') {
          const html = document.documentElement
          if (!state.isDarkMode) {
            html.classList.add('dark')
          } else {
            html.classList.remove('dark')
          }
        }
        return { isDarkMode: !state.isDarkMode }
      }),
    }),
    {
      name: 'web-settings', // เก็บค่าไว้ใน LocalStorage
    }
  )
)