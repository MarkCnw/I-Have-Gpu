// app/admin/layout.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, DollarSign, MessageCircle, ChevronRight } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'การเงิน (Finance)', href: '/admin/finance', icon: DollarSign },
    { name: 'สินค้า (Products)', href: '/admin/products', icon: Package },
    { name: 'คำสั่งซื้อ (Orders)', href: '/admin/orders', icon: ShoppingCart },
    // ✅ เพิ่มเมนูนี้เข้าไป
    { name: 'แชทลูกค้า (Chat)', href: '/admin/chat', icon: MessageCircle },
  ]

  // ฟังก์ชันสร้าง Breadcrumb
  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    
    // แปลง segment เป็นชื่อที่อ่านง่าย (Mapping)
    const breadcrumbNameMap: Record<string, string> = {
      admin: 'Admin',
      finance: 'การเงิน',
      products: 'สินค้า',
      orders: 'คำสั่งซื้อ',
      chat: 'แชทลูกค้า',
      add: 'เพิ่มรายการ',
      edit: 'แก้ไข'
    }

    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-black transition-colors">หน้าแรก</Link>
        <ChevronRight size={14} className="text-slate-300" />
        
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`
          const isLast = index === pathSegments.length - 1
          const name = breadcrumbNameMap[segment] || segment // ถ้าไม่มีใน map ให้ใช้ชื่อเดิม

          return (
            <div key={href} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-bold text-slate-900 capitalize">{name}</span>
              ) : (
                <>
                  <Link href={href} className="hover:text-black transition-colors capitalize">
                    {name}
                  </Link>
                  <ChevronRight size={14} className="text-slate-300" />
                </>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-black text-white px-2 py-1 rounded text-sm">ADMIN</span>
            <span>Panel</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            // เช็คว่า path ปัจจุบัน "เริ่มด้วย" href ของเมนูนี้หรือไม่ (เพื่อให้ submenu active ด้วย)
            // แต่ยกเว้น Dashboard ที่ต้องตรงเป๊ะๆ
            const isActive = item.href === '/admin' 
              ? pathname === '/admin' 
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-black'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all font-medium">
            <Store size={20} /> กลับหน้าร้าน
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
          >
            <LogOut size={20} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        {/* ✅ แสดง Breadcrumb ที่นี่ */}
        {getBreadcrumbs()}
        
        {children}
      </main>
    </div>
  )
}