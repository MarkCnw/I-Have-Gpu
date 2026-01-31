// components/CategoryFilter.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

// ไอคอนและชื่อหมวดหมู่
const CATEGORIES = [
  { id: 'ALL', name: 'All', icon: '🛍️' },
  { id: 'CPU', name: 'CPU', icon: '🧠' },
  { id: 'GPU', name: 'Graphic Card', icon: '🎮' },
  { id: 'RAM', name: 'RAM', icon: '💾' },
  { id: 'MOTHERBOARD', name: 'Mainboard', icon: '🔌' },
  { id: 'LAPTOP', name: 'Laptops', icon: '💻' },
  { id: 'MONITOR', name: 'Monitors', icon: '🖥️' },
  { id: 'MOUSE', name: 'Mouses', icon: '🖱️' },
  { id: 'KEYBOARD', name: 'Keyboards', icon: '⌨️' },
  { id: 'HEADSET', name: 'Headsets', icon: '🎧' },
  { id: 'CHAIR', name: 'Gaming Chairs', icon: '💺' },
  { id: 'STORAGE', name: 'Storage', icon: '💿' },
  { id: 'PSU', name: 'Power Supply', icon: '⚡' },
  { id: 'CASE', name: 'Case', icon: '📦' },
  { id: 'COOLER', name: 'Cooling', icon: '❄️' },
  { id: 'ACCESSORY', name: 'Accessories', icon: '🔌' },
]

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'ALL'

  const handleSelect = (catId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (catId === 'ALL') {
      params.delete('category')
    } else {
      params.set('category', catId)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="w-full overflow-x-auto pb-4 mb-6 scrollbar-hide">
      <div className="flex gap-3 min-w-max px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition border
              ${currentCategory === cat.id
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
              }
            `}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}