// app/admin/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, ShoppingCart, Package, DollarSign, 
  Settings, LogOut, ChevronLeft, ChevronRight, Search 
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Global Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true)
        // จำลอง API Search (ของจริงต้องยิงไป API)
        // const res = await fetch(\`/api/admin/search?q=\${searchQuery}\`)
        // const data = await res.json()
        // setSearchResults(data)
        setIsSearching(false)
      } else {
        setSearchResults(null)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Products', icon: Package, path: '/admin/products' },
    { name: 'Finance', icon: DollarSign, path: '/admin/finance' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. Sidebar (ยืดหดได้) */}
      <aside 
        className={`bg-slate-900 text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {!collapsed && <span className="font-bold text-xl tracking-tight">iHAVEGPU <span className="text-slate-500 text-sm">Admin</span></span>}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative
                  ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon size={22} className={isActive ? 'text-white' : 'group-hover:text-white'} />
                {!collapsed && <span className="font-medium">{item.name}</span>}
                
                {/* Tooltip ตอนย่อ */}
                {collapsed && (
                  <div className="absolute left-full ml-4 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 pointer-events-none">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })} 
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut size={20} />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Top Bar + Global Search */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search orders, customers, products..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Search Dropdown Results */}
            {searchResults && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="text-xs font-bold text-slate-400 px-3 py-2">RESULTS</div>
                {/* Example Mock Items */}
                <div className="px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <p className="text-sm font-bold text-slate-800">Order #12345</p>
                  <p className="text-xs text-slate-500">Customer: John Doe</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                AD
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}