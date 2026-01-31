// components/SearchBar.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // ดึงค่าเก่าจาก URL มาใส่ในช่อง (ถ้ามี)
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // เปลี่ยน URL เป็น /?q=คำค้นหา (หน้าเว็บจะ Reload ข้อมูลใหม่เอง)
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}`)
    } else {
      router.push('/') // ถ้าลบหมด ให้กลับหน้าแรกปกติ
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
      <input
        type="text"
        placeholder="🔍 ค้นหาสินค้า..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg outline-none focus:border-emerald-500 w-full md:w-64"
      />
      <button 
        type="submit"
        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold transition"
      >
        Search
      </button>
    </form>
  )
}