// app/order-success/page.tsx
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle, Copy, FileText, Printer,
  Home, ShoppingBag, MapPin, CreditCard,
  ChevronRight, Receipt, Truck
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('id')
  const { locale } = useLanguageStore()

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setOrder(data)
      })
      .catch((err) => {
        console.error(err)
        toast.error(t('orderSuccess.notFound', locale))
      })
      .finally(() => setLoading(false))
  }, [orderId, router])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t('orderSuccess.copiedId', locale))
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-card">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-foreground mb-4"></div>
      <p className="text-txt-muted font-medium">{t('orderSuccess.loading', locale)}</p>
    </div>
  )

  if (!order) return null

  return (
    <div className="min-h-screen bg-background pb-24 font-sans text-foreground print:bg-white print:pb-0 print:text-black">

      {/* CSS สำหรับการพิมพ์โดยเฉพาะเพื่อบีบหน้ากระดาษ */}
      <style jsx global>{`
        @media print {
          @page { margin: 10mm; }
          body { background: white; }
          .custom-scrollbar { overflow: visible !important; }
        }
      `}</style>

      {/* Header (Hide when printing) */}
      <div className="border-b border-border-light bg-surface-card sticky top-0 z-30 shadow-sm print:hidden">
        <div className="max-w-[1000px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-txt-muted">
            <Link href="/" className="hover:text-foreground transition-colors">{t('orderSuccess.home', locale)}</Link>
            <ChevronRight size={14} className="text-txt-muted" />
            <Link href="/orders" className="hover:text-foreground transition-colors">{t('orderSuccess.orders', locale)}</Link>
            <ChevronRight size={14} className="text-txt-muted" />
            <span className="text-foreground font-medium">{t('orderSuccess.detail', locale)}</span>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-sm font-bold text-txt-secondary hover:text-foreground transition-colors"
          >
            <Printer size={18} /> {t('orderSuccess.print', locale)}
          </button>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-12 print:py-0 print:px-0">

        {/* Success Banner (Hide when printing) */}
        <div className="text-center mb-12 print:hidden">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-6">
            <CheckCircle size={48} className="text-emerald-500" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-3">{t('orderSuccess.thankyou', locale)}</h1>
          <p className="text-txt-muted">{t('orderSuccess.subtitle', locale)}</p>
        </div>

        {/* ✅ Main Receipt Card (Compact for Print) */}
        <div className="bg-surface-card rounded-[2.5rem] border border-border-light shadow-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none">

          {/* Receipt Header (Reduced padding in print) */}
          <div className="bg-neutral-900 text-white p-10 print:p-6 flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-6 print:mb-2">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center print:w-8 print:h-8">
                  <Image src="/logo.svg" alt="iHAVEGPU" width={24} height={24} className="object-contain" />
                </div>
                <span className="text-xl font-black tracking-tighter print:text-lg">iHAVEGPU STORE</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest print:text-[10px]">{t('orderSuccess.orderNumber', locale)}</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-mono font-bold print:text-xl">#{order.id.split('-')[0].toUpperCase()}</h2>
                  <button onClick={() => copyToClipboard(order.id)} className="text-neutral-500 hover:text-white transition print:hidden">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="md:text-right flex flex-col justify-end">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1 print:text-[10px]">{t('orderSuccess.orderDate', locale)}</p>
              <p className="text-lg font-bold print:text-sm">
                {new Date(order.createdAt).toLocaleDateString('th-TH', {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="p-10 space-y-10 print:p-6 print:space-y-6">

            {/* 📦 Items List (Condensed) */}
            <div>
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2 print:mb-3 print:text-xs">
                <ShoppingBag size={16} /> {t('orderSuccess.items', locale)}
              </h3>
              <div className="space-y-6 print:space-y-2">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-6 items-center print:gap-3">
                    <div className="w-14 h-14 bg-surface-bg rounded-2xl flex-shrink-0 relative overflow-hidden border border-border-light p-2 print:w-10 print:h-10 print:rounded-lg">
                      {item.product.image && <Image src={item.product.image} alt="" fill className="object-contain mix-blend-multiply dark:mix-blend-normal" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground line-clamp-1 print:text-xs">{item.product.name}</p>
                      <p className="text-xs text-txt-muted print:text-[10px]">
                        {t('orderSuccess.qty', locale)} {item.quantity} • ฿{Number(item.price).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-foreground print:text-xs">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 📍 Info Sections (Print-optimized grid) */}
            <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-border-light print:pt-4 print:gap-4 print:grid-cols-2">
              {/* Shipping Info */}
              <div className="space-y-3 print:space-y-1">
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} /> {t('orderSuccess.shipping', locale)}
                </h4>
                <div className="text-sm leading-relaxed print:text-xs">
                  <p className="font-bold text-foreground">{order.shippingName}</p>
                  <p className="text-txt-muted print:text-black">{order.shippingAddress} {order.shippingZipcode}</p>
                  <p className="font-medium text-foreground">📞 {order.shippingPhone}</p>
                </div>
              </div>

              {/* Tax & Logistics */}
              <div className="space-y-6 print:space-y-2">
                {order.taxId && (
                  <div className="space-y-2 print:space-y-0">
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                      <Receipt size={14} /> {t('orderSuccess.taxInvoice', locale)}
                    </h4>
                    <div className="text-xs bg-surface-bg p-4 rounded-2xl border border-border-light print:p-2 print:bg-transparent print:border-none">
                      <p className="font-bold">{order.taxName}</p>
                      <p>{t('orderSuccess.taxId', locale)} {order.taxId}</p>
                    </div>
                  </div>
                )}

                {order.trackingNumber && (
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{t('orderSuccess.logistics', locale)}</h4>
                    <p className="text-xs font-bold">{order.carrier}: {order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 💰 Totals Summary (Compact) */}
            <div className="bg-surface-bg rounded-3xl p-8 space-y-2 print:p-4 print:rounded-xl print:bg-neutral-50">
              <div className="flex justify-between text-sm print:text-xs">
                <span className="text-txt-muted font-bold uppercase">{t('orderSuccess.subtotal', locale)}</span>
                <span className="font-mono font-bold">฿{Number(order.total).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm print:text-xs">
                <span className="text-txt-muted font-bold uppercase">{t('orderSuccess.shippingCost', locale)}</span>
                <span className="font-bold text-emerald-600">{t('orderSuccess.free', locale)}</span>
              </div>
              <div className="pt-4 border-t border-border-main mt-2 flex justify-between items-center print:pt-2">
                <h4 className="text-xs font-bold text-txt-muted uppercase print:text-[10px]">{t('orderSuccess.grandTotal', locale)}</h4>
                <span className="text-4xl font-black text-foreground tracking-tighter print:text-2xl">
                  ฿{Number(order.total).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Receipt (Small text) */}
          <div className="p-8 border-t border-dashed border-border-light text-center print:p-4">
            <p className="text-[10px] text-neutral-300 font-medium italic print:text-neutral-500">
              {t('orderSuccess.footer', locale)}
            </p>
          </div>
        </div>

        {/* Action Buttons (Hide when printing) */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
          <Link href="/" className="px-8 py-4 bg-foreground text-surface-card rounded-2xl font-bold hover:opacity-90 transition shadow-xl flex items-center justify-center gap-2">
            <Home size={20} /> {t('orderSuccess.backHome', locale)}
          </Link>
          <Link href="/orders" className="px-8 py-4 bg-surface-card border border-border-main text-foreground rounded-2xl font-bold hover:bg-surface-bg transition flex items-center justify-center gap-2">
            <ShoppingBag size={20} /> {t('orderSuccess.viewAll', locale)}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-foreground"></div></div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}