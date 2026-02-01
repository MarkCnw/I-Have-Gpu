// app/admin/products/new/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Save, ArrowLeft, Loader2, Package } from 'lucide-react'
import Link from 'next/link'
import { CATEGORY_SPECS } from '@/lib/spec-config'
import { toast } from 'react-hot-toast'

const CATEGORIES = [
  'CPU', 'MOTHERBOARD', 'RAM', 'GPU', 'STORAGE', 'PSU', 'CASE', 'COOLER', 'MONITOR',
  'LAPTOP', 'MOUSE', 'KEYBOARD', 'HEADSET', 'CHAIR', 'ACCESSORY'
]

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // --- State: Basic Info ---
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    price: '',
    stock: '',
    category: '', 
    description: ''
  })

  const [imageUrl, setImageUrl] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [specs, setSpecs] = useState<Record<string, any>>({})

  useEffect(() => {
    setSpecs({})
  }, [basicInfo.category])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setImageUrl(data.url)
        toast.success('อัปโหลดรูปสำเร็จ')
      } else {
        toast.error('อัปโหลดไม่สำเร็จ')
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการอัปโหลด')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!basicInfo.category) return toast.error('กรุณาเลือกหมวดหมู่')
    if (!imageUrl) return toast.error('กรุณาอัปโหลดรูปสินค้า')

    setLoading(true)
    try {
      const payload = {
        ...basicInfo,
        price: Number(basicInfo.price),
        stock: Number(basicInfo.stock),
        image: imageUrl,
        specs: specs 
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success('เพิ่มสินค้าสำเร็จ! 🎉')
        router.push('/admin/products')
      } else {
        const err = await res.json()
        toast.error(`Error: ${err.message}`)
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดบางอย่าง')
    } finally {
      setLoading(false)
    }
  }

  const currentSpecFields = CATEGORY_SPECS[basicInfo.category] || []

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-neutral-100 rounded-full transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">เพิ่มสินค้าใหม่</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* === ข้อมูลพื้นฐาน === */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
            <Package size={20} className="text-blue-600" /> ข้อมูลพื้นฐาน
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2 text-slate-600">ชื่อสินค้า</label>
              <input 
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black/10 outline-none"
                placeholder="เช่น Gigabyte RTX 4060 Eagle OC"
                value={basicInfo.name}
                onChange={e => setBasicInfo({...basicInfo, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-slate-600">หมวดหมู่</label>
              <select 
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black/10 outline-none bg-white"
                value={basicInfo.category}
                onChange={e => setBasicInfo({...basicInfo, category: e.target.value})}
              >
                <option value="">-- เลือกหมวดหมู่ --</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-600">ราคา (บาท)</label>
                <input 
                  required type="number" min="0"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black/10 outline-none"
                  value={basicInfo.price}
                  onChange={e => setBasicInfo({...basicInfo, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-600">จำนวน (สต็อก)</label>
                <input 
                  required type="number" min="0"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black/10 outline-none"
                  value={basicInfo.stock}
                  onChange={e => setBasicInfo({...basicInfo, stock: e.target.value})}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2 text-slate-600">รายละเอียด</label>
              <textarea 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black/10 outline-none h-24"
                value={basicInfo.description}
                onChange={e => setBasicInfo({...basicInfo, description: e.target.value})}
                placeholder="รายละเอียดเพิ่มเติมของสินค้า..."
              />
            </div>
          </div>
        </div>

        {/* === อัปโหลดรูป === */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
            <Upload size={20} className="text-purple-600" /> รูปภาพสินค้า
          </h2>
          
          <div className="flex items-start gap-6">
            <div className="w-40 h-40 bg-neutral-100 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center relative overflow-hidden">
              {uploading ? (
                <Loader2 className="animate-spin text-neutral-400" />
              ) : imageUrl ? (
                <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-neutral-400">ตัวอย่างรูป</span>
              )}
            </div>
            
            <div className="flex-1">
              <label className="block mb-2 text-sm text-neutral-600">อัปโหลดไฟล์ (แนะนำสัดส่วน 1:1 หรือ PNG พื้นใส)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-black file:text-white
                  hover:file:bg-neutral-800
                  cursor-pointer
                "
              />
              {imageUrl && (
                <p className="text-xs text-green-600 mt-2">✓ อัปโหลดสำเร็จแล้ว</p>
              )}
            </div>
          </div>
        </div>

        {/* === สเปคสินค้า (Dynamic) === */}
        {basicInfo.category && (
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <Save size={20} className="text-emerald-600" /> สเปคสินค้า: <span className="text-black">{basicInfo.category}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentSpecFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-bold mb-2 text-neutral-700">
                    {field.label} {field.suffix && <span className="text-xs font-normal text-neutral-400">({field.suffix})</span>}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none bg-neutral-50"
                      value={specs[field.key] || ''}
                      onChange={(e) => setSpecs({ ...specs, [field.key]: e.target.value })}
                    >
                      <option value="">เลือก...</option>
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none bg-neutral-50"
                      placeholder={field.placeholder || ''}
                      value={specs[field.key] || ''}
                      onChange={(e) => setSpecs({ ...specs, [field.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-neutral-800 transition shadow-xl shadow-black/10 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            บันทึกสินค้า
          </button>
        </div>

      </form>
    </div>
  )
}