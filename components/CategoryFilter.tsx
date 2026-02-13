// components/CategoryFilter.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { X, Filter } from 'lucide-react'

// 1. ตั้งค่า Config ของสเปคแต่ละหมวดหมู่
interface SpecOption {
  label: string
  key: string // ชื่อ key ใน JSON specs (เช่น bus, chipset)
  options: string[]
}

const SPEC_CONFIG: Record<string, SpecOption[]> = {
  CPU: [
    { label: 'Brand', key: 'brand', options: ['Intel', 'AMD'] },
    { label: 'Socket', key: 'socket', options: ['LGA1700', 'LGA1200', 'AM5', 'AM4'] },
    { label: 'Series', key: 'series', options: ['Core i3', 'Core i5', 'Core i7', 'Core i9', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9'] },
  ],
  RAM: [
    { label: 'Type', key: 'type', options: ['DDR4', 'DDR5'] },
    { label: 'Bus', key: 'bus', options: ['2666', '3200', '3600', '4800', '5200', '5600', '6000', '6400'] },
    { label: 'Capacity', key: 'capacity', options: ['8GB', '16GB', '32GB', '64GB (32x2)'] },
  ],
  GPU: [
    { label: 'Chipset', key: 'chipset', options: ['NVIDIA', 'AMD', 'Intel'] },
    { label: 'Series', key: 'series', options: ['RTX 3050', 'RTX 3060', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090', 'RX 6600', 'RX 7600', 'RX 7800'] },
    { label: 'VRAM', key: 'vram', options: ['8GB', '12GB', '16GB', '24GB'] },
  ],
  MONITOR: [
    { label: 'Panel', key: 'panel', options: ['IPS', 'VA', 'TN', 'OLED'] },
    { label: 'Refresh Rate', key: 'refresh_rate', options: ['60Hz', '75Hz', '144Hz', '165Hz', '240Hz', '360Hz'] },
    { label: 'Resolution', key: 'resolution', options: ['FHD', '2K', '4K'] },
  ],
  STORAGE: [
    { label: 'Type', key: 'type', options: ['M.2 NVMe', 'SATA SSD', 'HDD'] },
    { label: 'Capacity', key: 'capacity', options: ['250GB', '500GB', '1TB', '2TB', '4TB'] },
  ],
}

const CATEGORIES = [
  { id: 'ALL', name: 'All', icon: '🛍️' },
  { id: 'CPU', name: 'CPU', icon: '🧠' },
  { id: 'GPU', name: 'GPU', icon: '🎮' },
  { id: 'RAM', name: 'RAM', icon: '💾' },
  { id: 'MOTHERBOARD', name: 'MB', icon: '🔌' },
  { id: 'MONITOR', name: 'Monitor', icon: '🖥️' },
  { id: 'STORAGE', name: 'Storage', icon: '💿' },
  { id: 'PSU', name: 'PSU', icon: '⚡' },
  { id: 'CASE', name: 'Case', icon: '📦' },
  { id: 'COOLER', name: 'Cooling', icon: '❄️' },
  { id: 'LAPTOP', name: 'Laptop', icon: '💻' },
  { id: 'ACCESSORY', name: 'Accs', icon: '🎧' },
]

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'ALL'

  // หา Config สเปคของหมวดปัจจุบัน
  const currentSpecConfig = SPEC_CONFIG[currentCategory] || []

  // ฟังก์ชันเปลี่ยนหมวดหมู่ (ล้าง Filter เก่าทิ้ง)
  const handleCategorySelect = (catId: string) => {
    const params = new URLSearchParams()
    if (catId !== 'ALL') params.set('category', catId)
    router.push(`/?${params.toString()}`)
  }

  // ฟังก์ชันเลือกสเปค (เพิ่ม spec_... เข้าไปใน URL)
  const handleSpecSelect = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(`spec_${key}`, value)
    } else {
      params.delete(`spec_${key}`)
    }
    router.push(`/?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    if (currentCategory !== 'ALL') params.set('category', currentCategory)
    router.push(`/?${params.toString()}`)
  }

  // เช็คว่ามีการกรองสเปคอยู่หรือไม่
  const hasActiveFilters = Array.from(searchParams.keys()).some(k => k.startsWith('spec_'))

  return (
    <div className="w-full space-y-4 mb-6">

      {/* 1. Category Tabs (สำหรับ Mobile หรือจอเล็ก ที่ Sidebar ซ่อน) */}
      <div className="md:hidden overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 min-w-max px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition border whitespace-nowrap
                ${currentCategory === cat.id
                  ? 'bg-foreground text-surface-card border-foreground shadow-lg'
                  : 'bg-surface-card text-txt-muted border-border-main hover:border-foreground hover:text-foreground'
                }
              `}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Advanced Spec Filters (แสดงเมื่อหมวดนั้นมี Config) */}
      {currentSpecConfig.length > 0 && (
        <div className="bg-surface-bg p-4 rounded-xl border border-border-light animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-txt-muted uppercase tracking-wider flex items-center gap-1">
              <Filter size={12} /> Filter Options
            </span>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1">
                <X size={12} /> Clear All
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {currentSpecConfig.map((spec) => {
              const currentValue = searchParams.get(`spec_${spec.key}`) || ''

              return (
                <div key={spec.key} className="relative group">
                  <select
                    value={currentValue}
                    onChange={(e) => handleSpecSelect(spec.key, e.target.value)}
                    className={`
                      appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border cursor-pointer outline-none focus:ring-2 focus:ring-black/5 transition shadow-sm
                      ${currentValue
                        ? 'bg-foreground text-surface-card border-foreground font-medium'
                        : 'bg-surface-card text-txt-secondary border-border-main hover:border-txt-muted'
                      }
                    `}
                  >
                    <option value="">{spec.label}: All</option>
                    {spec.options.map(opt => (
                      <option key={opt} value={opt} className="text-black bg-white">{opt}</option>
                    ))}
                  </select>
                  {/* Custom Arrow Icon */}
                  <div className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${currentValue ? 'text-surface-card' : 'text-txt-muted'}`}>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}