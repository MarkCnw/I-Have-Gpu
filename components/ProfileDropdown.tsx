// components/ProfileDropdown.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
// Import ไอคอน
import { User, Heart, Package, LogOut, Settings } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileDropdown({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="w-9 h-9 rounded-full bg-surface-bg flex items-center justify-center text-foreground font-bold text-xs border border-border-main hover:border-foreground transition shadow-sm overflow-hidden">
          {user.image ? (
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name?.substring(0, 2).toUpperCase()
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-surface-card rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border-light py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-border-light mb-1">
            <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-txt-muted truncate">{user.email}</p>
          </div>

          <Link
            href="/profile"
            className="px-4 py-2.5 text-sm text-txt-secondary hover:bg-surface-bg hover:text-foreground transition flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} /> บัญชีของฉัน
          </Link>

          <Link
            href="/orders"
            className="px-4 py-2.5 text-sm text-txt-secondary hover:bg-surface-bg hover:text-foreground transition flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <Package size={16} /> คำสั่งซื้อของฉัน
          </Link>

          <Link
            href="/favorites"
            className="px-4 py-2.5 text-sm text-txt-secondary hover:bg-surface-bg hover:text-foreground transition flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <Heart size={16} /> รายการสินค้าโปรด
          </Link>

          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="px-4 py-2.5 text-sm text-txt-secondary hover:bg-surface-bg hover:text-foreground transition flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} /> ระบบหลังบ้าน
            </Link>
          )}

          <div className="border-t border-border-light mt-1 pt-1">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-3"
            >
              <LogOut size={16} /> ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  )
}