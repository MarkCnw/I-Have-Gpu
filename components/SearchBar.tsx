// components/SearchBar.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}`)
    } else {
      router.push('/')
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      {/* Icon Search */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
      
      <input
        type="text"
        placeholder="ค้นหาสินค้า"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        // 🔥 แก้ไข: ลบ bg-neutral-100 ออก -> ใส่ bg-transparent และเพิ่ม border แทน
        className="w-full bg-transparent text-neutral-900 text-sm pl-10 pr-4 py-2.5 rounded-full outline-none transition-all border border-neutral-300 focus:border-black placeholder:text-neutral-400"
      />
    </form>
  )
}