// components/ProfileDropdown.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User, Package, Heart, Shield, LogOut, ChevronDown, Sun, Moon } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useThemeStore } from '@/app/store/useThemeStore'
import { t } from '@/lib/i18n'

export default function ProfileDropdown() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { locale } = useLanguageStore()
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

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

          {/* Dark Mode Toggle */}
         <div className="px-4 py-2.5 border-t border-border-light flex items-center justify-between">
  <div className="flex items-center gap-3 text-sm text-txt-secondary">
    {isDark ? <Moon size={16} /> : <Sun size={16} />}
    <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
  </div>
  
  <button
    onClick={toggleTheme}
    // รวมคลาสของรางสวิทช์มาไว้ที่ปุ่มเลย ลบขอบสีขาวทิ้งไป
    className={`relative w-14 h-7 rounded-full overflow-hidden shadow-[inset_0_2px_5px_rgba(0,0,0,0.4)] transition-colors duration-500 ease-in-out focus:outline-none ${
      isDark ? 'bg-[#1e293b]' : 'bg-[#4ca1d6]'
    }`}
    aria-label="Toggle dark mode"
  >

    {/* --- พื้นหลัง Light Mode (วงซ้อนคลื่นแสง) --- */}
    <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute top-[-20%] left-[10%] w-14 h-14 bg-white/10 rounded-full"></div>
      <div className="absolute top-[10%] left-[30%] w-14 h-14 bg-white/10 rounded-full"></div>
    </div>

    {/* --- พื้นหลัง Dark Mode (วงซ้อน) --- */}
    <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute top-[-20%] right-[10%] w-14 h-14 bg-white/5 rounded-full"></div>
      <div className="absolute top-[10%] right-[30%] w-14 h-14 bg-white/5 rounded-full"></div>
    </div>

    {/* --- Dark Mode: ดวงดาว --- */}
    <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${isDark ? 'translate-y-0 opacity-100 delay-100' : '-translate-y-4 opacity-0'}`}>
      <svg className="absolute top-1 left-2 w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" /></svg>
      <svg className="absolute top-3.5 left-6 w-1.5 h-1.5 text-white/80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" /></svg>
      <div className="absolute top-4 left-3 w-[1px] h-[1px] bg-white rounded-full"></div>
      <div className="absolute top-1.5 left-8 w-[1.5px] h-[1.5px] bg-white rounded-full"></div>
    </div>

    {/* --- Light Mode: เมฆสีขาว --- */}
    <div className={`absolute -bottom-1 -right-1 w-10 h-6 transition-transform duration-500 ease-in-out ${isDark ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100 delay-100'}`}>
      <div className="absolute bottom-0 right-1 w-4 h-4 bg-white rounded-full"></div>
      <div className="absolute bottom-0 right-3 w-5 h-5 bg-white rounded-full"></div>
      <div className="absolute bottom-1 right-6 w-4 h-4 bg-white rounded-full"></div>
      <div className="absolute -bottom-1 left-0 w-8 h-4 bg-white rounded-full"></div>
    </div>

    {/* --- Dark Mode: เมฆสีเทาเข้ม --- */}
    <div className={`absolute -bottom-1 -right-1 w-10 h-6 transition-transform duration-500 ease-in-out ${isDark ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-6 opacity-0'}`}>
      <div className="absolute bottom-0 right-1 w-4 h-4 bg-[#334155] rounded-full"></div>
      <div className="absolute bottom-0 right-3 w-5 h-5 bg-[#475569] rounded-full"></div>
      <div className="absolute bottom-1 right-6 w-4 h-4 bg-[#64748b] rounded-full"></div>
    </div>

    {/* --- ตัวเลื่อน (Knob) --- */}
    <div
      className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full z-10 transition-transform duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${
        isDark ? 'translate-x-7' : 'translate-x-0'
      }`}
    >
      {/* พระอาทิตย์ */}
      <div className={`absolute inset-0 bg-[#fbbf24] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-500 ${isDark ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}></div>

      {/* พระจันทร์ */}
      <div className={`absolute inset-0 bg-[#cbd5e1] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-all duration-500 overflow-hidden ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}>
        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#94a3b8] rounded-full shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.3)]"></div>
        <div className="absolute bottom-1 left-1 w-2 h-2 bg-[#94a3b8] rounded-full shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.3)]"></div>
        <div className="absolute top-2 left-1 w-1 h-1 bg-[#94a3b8] rounded-full shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.3)]"></div>
        <div className="absolute bottom-1.5 right-1.5 w-1 h-1 bg-[#94a3b8] rounded-full shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.3)]"></div>
      </div>
    </div>

  </button>
</div>

          {/* Sign Out */}
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition flex items-center gap-3 border-t border-border-light">
            <LogOut size={16} /> {t('profileDropdown.logout', locale)}
          </button>
        </div>
      )}
    </div>
  )
}