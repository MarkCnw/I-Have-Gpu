// app/admin/products/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SPECS_TEMPLATES: Record<string, object> = {
  CPU: { socket: "LGA1700", core: 6, thread: 12, base_clock: "3.5GHz", tdp: 65, integrated_graphics: true },
  MOTHERBOARD: { socket: "LGA1700", memory_type: "DDR5", form_factor: "ATX", m2_slots: 2 },
  GPU: { chipset: "NVIDIA", vram: "8GB", length: 250, recommended_psu: 650 },
  RAM: { type: "DDR5", capacity: "16GB", speed: 5200, modules: 2 },
  PSU: { watt: 750, certification: "80+ Gold", modular: "Full" },
  CASE: { form_factor: "ATX", side_panel: "Tempered Glass" },
  STORAGE: { type: "M.2 NVMe", capacity: "1TB", read_speed: 3500 },
  COOLER: { type: "Air", fan_size: "120mm", rgb: true },
  MONITOR: { size: "27 inch", resolution: "2K", refresh_rate: "144Hz", panel: "IPS" },
  LAPTOP: { cpu: "Core i5", ram: "16GB", storage: "512GB SSD", screen: "15.6 FHD 144Hz", gpu: "RTX 3050" },
  DESKTOP: { cpu: "Core i7", ram: "32GB", storage: "1TB SSD", gpu: "RTX 4060", os: "Windows 11 Home" },
  MOUSE: { dpi: 16000, connection: "Wireless", sensor: "Optical", weight: "63g" },
  KEYBOARD: { switch: "Red Switch", layout: "100%", connection: "USB-C", rgb: true },
  HEADSET: { type: "7.1 Surround", connection: "USB / 3.5mm", mic: "Detachable" },
  CHAIR: { material: "PU Leather", max_load: "150kg", recline: "180 degree" },
  ACCESSORY: { type: "Cable", length: "1.8m" }
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'CPU',
    price: 0,
    stock: 10,
    image: '',
    specs: JSON.stringify(SPECS_TEMPLATES['CPU'], null, 2)
  })

  const handleCategoryChange = (cat: string) => {
    setFormData({
      ...formData,
      category: cat,
      specs: JSON.stringify(SPECS_TEMPLATES[cat] || {}, null, 2)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let parsedSpecs = {}
      try {
        parsedSpecs = JSON.parse(formData.specs)
      } catch (err) {
        alert('❌ Invalid JSON format')
        setLoading(false)
        return
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: Number(formData.price), specs: parsedSpecs })
      })

      if (res.ok) {
        alert('✅ Product created!')
        router.push('/admin/products')
        router.refresh()
      } else {
        alert('❌ Failed to create product')
      }
    } catch (error) {
       console.log(error)
       alert('❌ Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-neutral-900">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-neutral-200 shadow-sm">
        
        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Product Name</label>
          <input 
            required
            type="text" 
            className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="e.g. Intel Core i9-14900K"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Category</label>
            <div className="relative">
               <select 
                  className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:border-black outline-none appearance-none"
                  value={formData.category}
                  onChange={e => handleCategoryChange(e.target.value)}
               >
                  {Object.keys(SPECS_TEMPLATES).map(c => <option key={c} value={c}>{c}</option>)}
               </select>
               <div className="absolute right-3 top-3.5 pointer-events-none text-xs text-neutral-500">▼</div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Price (THB)</label>
            <input 
              required
              type="number" 
              className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:border-black focus:ring-1 focus:ring-black outline-none"
              value={formData.price}
              onChange={e => setFormData({...formData, price: Number(e.target.value)})}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Image URL</label>
          <input 
            type="text" 
            placeholder="https://..."
            className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:border-black focus:ring-1 focus:ring-black outline-none font-mono text-sm"
            value={formData.image}
            onChange={e => setFormData({...formData, image: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Technical Specs (JSON)</label>
          <textarea 
            rows={6}
            className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-3 text-neutral-700 font-mono text-sm focus:border-black focus:bg-white outline-none"
            value={formData.specs}
            onChange={e => setFormData({...formData, specs: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider transition shadow-lg
            ${loading ? 'bg-neutral-200 text-neutral-400 cursor-wait' : 'bg-black text-white hover:bg-neutral-800 shadow-black/20'}
          `}
        >
          {loading ? 'Saving...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}