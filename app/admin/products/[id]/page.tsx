// app/admin/products/[id]/page.tsx
'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Upload, Loader2, Save, X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

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

  const { locale } = useLanguageStore()
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
        toast.error(t('admin.productNotFound', locale))
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
      toast.success(t('admin.uploadSuccess', locale))
    } catch (error) {
      toast.error(t('admin.uploadError', locale))
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
    if (!formData.category) return toast.error(t('admin.selectCategory', locale))
    if (formData.images.length === 0) return toast.error(t('admin.addImage', locale))

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

      toast.success(t('admin.productSaved', locale))
      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      toast.error(t('admin.productSaveError', locale))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-surface-bg rounded-full transition-colors text-txt-muted">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">แก้ไขสินค้า</h1>
          <p className="text-txt-muted text-sm">รหัสสินค้า: {id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* 1. ข้อมูลพื้นฐาน */}
        <div className="bg-surface-card p-6 rounded-xl border border-border-main shadow-sm space-y-6">
          <h2 className="font-bold text-lg border-b border-border-main pb-4 text-foreground">ข้อมูลทั่วไป</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-txt-muted">ชื่อสินค้า <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                className="w-full bg-surface-bg border border-border-main rounded-lg p-3 text-foreground focus:border-foreground focus:ring-0 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-txt-muted">หมวดหมู่ <span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  className="w-full bg-surface-bg border border-border-main rounded-lg p-3 text-foreground focus:border-foreground outline-none appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={e => handleCategoryChange(e.target.value)}
                >
                  <option value="">-- เลือกหมวดหมู่ --</option>
                  {Object.keys(SPECS_TEMPLATES).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none text-xs text-txt-muted">▼</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-txt-muted">รายละเอียดสินค้า</label>
            <textarea
              rows={4}
              className="w-full bg-surface-bg border border-border-main rounded-lg p-3 text-foreground focus:border-foreground focus:ring-0 outline-none transition-all resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-txt-muted">ราคา (บาท) <span className="text-red-500">*</span></label>
              <input
                type="number"
                required
                min="0"
                className="w-full bg-surface-bg border border-border-main rounded-lg p-3 text-foreground focus:border-foreground outline-none"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-txt-muted">จำนวน (สต็อก) <span className="text-red-500">*</span></label>
              <input
                type="number"
                required
                min="0"
                className="w-full bg-surface-bg border border-border-main rounded-lg p-3 text-foreground focus:border-foreground outline-none"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 2. สเปคสินค้า */}
        {formData.category && (
          <div className="bg-surface-card p-6 rounded-xl border border-border-main shadow-sm space-y-6">
            <h2 className="font-bold text-lg border-b border-border-main pb-4 text-foreground">คุณสมบัติเฉพาะ ({formData.category})</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.keys(SPECS_TEMPLATES[formData.category]).map((key) => (
                <div key={key} className="space-y-2">
                  <label className="text-xs font-bold text-txt-muted uppercase tracking-wider">
                    {key.replace('_', ' ')}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-surface-bg border border-border-main rounded-lg p-2.5 text-sm text-foreground focus:border-foreground outline-none"
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
        <div className="bg-surface-card p-6 rounded-xl border border-border-main shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-border-main pb-4">
            <h2 className="font-bold text-lg text-foreground">รูปภาพสินค้า ({formData.images.length})</h2>
            <span className="text-xs text-txt-muted">รูปแรกจะเป็นรูปปกสินค้า</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square bg-surface-bg border-2 border-dashed border-border-main rounded-xl flex flex-col items-center justify-center relative hover:bg-border-main/30 transition-colors cursor-pointer group">
              {uploading ? (
                <Loader2 className="animate-spin text-txt-muted" />
              ) : (
                <>
                  <Upload className="text-txt-muted mb-2 group-hover:text-foreground transition-colors" />
                  <span className="text-xs text-txt-muted font-medium">อัปโหลดเพิ่ม</span>
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
              <div key={index} className="aspect-square relative rounded-xl overflow-hidden border border-border-main group">
                <Image src={img} alt={`Product ${index}`} fill className="object-cover" />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-foreground text-surface-card text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                    รูปปก
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-surface-card/80 hover:bg-red-500 hover:text-white text-txt-muted rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 items-end pt-2 border-t border-border-main mt-2">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-bold text-txt-muted">เพิ่มรูปจากลิงก์</label>
              <input
                type="text"
                className="w-full bg-surface-bg border border-border-main rounded-lg p-3 text-foreground focus:border-foreground outline-none text-sm"
                placeholder="https://example.com/image.png"
                value={imageUrlInput}
                onChange={e => setImageUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
              />
            </div>
            <button
              type="button"
              onClick={handleAddUrl}
              className="bg-foreground text-surface-card p-3 rounded-lg hover:opacity-90 transition-colors mb-[1px]"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-lg border border-border-main text-txt-muted font-bold hover:bg-surface-bg transition-colors"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-3 rounded-lg bg-foreground text-surface-card font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            บันทึกการแก้ไข
          </button>
        </div>

      </form>
    </div>
  )
}