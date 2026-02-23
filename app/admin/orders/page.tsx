// app/admin/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Eye, Check, X, Truck, ExternalLink, MapPin, Phone, Package } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ConfirmModal from '@/components/ConfirmModal'
import InputModal from '@/components/InputModal'
import Image from 'next/image'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

const TableRowSkeleton = () => (
  <tr className="border-b border-border-light">
    <td className="p-4"><div className="h-5 w-20 bg-skeleton rounded animate-pulse" /></td>
    <td className="p-4">
      <div className="h-4 w-32 bg-skeleton rounded animate-pulse mb-2" />
      <div className="h-3 w-24 bg-skeleton-light rounded animate-pulse" />
    </td>
    <td className="p-4 text-right"><div className="h-8 w-40 bg-skeleton rounded-lg animate-pulse ml-auto" /></td>
  </tr>
)

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const { locale } = useLanguageStore()

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmData, setConfirmData] = useState<{ id: string; status: string } | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [isCarrierModalOpen, setIsCarrierModalOpen] = useState(false)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const STATUS_LABEL: Record<string, string> = {
    ALL: t('status.all', locale),
    PENDING: t('status.pending', locale),
    VERIFYING: t('status.verifying', locale),
    PAID: t('status.paid', locale),
    SHIPPED: t('status.shipped', locale),
    CANCELLED: t('status.cancelled', locale),
    COMPLETED: t('status.completed', locale),
    PAYMENT_FAILED: t('status.paymentFailed', locale),
  }

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const openStatusConfirm = (id: string, status: string) => {
    setConfirmData({ id, status }); setIsConfirmOpen(true)
  }

  const openRejectModal = (id: string) => {
    setRejectOrderId(id); setIsRejectModalOpen(true)
  }

  const handleRejectSubmit = async (reason: string) => {
    if (!rejectOrderId) return
    setConfirmLoading(true)
    try {
      await fetch(`/api/orders/${rejectOrderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAYMENT_FAILED', rejectionReason: reason })
      })
      toast.success(t('admin.success', locale))
      await fetchOrders()
    } catch (error) {
      toast.error(t('admin.error', locale))
    } finally {
      setConfirmLoading(false); setIsRejectModalOpen(false)
    }
  }

  const confirmStatusChange = async () => {
    if (!confirmData) return
    setConfirmLoading(true)
    try {
      await fetch(`/api/orders/${confirmData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: confirmData.status })
      })
      toast.success(t('admin.success', locale))
      await fetchOrders()
    } catch (error) {
      toast.error(t('admin.error', locale))
    } finally {
      setConfirmLoading(false); setIsConfirmOpen(false)
    }
  }

  const openTrackingModal = (id: string) => {
    setTrackingOrderId(id); setTrackingNumber(''); setIsTrackingModalOpen(true)
  }

  const handleTrackingSubmit = (value: string) => {
    setTrackingNumber(value); setIsTrackingModalOpen(false); setIsCarrierModalOpen(true)
  }

  const handleCarrierSubmit = async (carrier: string) => {
    if (!trackingOrderId || !trackingNumber) return
    setTrackingLoading(true)
    try {
      await fetch(`/api/orders/${trackingOrderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: trackingOrderId,
          status: 'SHIPPED',
          trackingNumber: trackingNumber,
          carrier: carrier || 'Kerry Express'
        })
      })
      toast.success(t('admin.success', locale))
      await fetchOrders()
    } catch (error) {
      toast.error(t('admin.error', locale))
    } finally {
      setTrackingLoading(false); setIsCarrierModalOpen(false)
    }
  }

  const safeOrders = Array.isArray(orders) ? orders : []
  const filteredOrders = filter === 'ALL' ? safeOrders : safeOrders.filter((o: any) => o.status === filter)

  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-transparent transition-colors">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-foreground">{t('admin.manageOrders', locale)}</h1>

        {/* Filter Tabs */}
        <div className="flex bg-white dark:bg-surface-card p-1 rounded-lg border border-slate-200 dark:border-border-main">
          {['ALL', 'VERIFYING', 'PAID', 'SHIPPED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${filter === f
                  ? 'bg-black text-white dark:bg-foreground dark:text-surface-card'
                  : 'text-slate-500 dark:text-txt-muted hover:bg-slate-50 dark:hover:bg-surface-bg'
                }`}
            >
              {STATUS_LABEL[f]}
              {f === 'VERIFYING' && safeOrders.filter((o: any) => o.status === 'VERIFYING').length > 0 && (
                <span className="ml-1 text-red-400">●</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-surface-card rounded-xl border border-slate-200 dark:border-border-main shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-surface-bg text-slate-500 dark:text-txt-muted font-bold border-b border-slate-200 dark:border-border-main">
              <tr>
                <th className="p-4">{t('admin.orderId', locale)}</th>
                <th className="p-4">{t('admin.customer', locale)}</th>
                <th className="p-4">{t('admin.total', locale)}</th>
                <th className="p-4">{t('admin.status', locale)}</th>
                <th className="p-4">{t('admin.proof', locale)}</th>
                <th className="p-4">{t('admin.tracking', locale)}</th>
                <th className="p-4 text-right">{t('admin.manage', locale)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-main">
              {isLoading ? (
                [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400 dark:text-txt-muted">{t('admin.noOrders', locale)}</td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-surface-bg transition-colors">
                    <td className="p-4 font-mono text-slate-600 dark:text-foreground">{order.id.split('-')[0]}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800 dark:text-foreground">{order.shippingName}</p>
                      <p className="text-xs text-slate-400 dark:text-txt-muted">{new Date(order.createdAt).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US')}</p>
                    </td>
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">฿{Number(order.total).toLocaleString()}</td>
                    <td className="p-4">
                      {/* ✅ ปรับแก้สถานะ: เอาสีพื้นหลังออก เพิ่มสัญลักษณ์จุดสีแทนเพื่อความมินิมอลและอ่านง่าย */}
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold
                        ${order.status === 'VERIFYING' ? 'text-amber-600 dark:text-amber-400' :
                          order.status === 'PAID' ? 'text-indigo-600 dark:text-indigo-400' :
                            order.status === 'SHIPPED' ? 'text-emerald-600 dark:text-emerald-400' :
                              'text-slate-500 dark:text-txt-muted'}`}
                      >
                        <span className="text-[10px]">●</span>
                        {STATUS_LABEL[order.status] || order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {order.slipImage ? (
                        <a href={order.slipImage} target="_blank" className="text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline text-xs">
                          <ExternalLink size={12} /> {t('admin.viewSlip', locale)}
                        </a>
                      ) : <span className="text-slate-300 dark:text-txt-muted">-</span>}
                    </td>
                    <td className="p-4">
                      {order.trackingNumber ? (
                        <div className="text-xs">
                          <span className="font-bold text-slate-700 dark:text-foreground">{order.carrier}</span><br />
                          <span className="font-mono text-slate-500 dark:text-txt-muted">{order.trackingNumber}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="bg-slate-100 dark:bg-surface-bg text-slate-600 dark:text-txt-muted px-3 py-1.5 rounded flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-border-main text-xs font-bold transition">
                          <Eye size={14} /> {t('admin.details', locale)}
                        </button>
                        {order.status === 'VERIFYING' && (
                          <>
                            <button onClick={() => openStatusConfirm(order.id, 'PAID')} className="bg-green-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-green-700 text-xs font-bold">
                              <Check size={14} /> {t('admin.confirm', locale)}
                            </button>
                            <button onClick={() => openRejectModal(order.id)} className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-red-100 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs font-bold">
                              <X size={14} /> {t('admin.reject', locale)}
                            </button>
                          </>
                        )}
                        {order.status === 'PAID' && (
                          <button onClick={() => openTrackingModal(order.id)} className="bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded flex items-center gap-1 hover:opacity-80 text-xs font-bold">
                            <Truck size={14} /> {t('admin.ship', locale)}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <InputModal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} onConfirm={handleRejectSubmit} title={t('admin.rejectTitle', locale)} placeholder={t('admin.rejectPlaceholder', locale)} loading={confirmLoading} />
      <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={confirmStatusChange} title={t('admin.confirmStatusTitle', locale)} message={t('admin.confirmStatusMsg', locale)} loading={confirmLoading} />
      <InputModal isOpen={isTrackingModalOpen} onClose={() => setIsTrackingModalOpen(false)} onConfirm={handleTrackingSubmit} title={t('admin.trackingTitle', locale)} placeholder={t('admin.placeholderTracking', locale)} />
      <InputModal isOpen={isCarrierModalOpen} onClose={() => setIsCarrierModalOpen(false)} onConfirm={handleCarrierSubmit} title={t('admin.carrierTitle', locale)} defaultValue="Kerry Express" loading={trackingLoading} />

      {/* Selected Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-surface-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200 dark:border-border-main">
            <div className="p-6 border-b border-slate-100 dark:border-border-main flex justify-between items-center bg-slate-50 dark:bg-surface-bg">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-foreground">{t('admin.details', locale)}</h3>
                <p className="text-xs text-slate-500 dark:text-neutral-500 font-mono">ID: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-neutral-700 rounded-full text-slate-500 transition">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-slate-50 dark:bg-neutral-800/30 p-4 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-3">
                <h4 className="font-bold text-sm flex items-center gap-2 text-slate-700 dark:text-foreground"><MapPin size={16} /> {t('cart.shippingAddress', locale)}</h4>
                <div className="text-sm text-slate-600 dark:text-txt-muted pl-6 space-y-1">
                  <p className="text-lg font-bold text-black dark:text-foreground">{selectedOrder.shippingName}</p>
                  <p>{selectedOrder.shippingAddress} {selectedOrder.shippingZipcode}</p>
                  <div className="flex items-center gap-2 mt-2 text-black dark:text-foreground font-medium"><Phone size={14} /> {selectedOrder.shippingPhone}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-700 dark:text-foreground"><Package size={16} /> {t('admin.products', locale)}</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-3 border border-slate-100 dark:border-border-main rounded-lg bg-white dark:bg-surface-card">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-surface-bg rounded-md relative overflow-hidden flex-shrink-0">
                        {item.product?.image && <Image src={item.product.image} alt="p" fill className="object-contain p-1 mix-blend-multiply dark:mix-blend-normal" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm line-clamp-1 text-slate-800 dark:text-foreground">{item.product?.name}</p>
                        <div className="flex justify-between text-xs text-slate-500 dark:text-txt-muted mt-1">
                          <span>x{item.quantity}</span>
                          <span className="font-bold">฿{Number(item.price).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-border-main bg-slate-50 dark:bg-surface-bg flex justify-between items-center">
              <span className="text-slate-500 dark:text-txt-muted text-sm font-bold uppercase tracking-widest">{t('cart.total', locale)}</span>
              <span className="text-2xl font-black text-slate-900 dark:text-foreground italic">฿{Number(selectedOrder.total).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}