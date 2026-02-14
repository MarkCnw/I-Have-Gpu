// components/ProfileDropdown.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User, Package, Heart, Shield, LogOut, ChevronDown } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function ProfileDropdown() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { locale } = useLanguageStore()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-red-600 transition"
      >
        <div className="w-8 h-8 bg-foreground text-surface-card rounded-full flex items-center justify-center text-xs font-bold overflow-hidden">
          {user?.image ? <img src={user.image} className="w-full h-full object-cover" /> : user?.name?.substring(0, 2).toUpperCase()}
        </div>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-surface-card border border-border-main rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border-light">
            <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-txt-muted truncate">{user?.email}</p>
          </div>

          {/* Menu Links */}
          <Link href="/profile" onClick={() => setOpen(false)} className="px-4 py-2.5 text-sm text-txt-secondary hover:bg-surface-bg hover:text-foreground transition flex items-center gap-3">
            <User size={16} /> {t('profileDropdown.myAccount', locale)}
          </Link>
          <Link href="/orders" onClick={() => setOpen(false)} className="px-4 py-2.5 text-sm text-txt-secondary hover:bg-surface-bg hover:text-foreground transition flex items-center gap-3">
            <Package size={16} /> {t('profileDropdown.myOrders', locale)}
          </Link>
          <Link href="/favorites" onClick={() => setOpen(false)} className="px-4 py-2.5 text-sm text-txt-secondary hover:bg-surface-bg hover:text-foreground transition flex items-center gap-3">
            <Heart size={16} /> {t('profileDropdown.favorites', locale)}
          </Link>

          {/* Admin Link (if applicable) */}
          {user?.role === 'ADMIN' && (
            <Link href="/admin" onClick={() => setOpen(false)} className="px-4 py-2.5 text-sm text-txt-secondary hover:bg-surface-bg hover:text-foreground transition flex items-center gap-3 border-t border-border-light">
              <Shield size={16} /> {t('profileDropdown.admin', locale)}
            </Link>
          )}

          {/* Sign Out */}
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-3 border-t border-border-light">
            <LogOut size={16} /> {t('profileDropdown.logout', locale)}
          </button>
        </div>
      )}
    </div>
  )
}