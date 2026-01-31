// components/SearchBar.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

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
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">🔍</span>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-neutral-100 hover:bg-neutral-200 focus:bg-white text-neutral-900 text-sm pl-9 pr-4 py-2.5 rounded-full outline-none transition-all border border-transparent focus:border-neutral-200 focus:ring-2 focus:ring-neutral-50"
      />
    </form>
  )
}