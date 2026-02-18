// app/store/useLanguageStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Locale = 'th' | 'en' | 'jp'

interface LanguageState {
    locale: Locale
    setLocale: (locale: Locale) => void
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            locale: 'th',
            setLocale: (locale) => set({ locale }),
        }),
        { name: 'ihavegpu-locale' }
    )
)
