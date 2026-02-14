// components/LanguageSwitcher.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguageStore, type Locale } from '@/app/store/useLanguageStore'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const LANGUAGES = {
    th: { name: 'ไทย', flag: 'https://flagcdn.com/w40/th.png', label: 'TH' },
    en: { name: 'English', flag: 'https://flagcdn.com/w40/gb.png', label: 'EN' },
    jp: { name: '日本語', flag: 'https://flagcdn.com/w40/jp.png', label: 'JP' }
}

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLanguageStore()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const currentLang = LANGUAGES[locale as keyof typeof LANGUAGES] || LANGUAGES.th

    // ปิด Dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            {/* ปุ่มหลัก (ธงปัจจุบัน) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-transparent dark:border-neutral-700"
            >
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-600 shadow-sm">
                    <Image 
                        src={currentLang.flag} 
                        alt={currentLang.name} 
                        fill 
                        className="object-cover" 
                    />
                </div>
                <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* รายการ Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 overflow-hidden z-[100]"
                    >
                        {Object.entries(LANGUAGES).map(([code, lang]) => (
                            <button
                                key={code}
                                onClick={() => {
                                    setLocale(code as Locale)
                                    setIsOpen(false)
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors
                                    ${locale === code 
                                        ? 'bg-neutral-50 dark:bg-neutral-800 font-bold text-black dark:text-white' 
                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                    }`}
                            >
                                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-neutral-100 dark:border-neutral-700">
                                    <Image src={lang.flag} alt={lang.name} fill className="object-cover" />
                                </div>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}