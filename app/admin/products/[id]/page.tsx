// app/admin/products/[id]/page.tsx
'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Upload, Loader2, Save, X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

// Template สเปคสินค้า
const SPECS_TEMPLATES: Record<string, Record<string, string>> = {
  CPU: { socket: '', core_thread: '', base_clock: '', boost_clock: '', tdp: '' },
  MOTHERBOARD: { socket: '', chipset: '', form_factor: '', memory_slots: '', max_memory: '' },
  GPU: { chipset: '', memory_size: '', memory_type: '', boost_clock: '', length: '' },
  RAM: { memory_type: '', capacity: '', speed: '', latency: '', voltage: '' },
  STORAGE: { type: '', capacity: '', interface: '', read_speed: '', write_speed: '' },
  PSU: { wattage: '', efficiency: '', modular: '', form_factor: '' },
  CASE: { form_factor: '', side_panel: '', max_gpu_length: '', dimensions: '' },
  COOLER: { type: '', socket_support: '', fan_size: '', noise_level: '' },
  MONITOR: { screen_size: '', resolution: '', panel_type: '', refresh_rate: '', response_time: '' },
  LAPTOP: { cpu: '', gpu: '', ram: '', storage: '', screen: '', weight: '' },
  MOUSE: { sensor: '', dpi: '', buttons: '', connection: '', weight: '' },
  KEYBOARD: { switch_type: '', layout: '', connection: '', lighting: '' },
  HEADSET: { driver_size: '', connection: '', frequency_response: '', microphone: '' },
  CHAIR: { material: '', max_weight: '', recline_angle: '', armrest: '' },
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params) // ✅ Unwrap params สำหรับ Next.js 15+
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '', 
    images: [] as string[],
    specs: {} as Record<string, string>
  })

  // ✅ ดึงข้อมูลสินค้าเก่ามาแสดง
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        
        setFormData({
          name: data.name,
          description: data.description || '',
          price: data.price,
          stock: data.stock,
          category: data.category,
          images: data.images && data.images.length > 0 ? data.images : (data.image ? [data.image] : []),
          specs: data.specs || {}
        })
      } catch (error) {
        toast.error('ไม่พบข้อมูลสินค้า')
        router.push('/admin/products')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, router])

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category,
      specs: SPECS_TEMPLATES[category] ? { ...SPECS_TEMPLATES[category] } : {}
    }))
  }

  const handleSpecChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [key]: value }
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setUploading(true)
    const files = Array.from(e.target.files)
    
    try {
      const uploadPromises = files.map(async (file) => {
        const data = new FormData()
        data.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: data })
        if (!res.ok) throw new Error('Upload failed')
        const { url } = await res.json()
        return url
      })
      const newImages = await Promise.all(uploadPromises)
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }))
      toast.success(`อัปโหลด ${newImages.length} รูปเรียบร้อย`)
    } catch (error) {
      toast.error('อัปโหลดรูปภาพไม่สำเร็จ')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleAddUrl = () => {
    if (!imageUrlInput.trim()) return
    setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }))
    setImageUrlInput('')
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, index) => index !== indexToRemove)
    }))
  }

  // ✅ ฟังก์ชันบันทึกการแก้ไข (PATCH)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category) return toast.error('กรุณาเลือกหมวดหมู่สินค้า')
    if (formData.images.length === 0) return toast.error('กรุณาเพิ่มรูปสินค้าอย่างน้อย 1 รูป')

    setSaving(true)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: formData.images[0], // อัปเดตรูปปก
          images: formData.images,
          price: Number(formData.price),
          stock: Number(formData.stock)
        })
      })

      if (!res.ok) throw new Error('Failed to update')
      
      toast.success('บันทึกการแก้ไขเรียบร้อย')
      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการแก้ไขสินค้า')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">แก้ไขสินค้า</h1>
          <p className="text-neutral-500 text-sm">รหัสสินค้า: {id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. ข้อมูลพื้นฐาน */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
          <h2 className="font-bold text-lg border-b pb-4">ข้อมูลทั่วไป</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700">ชื่อสินค้า <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-neutral-900 focus:border-black focus:ring-0 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
               <label className="text-sm font-bold text-neutral-700">หมวดหมู่ <span className="text-red-500">*</span></label>
               <div className="relative">
                  <select 
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-neutral-900 focus:border-black outline-none appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={e => handleCategoryChange(e.target.value)}
                  >
                    <option value="">-- เลือกหมวดหมู่ --</option>
                    {Object.keys(SPECS_TEMPLATES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-xs text-neutral-500">▼</div>
               </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700">รายละเอียดสินค้า</label>
            <textarea 
              rows={4}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-neutral-900 focus:border-black focus:ring-0 outline-none transition-all resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">ราคา (บาท) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  required
                  min="0"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-neutral-900 focus:border-black outline-none"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">จำนวน (สต็อก) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  required
                  min="0"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-neutral-900 focus:border-black outline-none"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                />
             </div>
          </div>
        </div>

        {/* 2. สเปคสินค้า */}
        {formData.category && (
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
            <h2 className="font-bold text-lg border-b pb-4">คุณสมบัติเฉพาะ ({formData.category})</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.keys(SPECS_TEMPLATES[formData.category]).map((key) => (
                <div key={key} className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    {key.replace('_', ' ')}
                  </label>
                  <input 
                    type="text"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-sm focus:border-black outline-none"
                    placeholder={`ระบุ ${key}`}
                    value={formData.specs[key] || ''}
                    onChange={e => handleSpecChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. รูปภาพสินค้า */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="font-bold text-lg">รูปภาพสินค้า ({formData.images.length})</h2>
            <span className="text-xs text-neutral-400">รูปแรกจะเป็นรูปปกสินค้า</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="aspect-square bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center relative hover:bg-neutral-100 transition-colors cursor-pointer group">
                {uploading ? (
                    <Loader2 className="animate-spin text-neutral-400" />
                ) : (
                    <>
                        <Upload className="text-neutral-400 mb-2 group-hover:text-black transition-colors" />
                        <span className="text-xs text-neutral-500 font-medium">อัปโหลดเพิ่ม</span>
                    </>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
             </div>

             {formData.images.map((img, index) => (
                <div key={index} className="aspect-square relative rounded-xl overflow-hidden border border-neutral-200 group">
                    <Image src={img} alt={`Product ${index}`} fill className="object-cover" />
                    {index === 0 && (
                        <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                            รูปปก
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-500 hover:text-white text-neutral-600 rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                        <X size={14} />
                    </button>
                </div>
             ))}
          </div>

          <div className="flex gap-2 items-end pt-2 border-t border-neutral-100 mt-2">
             <div className="flex-1 space-y-2">
                <label className="text-sm font-bold text-neutral-700">เพิ่มรูปจากลิงก์</label>
                <input 
                  type="text"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-neutral-900 focus:border-black outline-none text-sm"
                  placeholder="https://example.com/image.png"
                  value={imageUrlInput}
                  onChange={e => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                />
             </div>
             <button 
                type="button"
                onClick={handleAddUrl}
                className="bg-neutral-900 text-white p-3 rounded-lg hover:bg-black transition-colors mb-[1px]"
             >
                <Plus size={20} />
             </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <Link 
            href="/admin/products"
            className="px-6 py-3 rounded-lg border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 transition-colors"
          >
            ยกเลิก
          </Link>
          <button 
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-3 rounded-lg bg-black text-white font-bold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            บันทึกการแก้ไข
          </button>
        </div>

      </form>
    </div>
  )
}