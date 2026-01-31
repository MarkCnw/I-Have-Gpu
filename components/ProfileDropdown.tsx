// components/ProfileDropdown.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileDropdown({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ปิด Dropdown เมื่อคลิกที่อื่น
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
      {/* ปุ่มรูปโปรไฟล์ */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-200 hover:border-red-500 transition shadow-sm overflow-hidden">
          {/* ถ้ามีรูปใช้รูป ไม่มีใช้อักษรย่อ */}
          {user.image ? (
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name?.substring(0, 2).toUpperCase()
          )}
        </div>
      </button>

      {/* เมนู Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-slate-50 mb-1">
            <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>

          <Link 
            href="/orders" 
            className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-red-600 transition flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            📦 ประวัติการสั่งซื้อ
          </Link>
          
          <Link 
            href="/favorites" 
            className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-red-600 transition flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            ❤️ รายการที่ชอบ
          </Link>

          {user.role === 'ADMIN' && (
            <Link 
              href="/admin" 
              className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-red-600 transition flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              🔧 ระบบหลังบ้าน
            </Link>
          )}

          <div className="border-t border-slate-50 mt-1 pt-1">
            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
            >
              🚪 ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  )
}