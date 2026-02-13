// app/admin/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, Check, X, Truck, ExternalLink, Copy, MapPin, Phone, Package } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ConfirmModal from '@/components/ConfirmModal'
import InputModal from '@/components/InputModal'
import Image from 'next/image'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

const TableRowSkeleton = () => (
  <tr className="border-b border-border-main">
    <td className="p-4"><div className="h-5 w-20 bg-surface-bg rounded animate-pulse" /></td>
    <td className="p-4">
      <div className="h-4 w-32 bg-surface-bg rounded animate-pulse mb-2" />
      <div className="h-3 w-24 bg-surface-bg rounded animate-pulse" />
    </td>
    <td className="p-4"><div className="h-5 w-20 bg-surface-bg rounded animate-pulse" /></td>
    <td className="p-4"><div className="h-6 w-24 bg-surface-bg rounded-full animate-pulse" /></td>
    <td className="p-4"><div className="h-4 w-16 bg-surface-bg rounded animate-pulse" /></td>
    <td className="p-4"><div className="h-4 w-24 bg-surface-bg rounded animate-pulse" /></td>
    <td className="p-4 text-right"><div className="h-8 w-40 bg-surface-bg rounded-lg animate-pulse ml-auto" /></td>
  </tr>
)

export default function AdminOrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      if (Array.isArray(data)) {
        setOrders(data)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const openStatusConfirm = (id: string, status: string) => {
    setConfirmData({ id, status })
    setIsConfirmOpen(true)
  }

  const openRejectModal = (id: string) => {
    setRejectOrderId(id)
    setIsRejectModalOpen(true)
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
      toast.success('✅')
      await fetchOrders()
    } catch (error) {
      toast.error('Error')
    } finally {
      setConfirmLoading(false)
      setIsRejectModalOpen(false)
      setRejectOrderId(null)
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
      toast.success('✅')
      await fetchOrders()
    } catch (error) {
      toast.error('Error')
    } finally {
      setConfirmLoading(false)
      setIsConfirmOpen(false)
      setConfirmData(null)
    }
  }

  const openTrackingModal = (id: string) => {
    setTrackingOrderId(id)
    setTrackingNumber('')
    setIsTrackingModalOpen(true)
  }

  const handleTrackingSubmit = (value: string) => {
    setTrackingNumber(value)
    setIsTrackingModalOpen(false)
    setIsCarrierModalOpen(true)
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
      toast.success('✅')
      await fetchOrders()
    } catch (error) {
      toast.error('Error')
    } finally {
      setTrackingLoading(false)
      setIsCarrierModalOpen(false)
      setTrackingOrderId(null)
      setTrackingNumber('')
    }
  }

  const safeOrders = Array.isArray(orders) ? orders : []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredOrders = filter === 'ALL' ? safeOrders : safeOrders.filter((o: any) => o.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">{t('admin.manageOrders', locale)}</h1>

        <div className="flex bg-surface-card p-1 rounded-lg border border-border-main">
          {['ALL', 'VERIFYING', 'PAID', 'SHIPPED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${filter === f ? 'bg-foreground text-surface-card' : 'text-txt-muted hover:bg-surface-bg'}`}
            >
              {STATUS_LABEL[f]}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {f === 'VERIFYING' && safeOrders.filter((o: any) => o.status === 'VERIFYING').length > 0 && <span className="ml-1 text-red-400">●</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-main shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-bg text-txt-muted font-bold border-b border-border-main">
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
          <tbody className="divide-y divide-border-main">
            {isLoading ? (
              [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-txt-muted">{t('admin.noOrders', locale)}</td>
              </tr>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              filteredOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-surface-bg transition">
                  <td className="p-4 font-mono text-foreground">{order.id.split('-')[0]}</td>
                  <td className="p-4">
                    <p className="font-bold text-foreground">{order.shippingName}</p>
                    <p className="text-xs text-txt-muted">{new Date(order.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">฿{Number(order.total).toLocaleString()}</td>

                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold 
                      ${order.status === 'VERIFYING' ? 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400' :
                        order.status === 'PAYMENT_FAILED' ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400' :
                          order.status === 'PAID' ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400' :
                            order.status === 'SHIPPED' ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400' :
                              order.status === 'CANCELLED' ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400' : 'bg-surface-bg text-txt-muted'
                      }`}
                    >
                      {STATUS_LABEL[order.status] || order.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {order.slipImage ? (
                      <a href={order.slipImage} target="_blank" className="text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline text-xs">
                        <ExternalLink size={12} /> {t('admin.viewSlip', locale)}
                      </a>
                    ) : (
                      <span className="text-txt-muted">-</span>
                    )}
                  </td>

                  <td className="p-4">
                    {order.trackingNumber ? (
                      <div className="text-xs">
                        <span className="font-bold text-foreground">{order.carrier}</span>
                        <br />
                        <span className="font-mono text-txt-muted">{order.trackingNumber}</span>
                      </div>
                    ) : '-'}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-surface-bg text-txt-muted px-3 py-1.5 rounded flex items-center gap-1 hover:bg-border-main text-xs font-bold transition"
                      >
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
                        <button onClick={() => openTrackingModal(order.id)} className="bg-foreground text-surface-card px-3 py-1.5 rounded flex items-center gap-1 hover:opacity-90 text-xs font-bold">
                          <Truck size={14} /> {t('admin.ship', locale)}
                        </button>
                      )}

                      {order.status === 'SHIPPED' && (
                        <button onClick={() => openTrackingModal(order.id)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-bold">
                          {t('admin.editTracking', locale)}
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

      <InputModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectSubmit}
        title={locale === 'en' ? 'Reason for rejection' : locale === 'jp' ? '拒否理由を入力してください' : 'ระบุเหตุผลที่ปฏิเสธการชำระเงิน'}
        placeholder={locale === 'en' ? 'e.g. Incorrect amount or unclear slip' : locale === 'jp' ? '例：金額が不正確、スリップが不鮮明' : 'เช่น ยอดเงินไม่ถูกต้อง หรือ สลิปไม่ชัดเจน'}
        confirmText={t('admin.confirm', locale)}
        loading={confirmLoading}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmStatusChange}
        title={locale === 'en' ? 'Confirm status change' : locale === 'jp' ? 'ステータス変更の確認' : 'ยืนยันการเปลี่ยนสถานะ'}
        message={`${locale === 'en' ? 'Change status to' : locale === 'jp' ? 'ステータスを変更:' : 'เปลี่ยนสถานะเป็น'} "${confirmData ? STATUS_LABEL[confirmData.status] || confirmData.status : ''}"?`}
        confirmText={t('admin.confirm', locale)}
        loading={confirmLoading}
        variant={confirmData?.status === 'PENDING' ? 'danger' : 'info'}
      />

      <InputModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        onConfirm={handleTrackingSubmit}
        title={locale === 'en' ? 'Enter tracking number' : locale === 'jp' ? '追跡番号を入力' : 'กรุณากรอกเลขพัสดุ (Tracking Number)'}
        placeholder="e.g. TH12345678901"
        confirmText={locale === 'en' ? 'Next' : locale === 'jp' ? '次へ' : 'ถัดไป'}
      />

      <InputModal
        isOpen={isCarrierModalOpen}
        onClose={() => setIsCarrierModalOpen(false)}
        onConfirm={handleCarrierSubmit}
        title={locale === 'en' ? 'Carrier name' : locale === 'jp' ? '配送業者名' : 'ชื่อบริษัทขนส่ง'}
        placeholder="e.g. Kerry, Flash, Thailand Post"
        defaultValue="Kerry Express"
        confirmText={locale === 'en' ? 'Save' : locale === 'jp' ? '保存' : 'บันทึก'}
        loading={trackingLoading}
      />

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-surface-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-border-main">
            <div className="p-6 border-b border-border-main flex justify-between items-center bg-surface-bg">
              <div>
                <h3 className="font-bold text-lg text-foreground">{t('admin.details', locale)}</h3>
                <p className="text-xs text-txt-muted font-mono">ID: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-surface-card rounded-full text-txt-muted transition">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-surface-bg p-4 rounded-xl border border-border-main space-y-3">
                <h4 className="font-bold text-sm flex items-center gap-2 text-txt-muted"><MapPin size={16} /> {t('cart.shippingAddress', locale)}</h4>
                <div className="text-sm text-txt-muted pl-6 space-y-1">
                  <p className="text-lg font-bold text-foreground">{selectedOrder.shippingName}</p>
                  <p>{selectedOrder.shippingAddress}</p>
                  <p>{selectedOrder.shippingZipcode}</p>
                  <div className="flex items-center gap-2 mt-2 text-foreground font-medium">
                    <Phone size={14} /> {selectedOrder.shippingPhone}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-txt-muted"><Package size={16} /> {t('admin.products', locale)}</h4>
                <div className="space-y-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-3 border border-border-main rounded-lg bg-surface-card">
                      <div className="w-12 h-12 bg-surface-bg rounded-md flex items-center justify-center relative overflow-hidden">
                        {item.product?.image ? (
                          <Image src={item.product.image} alt={item.product.name} fill className="object-contain mix-blend-multiply dark:mix-blend-normal p-1" />
                        ) : (
                          <div className="text-xs text-txt-muted">No Img</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm line-clamp-1 text-foreground">{item.product?.name}</p>
                        <div className="flex justify-between text-xs text-txt-muted mt-1">
                          <span>x{item.quantity}</span>
                          <span>฿{Number(item.price).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.taxId && (
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900 text-sm">
                  <h4 className="font-bold text-blue-800 dark:text-blue-400 mb-2">{t('cart.taxInvoice', locale)}</h4>
                  <p className="text-foreground"><strong>{t('cart.taxName', locale)}:</strong> {selectedOrder.taxName}</p>
                  <p className="text-foreground"><strong>{t('cart.taxId', locale)}:</strong> {selectedOrder.taxId}</p>
                  <p className="text-foreground"><strong>{t('cart.taxAddress', locale)}:</strong> {selectedOrder.taxAddress}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border-main bg-surface-bg text-right">
              <span className="text-txt-muted text-sm mr-2">{t('cart.total', locale)}</span>
              <span className="text-xl font-bold text-foreground">฿{Number(selectedOrder.total).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}