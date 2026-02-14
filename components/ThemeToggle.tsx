// components/ThemeToggle.tsx
'use client'

import { useThemeStore } from '@/app/store/useThemeStore'
import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore()
    const [mounted, setMounted] = useState(false)

    // ✅ บังคับให้เริ่ม Render ค่าเดียวกันทั้ง Server และ Client ในครั้งแรก
    useEffect(() => {
        setMounted(true)
    }, [])

    // ✅ ขณะที่ยังไม่ Mounted (Server-side) ให้ Render ปุ่มเปล่าที่มีขนาดเท่ากัน
    // เพื่อให้ Tag (button) ตรงกัน และป้องกัน Layout Shift
    if (!mounted) {
        return (
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" disabled>
                <div className="w-5 h-5" />
            </button>
        )
    }

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-full flex items-center justify-center
            bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700
            transition-colors duration-300 border border-neutral-200 dark:border-neutral-700"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    {theme === 'light' ? (
                        <Moon size={18} className="text-neutral-700" />
                    ) : (
                        <Sun size={18} className="text-yellow-400" />
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.button>
    )
}