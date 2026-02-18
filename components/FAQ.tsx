// components/FAQ.tsx
'use client'
import { useState } from 'react'
import {
  ChevronDown, HelpCircle, ShieldCheck,
  Truck, Wrench, CreditCard, MessageCircle,
  Sparkles
} from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'
import { ReactNode } from 'react'

interface FAQItem {
  questionKey: string
  answerKey: string
  icon: ReactNode
}

const FAQ_ITEMS: FAQItem[] = [
  { questionKey: 'faq.q1', answerKey: 'faq.a1', icon: <ShieldCheck size={20} className="text-emerald-500" /> },
  { questionKey: 'faq.q2', answerKey: 'faq.a2', icon: <Wrench size={20} className="text-blue-500" /> },
  { questionKey: 'faq.q3', answerKey: 'faq.a3', icon: <Truck size={20} className="text-orange-500" /> },
  { questionKey: 'faq.q4', answerKey: 'faq.a4', icon: <CreditCard size={20} className="text-purple-500" /> },
  { questionKey: 'faq.q5', answerKey: 'faq.a5', icon: <Sparkles size={20} className="text-yellow-500" /> },
  { questionKey: 'faq.q6', answerKey: 'faq.a6', icon: <HelpCircle size={20} className="text-red-500" /> },
  { questionKey: 'faq.q7', answerKey: 'faq.a7', icon: <ShieldCheck size={20} className="text-indigo-500" /> },
  { questionKey: 'faq.q8', answerKey: 'faq.a8', icon: <Wrench size={20} className="text-sky-500" /> },
  { questionKey: 'faq.q9', answerKey: 'faq.a9', icon: <HelpCircle size={20} className="text-neutral-500" /> },
  { questionKey: 'faq.q10', answerKey: 'faq.a10', icon: <MessageCircle size={20} className="text-pink-500" /> },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { locale } = useLanguageStore()

  return (
    <section className="mt-32 pt-24 border-t border-border-main">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">

          {/* Left Side: Static Header Section */}
          <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-border-main text-txt-muted text-[10px] font-bold uppercase tracking-widest mb-6">
              <HelpCircle size={14} /> {t('faq.helpCenter', locale)}
            </div>
            <h2 className="text-5xl font-black text-foreground leading-[1.1] mb-6 tracking-tighter">
              {t('faq.title', locale)}<br />
              <span className="text-txt-muted">{t('faq.subtitle', locale)}</span>
            </h2>
            <p className="text-txt-secondary leading-relaxed mb-10 max-w-sm">
              {t('faq.description', locale)}
            </p>

            <div className="p-8 rounded-[2rem] bg-neutral-950 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-bold mb-2">{t('faq.notFound', locale)}</h4>
                <p className="text-xs text-neutral-400 mb-6">{t('faq.notFoundDesc', locale)}</p>
                <button className="px-6 py-3 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors">
                  {t('faq.contactStaff', locale)}
                </button>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
            </div>
          </div>

          {/* Right Side: Accordion Section */}
          <div className="lg:w-2/3 space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className={`group rounded-[2.5rem] transition-all duration-500 border ${openIndex === idx
                    ? 'bg-surface-card border-border-main shadow-2xl shadow-neutral-200/50 dark:shadow-black/30 scale-[1.02]'
                    : 'bg-transparent border-transparent hover:bg-surface-card-hover'
                  }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full p-8 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${openIndex === idx ? 'bg-foreground text-surface-card rotate-12' : 'bg-surface-card shadow-sm text-txt-muted border border-border-main'
                      }`}>
                      {item.icon}
                    </div>
                    <span className={`text-lg font-bold transition-colors duration-500 ${openIndex === idx ? 'text-foreground' : 'text-txt-secondary group-hover:text-foreground'
                      }`}>
                      {t(item.questionKey, locale)}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 ${openIndex === idx ? 'bg-foreground border-foreground text-surface-card rotate-180' : 'bg-transparent border-border-main text-txt-muted'
                    }`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                  <div className="px-8 pb-8 ml-[72px]">
                    <div className="h-[2px] w-12 bg-border-main mb-6 rounded-full" />
                    <p className="text-txt-secondary leading-relaxed text-base max-w-2xl">
                      {t(item.answerKey, locale)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}