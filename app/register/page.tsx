// app/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, ArrowRight } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function RegisterPage() {
  const router = useRouter()
  const { locale } = useLanguageStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const obj = Object.fromEntries(formData.entries())

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
      alert(`✅ ${t('register.success', locale)}`)
      router.push('/login')
    } else {
      const data = await res.json()
      setError(data.error || t('register.error', locale))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col items-center justify-center p-4 font-sans text-foreground">

      <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-[420px] bg-surface-card p-8 md:p-12 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 border border-border-main">

        <div className="flex justify-center mb-10">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/logo.svg"
              alt="iHAVEGPU Logo"
              width={180}
              height={60}
              className="h-12 w-auto object-contain "
              priority
            />
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold mb-2 text-foreground">{t('register.title', locale)}</h1>
          <p className="text-txt-muted text-sm">{t('register.subtitle', locale)}</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-xs text-center border border-red-100 dark:border-red-900 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-txt-muted uppercase tracking-wider ml-1">{t('register.displayName', locale)}</label>
            <input
              name="name"
              type="text"
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg bg-surface-bg border border-border-main focus:border-foreground focus:ring-0 outline-none transition-all text-sm font-medium placeholder:text-txt-muted text-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-txt-muted uppercase tracking-wider ml-1">{t('login.email', locale)}</label>
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-lg bg-surface-bg border border-border-main focus:border-foreground focus:ring-0 outline-none transition-all text-sm font-medium placeholder:text-txt-muted text-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-txt-muted uppercase tracking-wider ml-1">{t('login.password', locale)}</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-surface-bg border border-border-main focus:border-foreground focus:ring-0 outline-none transition-all text-sm font-medium placeholder:text-txt-muted text-foreground"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-foreground text-surface-card font-bold py-3.5 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>{t('register.submit', locale)} <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border-main flex flex-col gap-4 text-center">
          <p className="text-sm text-txt-muted">
            {t('register.hasAccount', locale)}{' '}
            <Link href="/login" className="text-foreground font-bold hover:underline">
              {t('register.login', locale)}
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-xs text-txt-muted">
        © 2026 iHAVEGPU Store. All rights reserved.
      </p>
    </div>
  )
}