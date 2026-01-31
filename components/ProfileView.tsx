// components/ProfileView.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// 1. Import ไอคอน
import { Package, Heart, User, MapPin, HeartCrack, Save } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileView({ user, orders, favorites }: { user: any, orders: any[], favorites: any[] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('INFO') 
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    address: user.address || '',
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        alert('✅ บันทึกข้อมูลเรียบร้อย')
        router.refresh()
      } else {
        alert('❌ เกิดข้อผิดพลาด')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
      
      {/* ============ SIDEBAR MENUS ============ */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          
          {/* Profile Card */}
          <div className="flex items-center gap-3 pb-6 border-b border-neutral-100">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
              {user.name?.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user.name}</p>
              <p className="text-xs text-neutral-400 truncate">{user.email}</p>
            </div>
          </div>

          {/* Menu Group 1 */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">รายการของฉัน</h3>
            <button 
              onClick={() => setActiveTab('ORDERS')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition mb-1
                ${activeTab === 'ORDERS' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-50'}
              `}
            >
              <span className="flex items-center gap-3">
                <Package size={16} /> คำสั่งซื้อ
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'ORDERS' ? 'bg-neutral-700 text-white' : 'bg-neutral-100 text-neutral-500'}`}>{orders.length}</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('FAVORITES')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition
                ${activeTab === 'FAVORITES' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-50'}
              `}
            >
              <span className="flex items-center gap-3">
                <Heart size={16} /> สินค้าที่ชอบ
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'FAVORITES' ? 'bg-neutral-700 text-white' : 'bg-neutral-100 text-neutral-500'}`}>{favorites.length}</span>
            </button>
          </div>

          {/* Menu Group 2 */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">บัญชี</h3>
            <button 
              onClick={() => setActiveTab('INFO')}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3
                ${activeTab === 'INFO' ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'}
              `}
            >
              <User size={16} /> ข้อมูลส่วนตัว
            </button>
            <button 
              onClick={() => setActiveTab('ADDRESS')}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3
                ${activeTab === 'ADDRESS' ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'}
              `}
            >
              <MapPin size={16} /> ที่อยู่จัดส่ง
            </button>
          </div>
        </div>
      </aside>

      {/* ============ MAIN CONTENT AREA ============ */}
      <main className="flex-1 bg-white rounded-2xl border border-neutral-100 p-8 shadow-sm">
        
        {/* --- TAB: INFO (ข้อมูลส่วนตัว) --- */}
        {activeTab === 'INFO' && (
          <form onSubmit={handleUpdate} className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User className="text-neutral-400" /> ข้อมูลส่วนตัว
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">ชื่อ - นามสกุล</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:border-black focus:ring-0 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">อีเมล (เปลี่ยนไม่ได้)</label>
                <input 
                  type="text" 
                  value={user.email}
                  disabled
                  className="w-full bg-neutral-100 border border-neutral-200 rounded-lg px-4 py-3 text-sm text-neutral-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">เบอร์โทรศัพท์</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  placeholder="08x-xxx-xxxx"
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:border-black outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">วันเกิด</label>
                <input 
                  type="date" 
                  value={formData.dateOfBirth}
                  onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:border-black outline-none"
                />
              </div>
            </div>
            <div className="pt-6 flex justify-end">
              <button disabled={loading} className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-neutral-800 transition disabled:opacity-50 flex items-center gap-2">
                {loading ? 'กำลังบันทึก...' : <><Save size={18} /> บันทึกการเปลี่ยนแปลง</>}
              </button>
            </div>
          </form>
        )}

        {/* --- TAB: ADDRESS (ที่อยู่) --- */}
        {activeTab === 'ADDRESS' && (
          <form onSubmit={handleUpdate} className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <MapPin className="text-neutral-400" /> ที่อยู่จัดส่งสินค้า
            </h2>
            <p className="text-sm text-neutral-500 mb-6">ที่อยู่นี้จะถูกนำไปใช้เป็นค่าเริ่มต้นเมื่อคุณสั่งซื้อสินค้า</p>
            
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">รายละเอียดที่อยู่</label>
              <textarea 
                rows={4}
                value={formData.address}
                placeholder="บ้านเลขที่, หมู่บ้าน, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:border-black outline-none resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button disabled={loading} className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-neutral-800 transition disabled:opacity-50 flex items-center gap-2">
                {loading ? 'กำลังบันทึก...' : <><Save size={18} /> บันทึกที่อยู่</>}
              </button>
            </div>
          </form>
        )}

        {/* --- TAB: ORDERS (คำสั่งซื้อ) --- */}
        {activeTab === 'ORDERS' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Package className="text-neutral-400" /> คำสั่งซื้อของฉัน ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 rounded-xl flex flex-col items-center">
                <Package size={48} className="text-neutral-300 mb-2" />
                <p className="text-neutral-400">ยังไม่มีคำสั่งซื้อ</p>
                <Link href="/" className="text-sm font-bold border-b border-black mt-2 inline-block">ไปช้อปเลย</Link>
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
                      <span className={`text-xs px-2 py-1 rounded font-bold 
                        ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.status}
                      </span>
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

        {/* --- TAB: FAVORITES (สินค้าที่ชอบ) --- */}
        {activeTab === 'FAVORITES' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Heart className="text-neutral-400" /> สินค้าที่ถูกใจ ({favorites.length})
            </h2>
            {favorites.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 rounded-xl flex flex-col items-center">
                <HeartCrack size={48} className="text-neutral-300 mb-2" />
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
    </div>
  )
}