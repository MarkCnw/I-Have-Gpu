// components/Footer.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function Footer() {
  const { locale } = useLanguageStore()

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-800 font-sans">
      <div className="max-w-[1400px] mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* 1. Brand Info */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo.svg"
                alt="iHAVEGPU Logo"
                width={160}
                height={40}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              {t('footer.desc', locale)}
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Facebook size={18} /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Instagram size={18} /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Twitter size={18} /></Link>
            </div>
          </div>

          {/* 2. Shop Categories */}
          <div>
            <h3 className="text-white font-bold mb-6">{t('footer.shop', locale)}</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/?category=GPU" className="hover:text-white transition">{t('footer.graphicsCards', locale)}</Link></li>
              <li><Link href="/?category=CPU" className="hover:text-white transition">{t('footer.processors', locale)}</Link></li>
              <li><Link href="/?category=MOTHERBOARD" className="hover:text-white transition">{t('footer.motherboards', locale)}</Link></li>
              <li><Link href="/?category=CASE" className="hover:text-white transition">{t('footer.casesCooling', locale)}</Link></li>
              <li><Link href="/?category=LAPTOP" className="hover:text-white transition">{t('footer.gamingLaptops', locale)}</Link></li>
            </ul>
          </div>

          {/* 3. Customer Support */}
          <div>
            <h3 className="text-white font-bold mb-6">{t('footer.support', locale)}</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/orders" className="hover:text-white transition">{t('footer.orderStatus', locale)}</Link></li>
              <li><Link href="/warranty" className="hover:text-white transition">{t('footer.warrantyReturns', locale)}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">{t('footer.shippingInfo', locale)}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">{t('footer.faq', locale)}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">{t('footer.contactUs', locale)}</Link></li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6">{t('footer.contact', locale)}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>123 Cyber Tower, Ratchada,<br />Bangkok 10400, Thailand</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} />
                <span>02-999-9999</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@ihavegpu.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>{t('footer.copyright', locale)}</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition">{t('footer.privacyPolicy', locale)}</Link>
            <Link href="#" className="hover:text-white transition">{t('footer.terms', locale)}</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}