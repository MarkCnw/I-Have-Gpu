'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
    Award, Users, Wrench, Zap, CheckCircle2, ArrowRight
} from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function AboutClient() {
    const { locale } = useLanguageStore()

    const stats = [
        { label: t('about.statBuilds', locale), value: '5,000+' },
        { label: t('about.statClients', locale), value: '98%' },
        { label: t('about.statWarranty', locale), value: t('about.statWarrantyValue', locale) },
        { label: t('about.statSupport', locale), value: '24/7' },
    ]

    const steps = [
        { icon: Users, title: t('about.step1Title', locale), desc: t('about.step1Desc', locale) },
        { icon: Wrench, title: t('about.step2Title', locale), desc: t('about.step2Desc', locale) },
        { icon: Zap, title: t('about.step3Title', locale), desc: t('about.step3Desc', locale) },
        { icon: CheckCircle2, title: t('about.step4Title', locale), desc: t('about.step4Desc', locale) },
    ]

    const whyChooseItems = [
        { title: t('about.why1Title', locale), desc: t('about.why1Desc', locale) },
        { title: t('about.why2Title', locale), desc: t('about.why2Desc', locale) },
        { title: t('about.why3Title', locale), desc: t('about.why3Desc', locale) },
        { title: t('about.why4Title', locale), desc: t('about.why4Desc', locale) },
    ]

    return (
        <div className="min-h-screen bg-background font-sans text-foreground pb-24 selection:bg-yellow-500 selection:text-white">

            {/* ================= HERO SECTION ================= */}
            <div className="relative bg-surface-card border-b border-border-main overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-neutral-50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 pt-8 pb-24 md:pb-32 relative z-10">
                    <div className="flex items-center gap-2 text-sm text-txt-muted mb-12 justify-start">
                        <Link href="/" className="hover:text-foreground transition-colors">{t('about.breadcrumbHome', locale)}</Link>
                        <span className="text-txt-muted text-xs font-bold">{'>'}</span>
                        <span className="text-foreground font-medium">{t('about.title', locale)}</span>
                    </div>

                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-8 shadow-lg shadow-neutral-200">
                            <Award size={14} className="text-yellow-500" /> {t('about.since', locale)}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-foreground leading-[1.1]">
                            {t('about.heroTitle1', locale)} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900">
                                {t('about.heroTitle2', locale)}
                            </span>
                        </h1>
                        <p className="text-lg md:text-2xl text-txt-muted max-w-3xl mx-auto leading-relaxed font-light mb-12">
                            {t('about.heroDesc', locale)}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-border-light pt-12">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                                    <div className="text-xs font-bold text-txt-muted uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= OUR STORY ================= */}
            <div className="max-w-7xl mx-auto px-6 mt-24">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative z-10">
                            <Image
                                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2574&auto=format&fit=crop"
                                alt="Our Workshop"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-neutral-100 rounded-full -z-10"></div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            {t('about.storyTitle1', locale)} <br />
                            <span className="text-txt-muted">{t('about.storyTitle2', locale)}</span>
                        </h2>
                        <div className="space-y-6 text-txt-secondary text-lg font-light leading-relaxed">
                            <p>{t('about.storyP1', locale)}</p>
                            <p>{t('about.storyP2', locale)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= OUR PROCESS ================= */}
            <div className="bg-surface-bg py-24 mt-24 border-y border-border-main">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">{t('about.processTitle', locale)}</h2>
                        <p className="text-txt-muted max-w-2xl mx-auto">{t('about.processSubtitle', locale)}</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="bg-surface-card p-8 rounded-xl border border-border-main shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 bg-neutral-900 text-white rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-neutral-900/20">
                                    <step.icon size={24} />
                                </div>
                                <h3 className="font-bold text-lg mb-3">{step.title}</h3>
                                <p className="text-sm text-txt-muted leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= WHY CHOOSE US ================= */}
            <div className="max-w-7xl mx-auto px-6 mt-24 mb-24">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                        <h2 className="text-3xl font-bold mb-6">{t('about.whyTitle', locale)}</h2>
                        <p className="text-txt-muted leading-relaxed mb-8">
                            {t('about.whyDesc', locale)}
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-2 font-bold text-foreground border-b-2 border-foreground pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-colors">
                            {t('about.contactExperts', locale)} <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                        {whyChooseItems.map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                                    <CheckCircle2 size={14} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                                    <p className="text-sm text-txt-muted leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
