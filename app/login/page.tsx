// app/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { Loader2, ArrowRight } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function LoginPage() {
    const router = useRouter()
    const { locale } = useLanguageStore()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ email: '', password: '' })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            })

            if (res?.error) {
                toast.error(t('login.errorInvalid', locale))
            } else {
                toast.success(t('login.success', locale))
                router.push('/')
                router.refresh()
            }
        } catch (error) {
            toast.error(t('login.error', locale))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-surface-bg flex flex-col items-center justify-center p-4 font-sans text-foreground">

            {/* Theme + Language Controls */}
            <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
                <ThemeToggle />
                <LanguageSwitcher />
            </div>

            {/* Card Container */}
            <div className="w-full max-w-[420px] bg-surface-card p-8 md:p-12 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 border border-border-main">

                <div className="flex justify-center mb-10">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <Image
                            src="/logo.svg"
                            alt="iHAVEGPU Logo"
                            width={180}
                            height={60}
                            className="h-12 w-auto object-contain dark:invert"
                            priority
                        />
                    </Link>
                </div>

                <div className="mb-8 text-center">
                    <h1 className="text-xl font-bold mb-2 text-foreground">{t('login.title', locale)}</h1>
                    <p className="text-txt-muted text-sm">{t('login.subtitle', locale)}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-txt-muted uppercase tracking-wider ml-1">{t('login.email', locale)}</label>
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 rounded-lg bg-surface-bg border border-border-main focus:border-foreground focus:ring-0 outline-none transition-all text-sm font-medium placeholder:text-txt-muted text-foreground"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-txt-muted uppercase tracking-wider">{t('login.password', locale)}</label>
                            <Link href="/forgot-password" className="text-xs text-txt-muted hover:text-foreground transition-colors font-bold">
                                {t('login.forgotPassword', locale)}
                            </Link>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg bg-surface-bg border border-border-main focus:border-foreground focus:ring-0 outline-none transition-all text-sm font-medium placeholder:text-txt-muted text-foreground"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-foreground text-surface-card font-bold py-3.5 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>{t('login.submit', locale)} <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-border-main flex flex-col gap-4 text-center">
                    <p className="text-sm text-txt-muted">
                        {t('login.noAccount', locale)}{' '}
                        <Link href="/register" className="text-foreground font-bold hover:underline">
                            {t('login.register', locale)}
                        </Link>
                    </p>
                    <Link href="/" className="text-xs text-txt-muted hover:text-foreground transition-colors font-medium">
                        {t('login.guest', locale)}
                    </Link>
                </div>
            </div>

            <p className="mt-8 text-xs text-txt-muted">
                © 2026 iHAVEGPU Store. {t('login.copyright', locale)}
            </p>
        </div>
    )
}