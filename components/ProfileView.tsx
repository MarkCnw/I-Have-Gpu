// components/ProfileView.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Heart, User, MapPin, Save, Plus, Trash2, Home } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ConfirmModal from './ConfirmModal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileView({ user, orders, favorites }: { user: any, orders: any[], favorites: any[] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('INFO') 
  const [loading, setLoading] = useState(false)

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

  // --- Delete Address Modal State ---
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
        toast.success('✅ บันทึกข้อมูลเรียบร้อย')
        router.refresh()
      } else {
        toast.error('❌ เกิดข้อผิดพลาด')
      }
    } finally {
      setLoading(false)
    }
  }

  // Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress)
      })
      if (res.ok) {
        toast.success('เพิ่มที่อยู่สำเร็จ')
        setShowAddressForm(false)
        setNewAddress({ name: user.name || '', phone: user.phone || '', houseNumber: '', subdistrict: '', district: '', province: '', zipcode: '', isDefault: false })
        const updated = await fetch('/api/user/addresses').then(r => r.json())
        setAddresses(updated)
      }
    } finally {
      setLoading(false)
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
    toast.success('ลบที่อยู่สำเร็จ')
    setIsDeleteModalOpen(false)
    setDeleteAddressId(null)
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-neutral-100">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold border border-neutral-200 overflow-hidden">
               {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : user.name?.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user.name}</p>
              <p className="text-xs text-neutral-400 truncate">{user.email}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">บัญชี</h3>
            <button onClick={() => setActiveTab('INFO')} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3 ${activeTab === 'INFO' ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'}`}>
              <User size={16} /> ข้อมูลส่วนตัว
            </button>
            <button onClick={() => setActiveTab('ADDRESS')} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3 ${activeTab === 'ADDRESS' ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'}`}>
              <MapPin size={16} /> สมุดที่อยู่
            </button>
            <button onClick={() => setActiveTab('ORDERS')} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3 ${activeTab === 'ORDERS' ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'}`}>
              <Package size={16} /> ประวัติสั่งซื้อ
            </button>
            <button onClick={() => setActiveTab('FAVORITES')} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3 ${activeTab === 'FAVORITES' ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'}`}>
              <Heart size={16} /> สินค้าที่ชอบ
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-white rounded-2xl border border-neutral-100 p-8 shadow-sm">
        
        {/* --- TAB: INFO --- */}
        {activeTab === 'INFO' && (
          <form onSubmit={handleUpdateInfo} className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User className="text-neutral-400" /> ข้อมูลส่วนตัว
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">ชื่อ - นามสกุล</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:border-black outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">อีเมล</label>
                <input type="text" value={user.email} disabled className="w-full bg-neutral-100 border border-neutral-200 rounded-lg px-4 py-3 text-sm text-neutral-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">เบอร์โทรศัพท์</label>
                <input type="tel" value={formData.phone} placeholder="08x-xxx-xxxx" onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:border-black outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">วันเกิด</label>
                <input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:border-black outline-none" />
              </div>
            </div>
            <div className="pt-6 flex justify-end">
              <button disabled={loading} className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-neutral-800 transition disabled:opacity-50 flex items-center gap-2">
                {loading ? 'กำลังบันทึก...' : <><Save size={18} /> บันทึกการเปลี่ยนแปลง</>}
              </button>
            </div>
          </form>
        )}

        {/* --- TAB: ADDRESS (NEW) --- */}
        {activeTab === 'ADDRESS' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MapPin className="text-neutral-400" /> สมุดที่อยู่
              </h2>
              {!showAddressForm && (
                <button onClick={() => setShowAddressForm(true)} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-neutral-800 shadow-md">
                  <Plus size={16} /> เพิ่มที่อยู่ใหม่
                </button>
              )}
            </div>

            {/* ฟอร์มเพิ่มที่อยู่ */}
            {showAddressForm ? (
              <form onSubmit={handleAddAddress} className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 mb-6 animate-in slide-in-from-top-2">
                <h3 className="font-bold mb-4 text-neutral-800">เพิ่มที่อยู่จัดส่งใหม่</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">ชื่อผู้รับ</label>
                    <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">เบอร์โทรศัพท์</label>
                    <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} required />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">ที่อยู่ (บ้านเลขที่, หมู่, ซอย, ถนน)</label>
                  <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.houseNumber} onChange={e => setNewAddress({...newAddress, houseNumber: e.target.value})} required />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                     <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">แขวง / ตำบล</label>
                     <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.subdistrict} onChange={e => setNewAddress({...newAddress, subdistrict: e.target.value})} required />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">เขต / อำเภอ</label>
                     <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.district} onChange={e => setNewAddress({...newAddress, district: e.target.value})} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                     <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">จังหวัด</label>
                     <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.province} onChange={e => setNewAddress({...newAddress, province: e.target.value})} required />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">รหัสไปรษณีย์</label>
                     <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.zipcode} onChange={e => setNewAddress({...newAddress, zipcode: e.target.value})} required />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6 bg-white p-3 rounded-lg border border-neutral-200">
                  <input type="checkbox" id="default" className="w-4 h-4" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} />
                  <label htmlFor="default" className="text-sm font-medium cursor-pointer">ตั้งเป็นที่อยู่หลัก (Default)</label>
                </div>

                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddressForm(false)} className="text-neutral-500 px-6 py-2 text-sm hover:text-black">ยกเลิก</button>
                  <button disabled={loading} className="bg-black text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-neutral-800 shadow-lg">
                    {loading ? 'บันทึก...' : 'บันทึกที่อยู่'}
                  </button>
                </div>
              </form>
            ) : (
              // แสดงรายการที่อยู่
              <div className="grid grid-cols-1 gap-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-16 text-neutral-400 bg-neutral-50 rounded-xl border border-dashed border-neutral-200 flex flex-col items-center">
                    <Home size={32} className="mb-2 opacity-20" />
                    ยังไม่มีที่อยู่จัดส่ง
                  </div>
                ) : (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  addresses.map((addr: any) => (
                    <div key={addr.id} className={`border p-5 rounded-xl flex flex-col md:flex-row justify-between items-start gap-4 transition group relative overflow-hidden
                      ${addr.isDefault ? 'border-black bg-neutral-50' : 'border-neutral-200 hover:border-black bg-white'}
                    `}>
                      {addr.isDefault && (
                        <div className="absolute top-0 right-0 bg-black text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">
                          DEFAULT
                        </div>
                      )}
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-neutral-900">{addr.name}</span>
                          <span className="text-neutral-400 text-sm">| {addr.phone}</span>
                        </div>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {addr.houseNumber} <br/>
                          {addr.subdistrict}, {addr.district} <br/>
                          {addr.province}, {addr.zipcode}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-start opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openDeleteModal(addr.id)} 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" 
                          title="ลบที่อยู่"
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
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Package className="text-neutral-400" /> ประวัติคำสั่งซื้อ ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 rounded-xl flex flex-col items-center">
                <Package size={48} className="text-neutral-300 mb-2" />
                <p className="text-neutral-400">ยังไม่มีคำสั่งซื้อ</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {orders.map((order: any) => (
                  <div key={order.id} className="border border-neutral-100 rounded-xl p-4 hover:border-black transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-neutral-400">Order ID: {order.id.split('-')[0]}</p>
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
                           <p className="text-xs text-neutral-500 font-mono mt-1 flex items-center justify-end gap-1">
                             🚚 {order.carrier}: {order.trackingNumber}
                           </p>
                         )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-50 pt-3">
                      <p className="text-sm text-neutral-500">{order.items.length} รายการ</p>
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
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Heart className="text-neutral-400" /> สินค้าที่ชอบ ({favorites.length})
            </h2>
            {favorites.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 rounded-xl flex flex-col items-center">
                <Heart size={48} className="text-neutral-300 mb-2" />
                <p className="text-neutral-400">ยังไม่มีรายการโปรด</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {favorites.map((fav: any) => (
                  <Link href={`/products/${fav.product.id}`} key={fav.id} className="flex gap-4 p-4 border border-neutral-100 rounded-xl hover:border-black transition items-center">
                    <div className="w-16 h-16 bg-neutral-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                       <img src={fav.product.image} className="max-w-full max-h-full mix-blend-multiply" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm line-clamp-1">{fav.product.name}</h4>
                      <p className="text-xs text-neutral-500 mb-1">{fav.product.category}</p>
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
        title="ยืนยันการลบที่อยู่"
        message="คุณต้องการลบที่อยู่นี้ใช่หรือไม่?"
        confirmText="ลบที่อยู่"
        variant="danger"
      />
    </div>
  )
}