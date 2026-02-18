'use client'

import {
    ShieldCheck, RotateCcw, CheckCircle2, XCircle,
    Cpu, CircuitBoard, Gamepad2, MemoryStick, HardDrive, Zap,
    Monitor, Mouse, Keyboard, Headphones, Box, Fan, Star
} from 'lucide-react'
import Link from 'next/link'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function WarrantyClient() {
    const { locale } = useLanguageStore()

    const warrantyPeriods = [
        { category: t('warranty.cpu', locale), period: t('warranty.period10y', locale), icon: Cpu },
        { category: t('warranty.mobo', locale), period: t('warranty.period10y', locale), icon: CircuitBoard },
        { category: t('warranty.gpu', locale), period: t('warranty.period10y', locale), icon: Gamepad2 },
        { category: t('warranty.ram', locale), period: t('warranty.period10y', locale), icon: MemoryStick },
        { category: t('warranty.storage', locale), period: t('warranty.period10y', locale), icon: HardDrive },
        { category: t('warranty.psu', locale), period: t('warranty.period10y', locale), icon: Zap },
        { category: t('warranty.case', locale), period: t('warranty.period10y', locale), icon: Box },
        { category: t('warranty.cooling', locale), period: t('warranty.period10y', locale), icon: Fan },
        { category: t('warranty.monitor', locale), period: t('warranty.period10y', locale), icon: Monitor },
        { category: t('warranty.mouse', locale), period: t('warranty.period10y', locale), icon: Mouse },
        { category: t('warranty.keyboard', locale), period: t('warranty.period10y', locale), icon: Keyboard },
        { category: t('warranty.headphones', locale), period: t('warranty.period10y', locale), icon: Headphones },
    ]

    const coveredList = [
        t('warranty.covered1', locale),
        t('warranty.covered2', locale),
        t('warranty.covered3', locale),
        t('warranty.covered4', locale),
    ]

    const notCoveredList = [
        t('warranty.notCovered1', locale),
        t('warranty.notCovered2', locale),
        t('warranty.notCovered3', locale),
        t('warranty.notCovered4', locale),
    ]

    const claimSteps = [
        { id: '01', title: t('warranty.claimStep1Title', locale), desc: t('warranty.claimStep1Desc', locale) },
        { id: '02', title: t('warranty.claimStep2Title', locale), desc: t('warranty.claimStep2Desc', locale) },
        { id: '03', title: t('warranty.claimStep3Title', locale), desc: t('warranty.claimStep3Desc', locale) },
    ]

    return (
        <div className="min-h-screen bg-background font-sans text-foreground pb-24">

            {/* ================= HEADER SECTION ================= */}
            <div className="bg-surface-card border-b border-border-main">
                <div className="max-w-6xl mx-auto px-6 pt-8 pb-16 md:pb-24 text-center">
                    <div className="flex items-center gap-2 text-sm text-txt-muted mb-8 justify-center md:justify-start">
                        <Link href="/" className="hover:text-foreground transition-colors">{t('warranty.breadcrumbHome', locale)}</Link>
                        <span className="text-txt-muted text-xs font-bold">{'>'}</span>
                        <span className="text-foreground font-medium">{t('warranty.title', locale)}</span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-bg rounded-full text-xs font-bold uppercase tracking-wider text-txt-secondary mb-6">
                        <ShieldCheck size={16} /> {t('warranty.officialPolicy', locale)}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">
                        {t('warranty.heroTitle', locale)}
                    </h1>
                    <p className="text-lg text-txt-muted max-w-2xl mx-auto leading-relaxed">
                        {t('warranty.heroDesc', locale)}
                    </p>
                </div>
            </div>

            {/* ================= CONTENT CONTAINER ================= */}
            <div className="max-w-5xl mx-auto px-6 mt-12 space-y-20">

                {/* 1. 30-Day DOA Banner */}
                <section className="bg-neutral-900 text-white rounded-2xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex-shrink-0 bg-white/10 p-5 rounded-xl border border-white/10">
                        <RotateCcw size={32} className="text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left z-10">
                        <h2 className="text-xl md:text-2xl font-bold mb-2">{t('warranty.doaTitle', locale)}</h2>
                        <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed">
                            {t('warranty.doaDesc', locale)}
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <span className="inline-block px-6 py-3 border border-white/20 rounded-lg text-sm font-medium cursor-default">
                            {t('warranty.doaBadge', locale)}
                        </span>
                    </div>
                </section>

                {/* 2. Warranty Coverage Grid */}
                <section>
                    <div className="flex items-end justify-between mb-8 border-b border-border-main pb-4">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Star className="text-yellow-500 fill-yellow-500" size={20} />
                                {t('warranty.coverageTitle', locale)}
                            </h2>
                            <p className="text-sm text-txt-muted mt-1">{t('warranty.coverageSubtitle', locale)}</p>
                        </div>
                        <span className="hidden md:block text-xs font-bold bg-black text-white px-3 py-1 rounded-full">
                            {t('warranty.premiumCare', locale)}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {warrantyPeriods.map((item, index) => (
                            <div key={index} className="bg-surface-card border border-border-main p-6 rounded-xl hover:shadow-md transition-shadow group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2.5 bg-surface-bg rounded-lg text-txt-secondary group-hover:bg-foreground group-hover:text-surface-card transition-colors">
                                        <item.icon size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-sm font-bold text-foreground bg-surface-bg px-3 py-1 rounded-md">
                                        {item.period}
                                    </span>
                                </div>
                                <h3 className="text-base font-semibold text-txt-secondary">{item.category}</h3>
                                <p className="text-xs text-txt-muted mt-1">{t('warranty.fullCoverage', locale)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Warranty Conditions */}
                <section className="grid md:grid-cols-2 gap-8">
                    <div className="bg-surface-card p-8 rounded-2xl border border-border-main shadow-sm">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-green-700">
                            <CheckCircle2 size={20} /> {t('warranty.coveredTitle', locale)}
                        </h3>
                        <ul className="space-y-4">
                            {coveredList.map((text, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-txt-secondary">
                                    <div className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                                    <span className="leading-relaxed">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-surface-card p-8 rounded-2xl border border-border-main shadow-sm">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-red-600">
                            <XCircle size={20} /> {t('warranty.notCoveredTitle', locale)}
                        </h3>
                        <ul className="space-y-4">
                            {notCoveredList.map((text, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-txt-secondary">
                                    <div className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
                                    <span className="leading-relaxed">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* 4. Claim Process */}
                <section>
                    <h2 className="text-2xl font-bold mb-10 text-center">{t('warranty.claimTitle', locale)}</h2>
                    <div className="relative">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-border-main -z-10 -translate-y-1/2"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {claimSteps.map((step, i) => (
                                <div key={i} className="bg-surface-card border border-border-main p-6 rounded-xl flex flex-col items-center text-center shadow-sm">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm mb-4 ring-4 ring-white">
                                        {step.id}
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                                    <p className="text-sm text-txt-muted">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="text-center text-xs text-txt-muted pb-8">
                    <p>{t('warranty.copyright', locale)}</p>
                </div>
            </div>
        </div>
    )
}
