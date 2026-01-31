// app/admin/products/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 🔥 แม่แบบสเปคสินค้าแต่ละหมวด (รวมของใหม่แล้ว)
const SPECS_TEMPLATES: Record<string, object> = {
  // หมวดคอมประกอบ
  CPU: { socket: "LGA1700", core: 6, thread: 12, base_clock: "3.5GHz", tdp: 65, integrated_graphics: true },
  MOTHERBOARD: { socket: "LGA1700", memory_type: "DDR5", form_factor: "ATX", m2_slots: 2 },
  GPU: { chipset: "NVIDIA", vram: "8GB", length: 250, recommended_psu: 650 },
  RAM: { type: "DDR5", capacity: "16GB", speed: 5200, modules: 2 },
  PSU: { watt: 750, certification: "80+ Gold", modular: "Full" },
  CASE: { form_factor: "ATX", side_panel: "Tempered Glass" },
  STORAGE: { type: "M.2 NVMe", capacity: "1TB", read_speed: 3500 },
  COOLER: { type: "Air", fan_size: "120mm", rgb: true },
  MONITOR: { size: "27 inch", resolution: "2K", refresh_rate: "144Hz", panel: "IPS" },

  // 🔥 หมวด IT ทั่วไป (ของใหม่)
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
    category: 'CPU', // ค่าเริ่มต้น
    price: 0,
    stock: 10,
    image: '',
    specs: JSON.stringify(SPECS_TEMPLATES['CPU'], null, 2)
  })

  // ฟังก์ชันเปลี่ยนหมวดหมู่ -> เปลี่ยน Template JSON ทันที
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
      // ตรวจสอบ JSON ก่อนส่ง
      let parsedSpecs = {}
      try {
        parsedSpecs = JSON.parse(formData.specs)
      } catch (err) {
        alert('❌ JSON Specs ผิดรูปแบบ กรุณาตรวจสอบวงเล็บหรือลูกน้ำ')
        setLoading(false)
        return
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          specs: parsedSpecs
        })
      })

      if (res.ok) {
        alert('✅ เพิ่มสินค้าสำเร็จ!')
        router.push('/admin/products')
        router.refresh()
      } else {
        alert('❌ เกิดข้อผิดพลาดในการบันทึก')
      }
    } catch (error) {
      console.error(error)
      alert('❌ เชื่อมต่อ Server ไม่ได้')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-emerald-400">✨ Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
        
        {/* ชื่อสินค้า */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">Product Name</label>
          <input 
            required
            type="text" 
            className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:border-emerald-500 outline-none"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* หมวดหมู่ & ราคา */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Category</label>
            <select 
              className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:border-emerald-500 outline-none"
              value={formData.category}
              onChange={e => handleCategoryChange(e.target.value)}
            >
              {Object.keys(SPECS_TEMPLATES).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Price (THB)</label>
            <input 
              required
              type="number" 
              className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:border-emerald-500 outline-none"
              value={formData.price}
              onChange={e => setFormData({...formData, price: Number(e.target.value)})}
            />
          </div>
        </div>

        {/* รูปภาพ URL */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">Image URL</label>
          <input 
            type="text" 
            placeholder="https://..."
            className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:border-emerald-500 outline-none font-mono text-sm"
            value={formData.image}
            onChange={e => setFormData({...formData, image: e.target.value})}
          />
        </div>

        {/* Specs JSON Editor */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">Technical Specs (JSON)</label>
          <textarea 
            rows={5}
            className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-emerald-400 font-mono text-sm focus:border-emerald-500 outline-none"
            value={formData.specs}
            onChange={e => setFormData({...formData, specs: e.target.value})}
          />
          <p className="text-xs text-slate-500 mt-1">* แก้ไขค่าใน JSON ได้เลย (ระวังเครื่องหมาย " และ ,)</p>
        </div>

        {/* ปุ่ม Submit */}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-lg transition
            ${loading ? 'bg-slate-700 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'}
          `}
        >
          {loading ? 'Saving...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}