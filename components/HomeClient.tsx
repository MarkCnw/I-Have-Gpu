// components/HomeClient.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import SearchBar from '@/components/SearchBar'
import ProfileDropdown from '@/components/ProfileDropdown'
import NavbarCart from '@/components/NavbarCart'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'
import {
    Cpu, CircuitBoard, Gamepad2, MemoryStick, HardDrive, Zap, Box,
    Fan, Monitor, Laptop, Mouse, Keyboard, Headphones, Armchair,
    Sparkles, LayoutGrid, LogIn, ArrowUpRight
} from 'lucide-react'
import { ReactNode, Suspense } from 'react'

const CATEGORY_ICONS: Record<string, ReactNode> = {
    'ALL': <Sparkles size={18} />,
    'CPU': <Cpu size={18} />,
    'MOTHERBOARD': <CircuitBoard size={18} />,
    'GPU': <Gamepad2 size={18} />,
    'RAM': <MemoryStick size={18} />,
    'STORAGE': <HardDrive size={18} />,
    'PSU': <Zap size={18} />,
    'CASE': <Box size={18} />,
    'COOLER': <Fan size={18} />,
    'MONITOR': <Monitor size={18} />,
    'LAPTOP': <Laptop size={18} />,
    'MOUSE': <Mouse size={18} />,
    'KEYBOARD': <Keyboard size={18} />,
    'HEADSET': <Headphones size={18} />,
    'CHAIR': <Armchair size={18} />,
}

const CATEGORY_KEYS: Record<string, string> = {
    'ALL': 'cat.all',
    'CPU': 'cat.cpu',
    'MOTHERBOARD': 'cat.motherboard',
    'GPU': 'cat.gpu',
    'RAM': 'cat.ram',
    'STORAGE': 'cat.storage',
    'PSU': 'cat.psu',
    'CASE': 'cat.case',
    'COOLER': 'cat.cooler',
    'MONITOR': 'cat.monitor',
    'LAPTOP': 'cat.laptop',
    'MOUSE': 'cat.mouse',
    'KEYBOARD': 'cat.keyboard',
    'HEADSET': 'cat.headset',
    'CHAIR': 'cat.chair',
}

interface HomeClientProps {
    user: any
    q?: string
    currentCategory: string
    heroSection: ReactNode
    productSection: ReactNode
    newsSection: ReactNode
    showcaseSection?: ReactNode // ✅ เพิ่ม Props รับ Showcase ตรงนี้
}

export default function HomeClient({
    user,
    q,
    currentCategory,
    heroSection,
    productSection,
    newsSection,
    showcaseSection, // ✅ รับตัวแปร Showcase เข้ามาใช้งาน
}: HomeClientProps) {
    const { locale } = useLanguageStore()
    const categoryIds = Object.keys(CATEGORY_ICONS)

    return (
        <div className="min-h-screen bg-surface-bg font-sans text-foreground pb-32 transition-colors duration-300">
            {/* ================= HEADER ================= */}
            <header className="bg-surface-card/90 backdrop-blur-md sticky top-0 z-50 border-b border-border-main transition-colors duration-300">
                <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center justify-between gap-8">
                    <Link href="/" className="flex-shrink-0 group flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Image src="/logo.svg" alt="iHAVEGPU Logo" width={200} height={60} className="object-contain h-16 w-auto " priority />
                    </Link>
                    <div className="hidden lg:block flex-1 max-w-2xl px-8">
                        <SearchBar />
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="lg:hidden">
                            <SearchBar />
                        </div>
                        <LanguageSwitcher />
                        <NavbarCart />
                        {(user as any)?.role === 'ADMIN' && (
                            <Link href="/admin" className="text-[10px] font-bold bg-primary text-surface-card px-2 py-1 rounded hover:bg-primary-hover transition-colors">{t('nav.admin', locale)}</Link>
                        )}
                        {user ? (
                            <ProfileDropdown user={user} />
                        ) : (
                            <>
                                <ThemeToggle />
                                <Link href="/login" className="text-sm font-medium hover:text-txt-secondary flex items-center gap-2 transition-colors">
                                    <LogIn size={20} /> {t('nav.login', locale)}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <div className="max-w-[1400px] mx-auto px-4 h-12 flex items-center justify-end gap-10 text-sm font-bold text-txt-secondary">
                        <Link href="/" className="hover:text-foreground transition hover:underline underline-offset-4 decoration-2">{t('nav.home', locale)}</Link>
                        <Link href="/builder" className="hover:text-foreground transition hover:underline underline-offset-4 decoration-2">{t('nav.buildPC', locale)}</Link>
                        <Link href="/warranty" className="hover:text-foreground transition hover:underline underline-offset-4 decoration-2">{t('nav.warranty', locale)}</Link>
                        <Link href="/contact" className="hover:text-foreground transition hover:underline underline-offset-4 decoration-2">{t('nav.contact', locale)}</Link>
                        <Link href="/about" className="hover:text-foreground transition hover:underline underline-offset-4 decoration-2">{t('nav.about', locale)}</Link>
                    </div>
                </div>
            </header>

            {/* ================= HERO & FEATURES ================= */}
            {!q && currentCategory === 'ALL' && heroSection}

            {/* ================= MAIN CONTENT ================= */}
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-txt-muted text-xs font-bold uppercase tracking-wider mb-3">
                        <LayoutGrid size={14} /> {t('main.categories', locale)}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {categoryIds.map((catId) => (
                            <Link
                                key={catId}
                                href={`/?category=${catId}`}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all
                  ${currentCategory === catId
                                        ? 'bg-primary text-surface-card border-primary shadow-lg'
                                        : 'bg-surface-card text-txt-secondary border-border-main hover:border-txt-muted hover:text-foreground'
                                    }
                `}
                            >
                                {CATEGORY_ICONS[catId]}
                                <span>{t(CATEGORY_KEYS[catId], locale)}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <main>
                    {productSection}
                </main>

                {!q && currentCategory === 'ALL' && newsSection}

                {/* ✅ เพิ่ม Community Showcase เข้ามาตรงนี้ */}
                {!q && currentCategory === 'ALL' && showcaseSection}
            </div>
        </div>
    )
}