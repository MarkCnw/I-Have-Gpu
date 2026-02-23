// app/cart/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, CreditCard, MapPin, AlertCircle, FileText, Building2, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

interface CartItem {
  cartId: string
  id: string
  name: string
  price: number
  image: string
  quantity: number
  category: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const { locale } = useLanguageStore()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')

  const [needTaxInvoice, setNeedTaxInvoice] = useState(false)
  const [taxType, setTaxType] = useState<'personal' | 'corporate'>('personal')
  const [taxInfo, setTaxInfo] = useState({ taxId: '', taxName: '', taxAddress: '', branch: 'สำนักงานใหญ่' })

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to load cart', error)
      } finally {
        setLoading(false)
      }
    }
    loadCart()

    if (session?.user) {
      fetch('/api/user/addresses')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setAddresses(data)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const defaultAddr = data.find((a: any) => a.isDefault) || data[0]
            setSelectedAddressId(defaultAddr.id)
          }
        })
        .catch(err => console.error('Failed to load addresses', err))
    }
  }, [session])

  const updateLocalStorage = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const removeItem = (cartId: string) => {
    const newCart = cart.filter(item => item.cartId !== cartId)
    updateLocalStorage(newCart)
    toast.success(t('cart.removed', locale))
  }

  const updateQuantity = (cartId: string, delta: number) => {
    const newCart = cart.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    })
    updateLocalStorage(newCart)
  }

  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)
  const shipping = 0
  const total = subtotal + shipping

  const handleCheckout = async () => {
    if (!session) {
      toast.error(t('cart.loginRequired', locale))
      return router.push('/login')
    }
    if (addresses.length === 0) return toast.error(t('cart.needAddress', locale))

    if (needTaxInvoice) {
      if (!taxInfo.taxName) return toast.error(t('cart.taxName', locale))
      if (!/^\d{13}$/.test(taxInfo.taxId)) return toast.error(t('cart.taxId', locale))
      if (!taxInfo.taxAddress) return toast.error(t('cart.taxAddress', locale))
      if (taxType === 'corporate' && !taxInfo.branch) return toast.error(locale === 'th' ? 'กรุณาระบุสาขา' : 'Branch is required')
    }

    setIsCheckoutLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          totalPrice: total,
          addressId: selectedAddressId,
          taxInfo: needTaxInvoice ? { ...taxInfo, type: taxType } : null
        })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.removeItem('cart')
        window.dispatchEvent(new Event('cart-updated'))
        toast.success(`🎉 ${t('cart.orderSuccess', locale)}`)
        router.push('/orders')
      } else {
        toast.error(data.error || t('cart.orderError', locale))
      }
    } catch (error) {
      toast.error(t('cart.connectionError', locale))
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface-bg"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div></div>
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-surface-bg p-4">
        <div className="w-24 h-24 bg-surface-card rounded-full flex items-center justify-center mb-6 border border-border-main">
          <ShoppingBag size={48} className="text-txt-muted" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t('cart.empty', locale)}</h1>
        <p className="text-txt-muted mb-8">{t('cart.emptyDesc', locale)}</p>
        <Link href="/" className="px-8 py-3 bg-foreground text-surface-card rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl">
          {t('cart.goShopping', locale)}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-bg pb-24 font-sans">
      <div className="bg-surface-card border-b border-border-main sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-txt-muted">
              <Link href="/" className="hover:text-foreground transition-colors">{t('cart.home', locale)}</Link>
              <span className="text-border-main text-xs font-bold">{'>'}</span>
              <span className="text-foreground font-medium">{t('cart.title', locale)}</span>
            </div>

            <div className="h-6 w-[1px] bg-border-main hidden md:block"></div>

            <h1 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <ShoppingBag size={20} /> {t('cart.title', locale)} ({cart.length})
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Product List */}
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div key={item.cartId} className="bg-surface-card p-4 md:p-6 rounded-2xl border border-border-main flex gap-6 items-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-surface-bg rounded-xl flex-shrink-0 relative overflow-hidden border border-border-main">
                  <Image src={item.image || '/placeholder.png'} alt={item.name} fill className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="text-[10px] font-bold bg-surface-bg text-txt-muted px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block border border-border-main">
                        {item.category}
                      </span>
                      <h3 className="font-bold text-foreground text-lg truncate pr-4 leading-tight">{item.name}</h3>
                    </div>
                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="text-txt-muted hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-2">
                    <div className="text-xl font-bold text-foreground">฿{Number(item.price).toLocaleString()}</div>

                    <div className="flex items-center gap-3 bg-surface-bg rounded-lg p-1 border border-border-main">
                      <button
                        onClick={() => updateQuantity(item.cartId, -1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center bg-surface-card rounded-md shadow-sm hover:bg-surface-bg disabled:opacity-50 text-foreground"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold w-4 text-center text-sm text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartId, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-surface-card rounded-md shadow-sm hover:bg-surface-bg text-foreground"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="bg-surface-card p-8 rounded-2xl border border-border-main shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-foreground">{t('cart.orderSummary', locale)}</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-txt-muted">
                  <span>{t('cart.subtotal', locale)}</span>
                  <span>฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-txt-muted">
                  <span>{t('cart.shipping', locale)}</span>
                  <span className={shipping === 0 ? "text-green-600 font-bold" : ""}>
                    {shipping === 0 ? t('cart.free', locale) : `฿${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-txt-muted text-right">{t('cart.freeAbove', locale)}</p>
                )}
              </div>

              <div className="border-t border-dashed border-border-main pt-6 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg text-foreground">{t('cart.total', locale)}</span>
                  <span className="text-3xl font-bold text-foreground">฿{total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-txt-muted mt-2 text-right">{t('cart.taxIncluded', locale)}</p>
              </div>

              {/* Address */}
              <div className="mb-6">
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-txt-muted"><MapPin size={16} /> {t('cart.shippingAddress', locale)}</h4>
                {addresses.length > 0 ? (
                  <select
                    className="w-full p-3 text-sm border border-border-main rounded-lg bg-surface-bg outline-none focus:border-foreground transition cursor-pointer text-foreground"
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                  >
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {addresses.map((addr: any) => (
                      <option key={addr.id} value={addr.id}>{addr.name} ({addr.province})</option>
                    ))}
                  </select>
                ) : (
                  <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg flex items-start gap-2 border border-red-100 dark:border-red-900">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <Link href="/profile" className="underline font-bold hover:text-red-800 dark:hover:text-red-300">{t('cart.addAddress', locale)}</Link>
                  </div>
                )}
              </div>

              {/* Tax Invoice */}
              <div className="mb-8 pt-4 border-t border-border-main">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="tax"
                    className="w-4 h-4 accent-black dark:accent-white cursor-pointer"
                    checked={needTaxInvoice}
                    onChange={(e) => setNeedTaxInvoice(e.target.checked)}
                  />
                  <label htmlFor="tax" className="font-bold text-sm flex items-center gap-2 cursor-pointer select-none text-txt-muted">
                    <FileText size={16} /> {t('cart.taxInvoice', locale)}
                  </label>
                </div>

                {needTaxInvoice && (
                  <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-2">
                    
                    {/* Tabs เลือกประเภท */}
                    <div className="flex gap-2 p-1 bg-surface-bg border border-border-main rounded-lg">
                      <button
                        type="button"
                        onClick={() => setTaxType('personal')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${
                          taxType === 'personal'
                            ? 'bg-surface-card text-foreground shadow-sm'
                            : 'text-txt-muted hover:text-foreground'
                        }`}
                      >
                        <User size={14} /> {locale === 'th' ? 'บุคคลธรรมดา' : 'Personal'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaxType('corporate')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${
                          taxType === 'corporate'
                            ? 'bg-surface-card text-foreground shadow-sm'
                            : 'text-txt-muted hover:text-foreground'
                        }`}
                      >
                        <Building2 size={14} /> {locale === 'th' ? 'นิติบุคคล' : 'Corporate'}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input
                        placeholder={t('cart.taxName', locale)}
                        className="w-full p-3 text-sm border border-border-main rounded-lg outline-none focus:border-foreground bg-surface-bg text-foreground"
                        value={taxInfo.taxName}
                        onChange={(e) => setTaxInfo({ ...taxInfo, taxName: e.target.value })}
                      />
                      <input
                        placeholder={t('cart.taxId', locale)}
                        className="w-full p-3 text-sm border border-border-main rounded-lg outline-none focus:border-foreground bg-surface-bg text-foreground"
                        maxLength={13}
                        value={taxInfo.taxId}
                        onChange={(e) => setTaxInfo({ ...taxInfo, taxId: e.target.value.replace(/\D/g, '') })}
                      />
                      {taxType === 'corporate' && (
                        <input
                          placeholder={locale === 'th' ? 'สำนักงานใหญ่ / สาขา (เช่น 00000)' : 'Branch / HQ (e.g. 00000)'}
                          className="w-full p-3 text-sm border border-border-main rounded-lg outline-none focus:border-foreground bg-surface-bg text-foreground"
                          value={taxInfo.branch}
                          onChange={(e) => setTaxInfo({ ...taxInfo, branch: e.target.value })}
                        />
                      )}
                      <textarea
                        placeholder={t('cart.taxAddress', locale)}
                        className="w-full p-3 text-sm border border-border-main rounded-lg outline-none focus:border-foreground resize-none h-20 bg-surface-bg text-foreground"
                        value={taxInfo.taxAddress}
                        onChange={(e) => setTaxInfo({ ...taxInfo, taxAddress: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
                className="w-full bg-foreground text-surface-card py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isCheckoutLoading ? (
                  <>{t('cart.processing', locale)}</>
                ) : (
                  <>{t('cart.checkout', locale)} <ArrowRight size={20} /></>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-txt-muted text-xs">
                <CreditCard size={14} /> {t('cart.securePayment', locale)}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
} 