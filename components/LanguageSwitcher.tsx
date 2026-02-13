// components/LanguageSwitcher.tsx
'use client'
import { useLanguageStore, type Locale } from '@/app/store/useLanguageStore'
import { motion } from 'framer-motion'

const LANGUAGES: { code: Locale; flag: string; label: string }[] = [
    { code: 'th', flag: '🇹🇭', label: 'TH' },
    { code: 'en', flag: '🇺🇸', label: 'EN' },
    { code: 'jp', flag: '🇯🇵', label: 'JP' },
]

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLanguageStore()

    return (
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-full p-1 border border-neutral-200 dark:border-neutral-700">
            {LANGUAGES.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLocale(lang.code)}
                    className="relative px-2.5 py-1.5 rounded-full text-xs font-bold transition-colors duration-200"
                    title={lang.label}
                >
                    {locale === lang.code && (
                        <motion.div
                            layoutId="activeLang"
                            className="absolute inset-0 bg-black dark:bg-white rounded-full"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                    )}
                    <span className={`relative z-10 flex items-center gap-1 ${locale === lang.code
                            ? 'text-white dark:text-black'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                        }`}>
                        <span className="text-sm">{lang.flag}</span>
                        <span className="hidden sm:inline">{lang.label}</span>
                    </span>
                </button>
            ))}
        </div>
    )
}
