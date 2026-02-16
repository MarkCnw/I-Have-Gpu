// app/builder/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useBuilderStore } from "@/app/store/useBuilderStore"
import { useCompatibility } from "@/hooks/useCompatibility"
import {
  Cpu, CircuitBoard, MemoryStick, Gamepad2, HardDrive,
  Zap, Box, Fan, Save, Trash2, AlertTriangle, ChevronRight,
  Plus, ShoppingCart, ArrowRight
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

const BUILD_CATEGORIES = [
  { id: 'CPU', name: 'ซีพียู (CPU)', icon: Cpu },
  { id: 'MOTHERBOARD', name: 'เมนบอร์ด (Mainboard)', icon: CircuitBoard },
  { id: 'RAM', name: 'หน่วยความจำ (RAM)', icon: MemoryStick },
  { id: 'GPU', name: 'การ์ดจอ (Graphic Card)', icon: Gamepad2 },
  { id: 'STORAGE', name: 'ที่เก็บข้อมูล (SSD/HDD)', icon: HardDrive },
  { id: 'PSU', name: 'พาวเวอร์ซัพพลาย (PSU)', icon: Zap },
  { id: 'CASE', name: 'เคส (Case)', icon: Box },
  { id: 'COOLER', name: 'ชุดระบายความร้อน (Cooling)', icon: Fan },
]

export default function BuilderPage() {
  const router = useRouter()
  const { locale } = useLanguageStore()
  const { selectedParts, selectPart, removePart, getTotalPrice } = useBuilderStore()
  const { checkCompatibility } = useCompatibility()
  const [products, setProducts] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeCategory) {
      setLoading(true)
      fetch(`/api/products?category=${activeCategory}`)
        .then(res => res.json())
        .then(data => setProducts(data))
        .finally(() => setLoading(false))
    }
  }, [activeCategory])

  const handleSaveBuild = async () => {
    const selected = Object.values(selectedParts).filter(p => p !== null)
    if (selected.length === 0) return toast.error(t('builder.emptyState', locale))

    const buildData = {
      name: "My Custom PC Build",
      totalPrice: getTotalPrice(),
      items: selected.map(p => p!.id)
    }

    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildData)
      })
      if (res.ok) toast.success(t('builder.saveSuccess', locale))
      else toast.error(t('builder.saveLoginRequired', locale))
    } catch (err) {
      toast.error(t('builder.saveLoginRequired', locale))
    }
  }

  const handleOrderNow = () => {
    const selected = Object.values(selectedParts).filter(p => p !== null)
    if (selected.length === 0) {
      return toast.error(t('builder.emptyState', locale))
    }

    try {
      const existingCartRaw = localStorage.getItem('cart')
      let cart = existingCartRaw ? JSON.parse(existingCartRaw) : []

      selected.forEach((part: any) => {
        cart.push({
          cartId: Math.random().toString(36).substr(2, 9),
          id: part.id,
          name: part.name,
          price: Number(part.price),
          image: part.image,
          quantity: 1,
          category: part.category
        })
      })

      localStorage.setItem('cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('cart-updated'))

      toast.success(t('builder.addedToCart', locale))
      router.push('/cart')
    } catch (err) {
      toast.error(t('builder.saveLoginRequired', locale))
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-32">

      {/* Breadcrumb Navigation */}
      <div className="border-b border-border-light bg-surface-card sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-txt-muted">
            <Link href="/" className="hover:text-foreground transition-colors">{t('builder.breadcrumbHome', locale)}</Link>
            <ChevronRight size={14} className="text-txt-muted" />
            <span className="text-foreground font-medium">{t('builder.breadcrumbTitle', locale)}</span>
          </div>

          <div className="flex items-center gap-3">


          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground mb-2">{t('builder.title', locale)}</h1>
            <p className="text-txt-muted text-sm">{t('builder.subtitle', locale)}</p>
          </div>

        </header>

        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Part List (Left) */}
          <div className="lg:col-span-8 space-y-3">
            {BUILD_CATEGORIES.map((cat) => {
              const selectedProduct = selectedParts[cat.id]
              return (
                <div
                  key={cat.id}
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 
                    ${selectedProduct ? 'bg-surface-card border-border-main shadow-sm' : 'bg-surface-bg/50 border-dashed border-border-main hover:border-foreground/40'}`}
                >
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-500
                        ${selectedProduct ? 'bg-surface-card border border-border-light p-1' : 'bg-surface-card text-txt-muted shadow-inner'}`}>
                        {selectedProduct?.image ? (
                          <Image
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            width={64}
                            height={64}
                            className="object-contain mix-blend-multiply dark:mix-blend-normal transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <cat.icon size={28} strokeWidth={1.5} />
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-txt-muted uppercase tracking-widest mb-1">{cat.name}</p>
                        {selectedProduct ? (
                          <div className="flex flex-col">
                            <p className="font-bold text-foreground line-clamp-1 max-w-[300px] md:max-w-md">{selectedProduct.name}</p>
                            <span className="text-xs text-txt-muted font-mono">฿{selectedProduct.price.toLocaleString()}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-txt-muted font-medium italic">{t('builder.clickToSelect', locale)} {cat.name}...</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {selectedProduct ? (
                        <button
                          onClick={() => removePart(cat.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-full text-txt-muted hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveCategory(cat.id)}
                          className="bg-surface-card border border-border-main text-foreground px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-foreground hover:text-surface-card transition-all shadow-sm flex items-center gap-2"
                        >
                          <Plus size={14} /> {t('builder.selectItem', locale)}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary (Right) */}
          <div className="lg:col-span-4">
            <div className="bg-surface-card rounded-[2.5rem] p-8 border border-border-light shadow-2xl sticky top-28">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                {t('builder.summary', locale)}
              </h3>

              <div className="space-y-4 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(selectedParts).map(([key, part]) => part && (
                  <div key={key} className="flex gap-4 items-center animate-in fade-in slide-in-from-right-2">
                    <div className="w-10 h-10 bg-surface-bg rounded-lg flex-shrink-0 relative overflow-hidden border border-border-light p-0.5">
                      {part.image && <Image src={part.image} alt="" fill className="object-contain mix-blend-multiply dark:mix-blend-normal" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-txt-muted uppercase">{key}</p>
                      <p className="text-xs text-txt-secondary line-clamp-1">{part.name}</p>
                    </div>
                    <span className="font-mono font-bold text-xs text-foreground">฿{part.price.toLocaleString()}</span>
                  </div>
                ))}
                {Object.values(selectedParts).every(p => p === null) && (
                  <div className="text-center py-10">
                    <p className="text-txt-muted text-sm italic">{t('builder.emptyState', locale)}</p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-border-light">
                <p className="text-xs font-bold text-txt-muted uppercase tracking-widest mb-1">{t('builder.total', locale)}</p>
                <span className="text-4xl font-black text-foreground tracking-tighter block mb-8">
                  ฿{getTotalPrice().toLocaleString()}
                </span>

                <button
                  onClick={handleOrderNow}
                  disabled={Object.values(selectedParts).every(p => p === null)}
                  className="w-full bg-foreground text-surface-card py-4 rounded-2xl font-bold hover:opacity-90 transition disabled:opacity-30 disabled:pointer-events-none shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  {t('builder.orderNow', locale)} <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Selection Modal */}
      {activeCategory && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-surface-card w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-border-light">
            <div className="p-8 border-b border-border-light flex justify-between items-center bg-surface-bg">
              <div>
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 uppercase">
                  {t('builder.modalTitle', locale)} {activeCategory}
                </h2>
                <p className="text-txt-muted text-sm">{t('builder.modalDesc', locale)}</p>
              </div>
              <button
                onClick={() => setActiveCategory(null)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-card border border-border-main text-txt-muted hover:text-foreground hover:rotate-90 transition-all duration-300 shadow-sm"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-skeleton rounded-3xl animate-pulse" />
                ))
              ) : products.map((p) => {
                const { compatible, reason } = checkCompatibility(p)
                return (
                  <div
                    key={p.id}
                    className={`group relative p-5 border-2 rounded-3xl transition-all duration-300 flex flex-col 
                      ${!compatible
                        ? 'bg-surface-bg/50 border-border-light opacity-60 grayscale'
                        : 'bg-surface-card border-border-light hover:border-foreground hover:shadow-xl'}`}
                  >
                    <div className="aspect-square bg-surface-bg rounded-2xl relative overflow-hidden mb-4 group-hover:scale-95 transition-transform duration-500 p-4">
                      {p.image && (
                        <Image src={p.image} alt={p.name} fill className="object-contain mix-blend-multiply dark:mix-blend-normal" />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col">
                      <h4 className="font-bold text-sm line-clamp-2 text-txt-secondary mb-2 leading-tight">{p.name}</h4>
                      <p className="text-xl font-black text-foreground mt-auto">฿{Number(p.price).toLocaleString()}</p>

                      {!compatible && (
                        <div className="mt-3 text-[10px] text-red-500 font-bold flex items-start gap-1.5 bg-red-50/80 p-2.5 rounded-xl border border-red-100">
                          <AlertTriangle size={14} className="flex-shrink-0" />
                          <span>{reason}</span>
                        </div>
                      )}

                      {compatible && (
                        <button
                          onClick={() => { selectPart(activeCategory, p); setActiveCategory(null) }}
                          className="mt-4 w-full bg-foreground text-surface-card py-3 rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-md"
                        >
                          {t('builder.selectThis', locale)}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}