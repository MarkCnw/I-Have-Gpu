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

    // ✅ ขณะที่ยังไม่ Mounted ให้แสดง Skeleton วงกลมเนียนๆ
    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse border border-transparent" />
        )
    }

    const isDark = theme === 'dark'

    return (
        <motion.button
            onClick={toggleTheme}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 border shadow-sm backdrop-blur-md
                ${isDark 
                    ? 'bg-slate-900/60 border-slate-700/50 shadow-indigo-900/20 hover:bg-slate-800 hover:border-indigo-500/50' 
                    : 'bg-white/80 border-slate-200/80 shadow-amber-500/10 hover:bg-white hover:border-amber-400/50'
                }
            `}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
            {/* 🌟 แสง Glow เรืองแสงอยู่ด้านหลังเบาๆ */}
            <div 
                className={`absolute inset-0 opacity-20 blur-md transition-colors duration-500 ${
                    isDark ? 'bg-indigo-500' : 'bg-amber-400'
                }`} 
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={theme}
                    // Animation สไลด์ขึ้น/ลง พร้อมความเด้ง (Spring)
                    initial={{ y: 20, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: 45 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative z-10"
                >
                    {isDark ? (
                        <Moon 
                            size={18} 
                            // สีม่วงคราม มี Fill โปร่งแสง และมีแสงเรืองๆ รอบไอคอน
                            className="text-indigo-400 fill-indigo-400/20 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" 
                        />
                    ) : (
                        <Sun 
                            size={18} 
                            // สีเหลืองทอง มี Fill โปร่งแสง และมีแสงเรืองๆ รอบไอคอน
                            className="text-amber-500 fill-amber-500/20 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.button>
    )
}