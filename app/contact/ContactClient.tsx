'use client'

import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react'
import Link from 'next/link'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function ContactClient() {
    const { locale } = useLanguageStore()

    const subjects = [
        t('contact.subjectProduct', locale),
        t('contact.subjectTech', locale),
        t('contact.subjectOrder', locale),
        t('contact.subjectWarranty', locale),
        t('contact.subjectOther', locale),
    ]

    return (
        <div className="min-h-screen bg-background font-sans text-foreground pb-24">

            {/* ================= HEADER ================= */}
            <div className="bg-surface-card border-b border-border-main">
                <div className="max-w-6xl mx-auto px-6 pt-8 pb-16 md:pb-20 text-center">
                    <div className="flex items-center gap-2 text-sm text-txt-muted mb-8 justify-center md:justify-start">
                        <Link href="/" className="hover:text-foreground transition-colors">{t('contact.breadcrumbHome', locale)}</Link>
                        <span className="text-txt-muted text-xs font-bold">{'>'}</span>
                        <span className="text-foreground font-medium">{t('contact.title', locale)}</span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-bg rounded-full text-xs font-bold uppercase tracking-wider text-txt-secondary mb-6">
                        <MessageCircle size={16} /> {t('contact.getInTouch', locale)}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">
                        {t('contact.title', locale)}
                    </h1>
                    <p className="text-lg text-txt-muted max-w-2xl mx-auto leading-relaxed">
                        {t('contact.heroDesc', locale)}
                    </p>
                </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="max-w-6xl mx-auto px-6 mt-12 grid lg:grid-cols-3 gap-12">

                {/* LEFT: Contact Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-surface-card p-8 rounded-xl border border-border-main shadow-sm space-y-6">
                        <h3 className="text-xl font-bold border-b border-border-light pb-4">{t('contact.headOffice', locale)}</h3>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-surface-bg rounded-lg text-yellow-600"><MapPin size={24} /></div>
                            <div>
                                <h4 className="font-bold text-sm text-foreground">{t('contact.locationLabel', locale)}</h4>
                                <p className="text-sm text-txt-muted mt-1 leading-relaxed">
                                    123 Tech Tower, 15th Floor, <br />
                                    Sukhumvit Road, Bangkok 10110
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-surface-bg rounded-lg text-yellow-600"><Phone size={24} /></div>
                            <div>
                                <h4 className="font-bold text-sm text-foreground">{t('contact.phoneLabel', locale)}</h4>
                                <p className="text-sm text-txt-muted mt-1">02-123-4567 ({t('contact.office', locale)})</p>
                                <p className="text-sm text-txt-muted">089-999-9999 ({t('contact.hotline', locale)})</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-surface-bg rounded-lg text-yellow-600"><Mail size={24} /></div>
                            <div>
                                <h4 className="font-bold text-sm text-foreground">{t('contact.emailLabel', locale)}</h4>
                                <p className="text-sm text-txt-muted mt-1">support@ihavegpu.com</p>
                                <p className="text-sm text-txt-muted">sales@ihavegpu.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Business Hours */}
                    <div className="bg-neutral-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-yellow-500" size={24} />
                            <h3 className="text-lg font-bold">{t('contact.businessHours', locale)}</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-neutral-300">
                            <li className="flex justify-between">
                                <span>{t('contact.monFri', locale)}</span>
                                <span className="font-bold text-white">09:00 - 18:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>{t('contact.sat', locale)}</span>
                                <span className="font-bold text-white">10:00 - 17:00</span>
                            </li>
                            <li className="flex justify-between text-neutral-500">
                                <span>{t('contact.sun', locale)}</span>
                                <span>{t('contact.closed', locale)}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* RIGHT: Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-surface-card p-8 md:p-10 rounded-xl border border-border-main shadow-sm h-full">
                        <h3 className="text-2xl font-bold mb-2">{t('contact.formTitle', locale)}</h3>
                        <p className="text-txt-muted mb-8 text-sm">{t('contact.formSubtitle', locale)}</p>

                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-txt-secondary">{t('contact.name', locale)}</label>
                                    <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-lg border border-border-main focus:border-foreground focus:ring-0 outline-none transition-all bg-surface-bg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-txt-secondary">{t('contact.phone', locale)}</label>
                                    <input type="tel" placeholder="08x-xxx-xxxx" className="w-full px-4 py-3 rounded-lg border border-border-main focus:border-foreground focus:ring-0 outline-none transition-all bg-surface-bg" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-txt-secondary">{t('contact.email', locale)}</label>
                                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-lg border border-border-main focus:border-foreground focus:ring-0 outline-none transition-all bg-surface-bg" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-txt-secondary">{t('contact.subject', locale)}</label>
                                <select className="w-full px-4 py-3 rounded-lg border border-border-main focus:border-foreground focus:ring-0 outline-none transition-all bg-surface-bg">
                                    {subjects.map((s, i) => <option key={i}>{s}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-txt-secondary">{t('contact.message', locale)}</label>
                                <textarea rows={5} placeholder={t('contact.messagePlaceholder', locale)} className="w-full px-4 py-3 rounded-lg border border-border-main focus:border-foreground focus:ring-0 outline-none transition-all bg-surface-bg resize-none"></textarea>
                            </div>

                            <button type="button" className="w-full bg-foreground text-surface-card font-bold py-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                <Send size={18} /> {t('contact.send', locale)}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}
