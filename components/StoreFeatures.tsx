// components/StoreFeatures.tsx
'use client'
import { ShieldCheck, Truck, Wrench, Headphones } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function StoreFeatures() {
  const { locale } = useLanguageStore()

  const FEATURES = [
    {
      icon: <ShieldCheck size={32} className="text-foreground" />,
      title: t('feat.warranty.title', locale),
      desc: t('feat.warranty.desc', locale),
    },
    {
      icon: <Truck size={32} className="text-foreground" />,
      title: t('feat.delivery.title', locale),
      desc: t('feat.delivery.desc', locale),
    },
    {
      icon: <Wrench size={32} className="text-foreground" />,
      title: t('feat.assembly.title', locale),
      desc: t('feat.assembly.desc', locale),
    },
    {
      icon: <Headphones size={32} className="text-foreground" />,
      title: t('feat.support.title', locale),
      desc: t('feat.support.desc', locale),
    },
  ]

  return (
    <div className="w-full px-6 mb-16">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface-card border border-border-main hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-surface-bg rounded-full flex items-center justify-center shadow-sm mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-txt-secondary">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}