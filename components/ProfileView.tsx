// components/ProfileView.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Heart, User, MapPin, Save, Plus, Trash2, Home } from 'lucide-react'

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

  // Load addresses when tab is active
  useEffect(() => {
    if (activeTab === 'ADDRESS') {
      fetch('/api/user/addresses').then(res => res.json()).then(data => {
        if (Array.isArray(data)) setAddresses(data)
      })
    }
  }, [activeTab])

  // Update Profile Info
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
        alert('✅ Profile updated!')
        router.refresh()
      } else {
        alert('❌ Update failed')
      }
    } finally {
      setLoading(false)
    }
  }

  // Add New Address
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
        alert('Address added successfully!')
        setShowAddressForm(false)
        // Reset Form
        setNewAddress({ name: user.name || '', phone: user.phone || '', houseNumber: '', subdistrict: '', district: '', province: '', zipcode: '', isDefault: false })
        // Reload list
        const updated = await fetch('/api/user/addresses').then(r => r.json())
        setAddresses(updated)
      }
    } finally {
      setLoading(false)
    }
  }

  // Delete Address
  const handleDeleteAddress = async (id: string) => {
    if(!confirm('Are you sure you want to delete this address?')) return
    await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE' })
    setAddresses(addresses.filter(a => a.id !== id))
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
      
      {/* ============ SIDEBAR ============ */}
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
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Account</h3>
            <button onClick={() => setActiveTab('INFO')} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3 ${activeTab === 'INFO' ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'}`}>
              <User size={16} /> Personal Info
            </button>
            <button onClick={() => setActiveTab('ADDRESS')} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3 ${activeTab === 'ADDRESS' ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'}`}>
              <MapPin size={16} /> Address Book
            </button>
            <button onClick={() => setActiveTab('ORDERS')} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3 ${activeTab === 'ORDERS' ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'}`}>
              <Package size={16} /> Order History
            </button>
            <button onClick={() => setActiveTab('FAVORITES')} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition mb-1 flex items-center gap-3 ${activeTab === 'FAVORITES' ? 'font-bold text-black' : 'text-neutral-600 hover:text-black'}`}>
              <Heart size={16} /> Wishlist
            </button>
          </div>
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 bg-white rounded-2xl border border-neutral-100 p-8 shadow-sm">
        
        {/* --- TAB: INFO --- */}
        {activeTab === 'INFO' && (
          <form onSubmit={handleUpdateInfo} className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User className="text-neutral-400" /> Personal Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:border-black outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Email</label>
                <input type="text" value={user.email} disabled className="w-full bg-neutral-100 border border-neutral-200 rounded-lg px-4 py-3 text-sm text-neutral-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Phone Number</label>
                <input type="tel" value={formData.phone} placeholder="08x-xxx-xxxx" onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:border-black outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Date of Birth</label>
                <input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:border-black outline-none" />
              </div>
            </div>
            <div className="pt-6 flex justify-end">
              <button disabled={loading} className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-neutral-800 transition disabled:opacity-50 flex items-center gap-2">
                {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </form>
        )}

        {/* --- TAB: ADDRESS (NEW) --- */}
        {activeTab === 'ADDRESS' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MapPin className="text-neutral-400" /> Address Book
              </h2>
              {!showAddressForm && (
                <button onClick={() => setShowAddressForm(true)} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-neutral-800 shadow-md">
                  <Plus size={16} /> Add Address
                </button>
              )}
            </div>

            {/* Form */}
            {showAddressForm ? (
              <form onSubmit={handleAddAddress} className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 mb-6 animate-in slide-in-from-top-2">
                <h3 className="font-bold mb-4 text-neutral-800">Add New Address</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Recipient Name</label>
                    <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Phone Number</label>
                    <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} required />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Address (House No, Village, Road)</label>
                  <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.houseNumber} onChange={e => setNewAddress({...newAddress, houseNumber: e.target.value})} required />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                     <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Sub-district (Tambon)</label>
                     <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.subdistrict} onChange={e => setNewAddress({...newAddress, subdistrict: e.target.value})} required />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">District (Amphoe)</label>
                     <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.district} onChange={e => setNewAddress({...newAddress, district: e.target.value})} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                     <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Province</label>
                     <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.province} onChange={e => setNewAddress({...newAddress, province: e.target.value})} required />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Postal Code</label>
                     <input className="p-3 rounded-lg border border-neutral-300 w-full text-sm" value={newAddress.zipcode} onChange={e => setNewAddress({...newAddress, zipcode: e.target.value})} required />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6 bg-white p-3 rounded-lg border border-neutral-200">
                  <input type="checkbox" id="default" className="w-4 h-4" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} />
                  <label htmlFor="default" className="text-sm font-medium cursor-pointer">Set as Default Shipping Address</label>
                </div>

                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddressForm(false)} className="text-neutral-500 px-6 py-2 text-sm hover:text-black">Cancel</button>
                  <button disabled={loading} className="bg-black text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-neutral-800 shadow-lg">
                    {loading ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            ) : (
              // List Addresses
              <div className="grid grid-cols-1 gap-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-16 text-neutral-400 bg-neutral-50 rounded-xl border border-dashed border-neutral-200 flex flex-col items-center">
                    <Home size={32} className="mb-2 opacity-20" />
                    No address saved.
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
                          onClick={() => handleDeleteAddress(addr.id)} 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" 
                          title="Delete Address"
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
              <Package className="text-neutral-400" /> Order History ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 rounded-xl flex flex-col items-center">
                <Package size={48} className="text-neutral-300 mb-2" />
                <p className="text-neutral-400">No orders yet.</p>
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
                           ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
                      <p className="text-sm text-neutral-500">{order.items.length} Items</p>
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
              <Heart className="text-neutral-400" /> Wishlist ({favorites.length})
            </h2>
            {favorites.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 rounded-xl flex flex-col items-center">
                <Heart size={48} className="text-neutral-300 mb-2" />
                <p className="text-neutral-400">No favorite items.</p>
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