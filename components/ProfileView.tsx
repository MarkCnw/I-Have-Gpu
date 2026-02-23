// components/ProfileView.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Heart, User, MapPin, Save, Plus, Trash2, Home, Edit, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ConfirmModal from './ConfirmModal'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileView({ user, orders, favorites }: { user: any, orders: any[], favorites: any[] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('INFO')
  const { locale } = useLanguageStore()
  const [loading, setLoading] = useState(false)
  // ✅ เพิ่ม State เพื่อติดตามว่ากำลังตั้งค่า Default ให้ที่อยู่ไหน
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null)

  // --- Profile State ---
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
  })

  // --- Address State ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [addresses, setAddresses] = useState<any[]>([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editAddressId, setEditAddressId] = useState<string | null>(null) // ✅ เพิ่ม State เพื่อจำว่ากำลังแก้อันไหน
  const [newAddress, setNewAddress] = useState({
    name: user.name || '',
    phone: user.phone || '',
    houseNumber: '',
    subdistrict: '',
    district: '',
    province: '',
    zipcode: '',
    isDefault: false
  })

  const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Load addresses
  useEffect(() => {
    if (activeTab === 'ADDRESS') {
      fetch('/api/user/addresses').then(res => res.json()).then(data => {
        if (Array.isArray(data)) setAddresses(data)
      })
    }
  }, [activeTab])

  // Update Profile
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('✅ ' + t('profile.saveChanges', locale))
        router.refresh()
      } else {
        toast.error('❌ ' + t('buildSummary.orderError', locale))
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ เปลี่ยนจากเพิ่มที่อยู่อย่างเดียว เป็น สร้าง/แก้ไข ในฟังก์ชันเดียว
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const method = editAddressId ? 'PATCH' : 'POST'
      const body = editAddressId ? { id: editAddressId, ...newAddress } : newAddress

      const res = await fetch('/api/user/addresses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (res.ok) {
        toast.success('✅ ' + (editAddressId ? 'อัปเดตที่อยู่เรียบร้อย' : t('profile.saveAddress', locale)))
        setShowAddressForm(false)
        setEditAddressId(null)
        setNewAddress({ name: user.name || '', phone: user.phone || '', houseNumber: '', subdistrict: '', district: '', province: '', zipcode: '', isDefault: false })
        
        // โหลดข้อมูลที่อยู่มาใหม่
        const updated = await fetch('/api/user/addresses').then(r => r.json())
        setAddresses(updated)
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ เปิดฟอร์มสำหรับเพิ่มใหม่
  const handleAddNewClick = () => {
    setNewAddress({ name: user.name || '', phone: user.phone || '', houseNumber: '', subdistrict: '', district: '', province: '', zipcode: '', isDefault: false })
    setEditAddressId(null)
    setShowAddressForm(true)
  }

  // ✅ เปิดฟอร์มสำหรับแก้ไข
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditClick = (addr: any) => {
    setNewAddress({
      name: addr.name, phone: addr.phone, houseNumber: addr.houseNumber,
      subdistrict: addr.subdistrict, district: addr.district,
      province: addr.province, zipcode: addr.zipcode, isDefault: addr.isDefault
    })
    setEditAddressId(addr.id)
    setShowAddressForm(true)
  }

  // ✅ ตั้งเป็นที่อยู่หลักทันที
  const handleSetDefault = async (id: string) => {
    // ✅ เซ็ต ID ที่กำลังโหลด
    setSettingDefaultId(id)
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isDefault: true })
      })
      if (res.ok) {
        toast.success('✅ ตั้งเป็นที่อยู่หลักเรียบร้อย')
        const updated = await fetch('/api/user/addresses').then(r => r.json())
        setAddresses(updated)
      } else {
        toast.error('❌ เกิดข้อผิดพลาด')
      }
    } catch(err) {
      toast.error('❌ เกิดข้อผิดพลาด')
    } finally {
      // ✅ เคลียร์ State เมื่อทำเสร็จ (ทั้งสำเร็จและไม่สำเร็จ)
      setSettingDefaultId(null)
    }
  }

  // Delete Address
  const openDeleteModal = (id: string) => {
    setDeleteAddressId(id)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteAddress = async () => {
    if (!deleteAddressId) return
    await fetch(`/api/user/addresses?id=${deleteAddressId}`, { method: 'DELETE' })
    setAddresses(addresses.filter(a => a.id !== deleteAddressId))
    toast.success(t('profile.deleteAddress', locale))
    setIsDeleteModalOpen(false)
    setDeleteAddressId(null)
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-border-light">
            <div className="w-12 h-12 rounded-full bg-foreground text-surface-card flex items-center justify-center text-lg font-bold border border-border-main overflow-hidden">
              {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : user.name?.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user.name}</p>
              <p className="text-xs text-txt-muted truncate">{user.email}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-txt-muted uppercase tracking-wider mb-2">{t('profile.account', locale)}</h3>
            <button onClick={() => setActiveTab('INFO')} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3 ${activeTab === 'INFO' ? 'font-bold text-foreground' : 'text-txt-secondary hover:text-foreground'}`}>
              <User size={16} /> {t('profile.personalInfo', locale)}
            </button>
            <button onClick={() => setActiveTab('ADDRESS')} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3 ${activeTab === 'ADDRESS' ? 'font-bold text-foreground' : 'text-txt-secondary hover:text-foreground'}`}>
              <MapPin size={16} /> {t('profile.addressBook', locale)}
            </button>
            <button onClick={() => setActiveTab('ORDERS')} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3 ${activeTab === 'ORDERS' ? 'font-bold text-foreground' : 'text-txt-secondary hover:text-foreground'}`}>
              <Package size={16} /> {t('profile.orderHistory', locale)}
            </button>
            <button onClick={() => setActiveTab('FAVORITES')} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3 ${activeTab === 'FAVORITES' ? 'font-bold text-foreground' : 'text-txt-secondary hover:text-foreground'}`}>
              <Heart size={16} /> {t('profile.favItems', locale)}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-surface-card rounded-2xl border border-border-light p-8 shadow-sm">

        {/* --- TAB: INFO --- */}
        {activeTab === 'INFO' && (
          <form onSubmit={handleUpdateInfo} className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User className="text-txt-muted" /> {t('profile.personalInfo', locale)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-txt-muted uppercase mb-2">{t('profile.name', locale)}</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-surface-bg border border-border-main rounded-lg px-4 py-3 text-sm text-foreground focus:border-foreground outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-txt-muted uppercase mb-2">{t('profile.email', locale)}</label>
                <input type="text" value={user.email} disabled className="w-full bg-surface-bg border border-border-main rounded-lg px-4 py-3 text-sm text-txt-muted cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-txt-muted uppercase mb-2">{t('profile.phone', locale)}</label>
                <input type="tel" value={formData.phone} placeholder="08x-xxx-xxxx" onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-surface-bg border border-border-main rounded-lg px-4 py-3 text-sm text-foreground focus:border-foreground outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-txt-muted uppercase mb-2">{t('profile.birthday', locale)}</label>
                <input type="date" value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} className="w-full bg-surface-bg border border-border-main rounded-lg px-4 py-3 text-sm text-foreground focus:border-foreground outline-none" />
              </div>
            </div>
            <div className="pt-6 flex justify-end">
              <button disabled={loading} className="bg-foreground text-surface-card px-8 py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2">
                {loading ? t('profile.saving', locale) : <><Save size={18} /> {t('profile.saveChanges', locale)}</>}
              </button>
            </div>
          </form>
        )}

        {/* --- TAB: ADDRESS --- */}
        {activeTab === 'ADDRESS' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-border-light pb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MapPin className="text-txt-muted" /> {t('profile.addressBook', locale)}
              </h2>
              {!showAddressForm && (
                <button onClick={handleAddNewClick} className="bg-foreground text-surface-card px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 shadow-md">
                  <Plus size={16} /> {t('profile.addAddress', locale)}
                </button>
              )}
            </div>

            {/* ฟอร์ม เพิ่ม / แก้ไข ที่อยู่ */}
            {showAddressForm ? (
              <form onSubmit={handleSaveAddress} className="bg-surface-bg p-6 rounded-xl border border-border-main mb-6 animate-in slide-in-from-top-2">
                <h3 className="font-bold mb-4 text-foreground">
                  {editAddressId ? 'แก้ไขที่อยู่จัดส่ง' : t('profile.addNewAddress', locale)}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-txt-muted uppercase mb-1 block">{t('profile.recipientName', locale)}</label>
                    <input className="p-3 rounded-lg border border-border-main w-full text-sm bg-surface-card text-foreground" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-txt-muted uppercase mb-1 block">{t('profile.phone', locale)}</label>
                    <input className="p-3 rounded-lg border border-border-main w-full text-sm bg-surface-card text-foreground" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} required />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-bold text-txt-muted uppercase mb-1 block">{t('profile.addressLabel', locale)}</label>
                  <input className="p-3 rounded-lg border border-border-main w-full text-sm bg-surface-card text-foreground" value={newAddress.houseNumber} onChange={e => setNewAddress({ ...newAddress, houseNumber: e.target.value })} required />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-txt-muted uppercase mb-1 block">{t('profile.subdistrict', locale)}</label>
                    <input className="p-3 rounded-lg border border-border-main w-full text-sm bg-surface-card text-foreground" value={newAddress.subdistrict} onChange={e => setNewAddress({ ...newAddress, subdistrict: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-txt-muted uppercase mb-1 block">{t('profile.districtLabel', locale)}</label>
                    <input className="p-3 rounded-lg border border-border-main w-full text-sm bg-surface-card text-foreground" value={newAddress.district} onChange={e => setNewAddress({ ...newAddress, district: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-txt-muted uppercase mb-1 block">{t('profile.province', locale)}</label>
                    <input className="p-3 rounded-lg border border-border-main w-full text-sm bg-surface-card text-foreground" value={newAddress.province} onChange={e => setNewAddress({ ...newAddress, province: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-txt-muted uppercase mb-1 block">{t('profile.zipcode', locale)}</label>
                    <input className="p-3 rounded-lg border border-border-main w-full text-sm bg-surface-card text-foreground" value={newAddress.zipcode} onChange={e => setNewAddress({ ...newAddress, zipcode: e.target.value })} required />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6 bg-surface-card p-3 rounded-lg border border-border-main">
                  <input type="checkbox" id="default" className="w-4 h-4" checked={newAddress.isDefault} onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })} />
                  <label htmlFor="default" className="text-sm font-medium cursor-pointer">{t('profile.defaultAddress', locale)}</label>
                </div>

                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => { setShowAddressForm(false); setEditAddressId(null); }} className="text-txt-muted px-6 py-2 text-sm hover:text-foreground">{t('profile.cancel', locale)}</button>
                  <button disabled={loading} className="bg-foreground text-surface-card px-8 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 shadow-lg">
                    {loading ? t('profile.savingAddress', locale) : (editAddressId ? 'อัปเดตที่อยู่' : t('profile.saveAddress', locale))}
                  </button>
                </div>
              </form>
            ) : (
              // แสดงรายการที่อยู่
              <div className="grid grid-cols-1 gap-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-16 text-txt-muted bg-surface-bg rounded-xl border border-dashed border-border-main flex flex-col items-center">
                    <Home size={32} className="mb-2 opacity-20" />
                    {t('profile.noAddress', locale)}
                  </div>
                ) : (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  addresses.map((addr: any) => (
                    <div key={addr.id} className={`border p-5 rounded-xl flex flex-col md:flex-row justify-between items-start gap-4 transition group relative overflow-hidden
                      ${addr.isDefault ? 'border-foreground bg-surface-bg' : 'border-border-main hover:border-foreground bg-surface-card'}
                    `}>
                      {addr.isDefault && (
                        <div className="absolute top-0 right-0 bg-foreground text-surface-card text-[10px] px-3 py-1 rounded-bl-lg font-bold flex items-center gap-1">
                          <Star size={12} className="fill-current" /> ที่อยู่เริ่มต้น
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-foreground">{addr.name}</span>
                          <span className="text-txt-muted text-sm">| {addr.phone}</span>
                        </div>
                        <p className="text-sm text-txt-secondary leading-relaxed">
                          {addr.houseNumber} <br />
                          {addr.subdistrict}, {addr.district} <br />
                          {addr.province}, {addr.zipcode}
                        </p>
                      </div>

                      {/* ✅ Action Buttons (Set Default, Edit, Delete) */}
                      <div className="flex items-center gap-2 self-end md:self-start md:opacity-0 group-hover:opacity-100 transition-opacity">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefault(addr.id)}
                            disabled={settingDefaultId === addr.id} // ✅ ป้องกันกดซ้ำตอนโหลด
                            className={`text-xs font-bold px-3 py-1.5 bg-surface-bg border border-border-main rounded-lg text-foreground hover:bg-foreground hover:text-surface-card transition ${
                              settingDefaultId === addr.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {/* ✅ เปลี่ยนข้อความตอนกำลังโหลด */}
                            {settingDefaultId === addr.id ? 'กำลังเปลี่ยน...' : 'ตั้งเป็นค่าเริ่มต้น'}
                          </button>
                        )}
                        <button
                          onClick={() => handleEditClick(addr)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                          title="แก้ไขที่อยู่"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(addr.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                          title={t('profile.deleteAddress', locale)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* --- TAB: ORDERS --- */}
        {activeTab === 'ORDERS' && (
          // ... (ส่วน Orders ยังคงเหมือนเดิม)
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Package className="text-txt-muted" /> {t('profile.orderHistory', locale)} ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-surface-bg rounded-xl flex flex-col items-center">
                <Package size={48} className="text-txt-muted mb-2" />
                <p className="text-txt-muted">{t('profile.noOrders', locale)}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {orders.map((order: any) => (
                  <div key={order.id} className="border border-border-light rounded-xl p-4 hover:border-foreground transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-txt-muted">Order ID: {order.id.split('-')[0]}</p>
                        <p className="text-sm font-bold">{new Date(order.createdAt).toLocaleDateString('th-TH')}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded font-bold block mb-1
                           ${order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                        {/* Show Tracking if available */}
                        {order.trackingNumber && (
                          <p className="text-xs text-txt-muted font-mono mt-1 flex items-center justify-end gap-1">
                            🚚 {order.carrier}: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-border-light pt-3">
                      <p className="text-sm text-txt-muted">{order.items.length} {t('profile.items', locale)}</p>
                      <p className="font-bold">฿{Number(order.total).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB: FAVORITES --- */}
        {activeTab === 'FAVORITES' && (
          // ... (ส่วน Favorites ยังคงเหมือนเดิม)
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Heart className="text-txt-muted" /> {t('profile.favItems', locale)} ({favorites.length})
            </h2>
            {favorites.length === 0 ? (
              <div className="text-center py-20 bg-surface-bg rounded-xl flex flex-col items-center">
                <Heart size={48} className="text-txt-muted mb-2" />
                <p className="text-txt-muted">{t('profile.noFavorites', locale)}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {favorites.map((fav: any) => (
                  <Link href={`/products/${fav.product.id}`} key={fav.id} className="flex gap-4 p-4 border border-border-light rounded-xl hover:border-foreground transition items-center">
                    <div className="w-16 h-16 bg-surface-bg rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                      <img src={fav.product.image} className="max-w-full max-h-full mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm line-clamp-1">{fav.product.name}</h4>
                      <p className="text-xs text-txt-muted mb-1">{fav.product.category}</p>
                      <p className="text-sm font-bold text-red-600">฿{Number(fav.product.price).toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modal ยืนยันลบที่อยู่ */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAddress}
        title={t('profile.confirmDeleteAddress', locale)}
        message={t('profile.confirmDeleteAddressMsg', locale)}
        confirmText={t('profile.deleteAddress', locale)}
        variant="danger"
      />
    </div>
  )
}