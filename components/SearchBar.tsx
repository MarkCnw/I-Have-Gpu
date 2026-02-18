// components/SearchBar.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale } = useLanguageStore()

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
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" size={18} />

      <input
        type="text"
        placeholder={t('search.placeholder', locale)}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-transparent text-foreground text-sm pl-10 pr-4 py-2.5 rounded-full outline-none transition-all border border-border-main focus:border-foreground placeholder:text-txt-muted"
      />
    </form>
  )
}