// app/admin/layout.tsx
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar เมนูทางซ้าย */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-emerald-400 mb-8">🔧 Admin Panel</h2>
        
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition">
            📊 Dashboard
          </Link>
          <Link href="/admin/products" className="block px-4 py-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition">
            📦 Manage Products
          </Link>
          <Link href="/admin/orders" className="block px-4 py-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition">
            📑 View Orders
          </Link>
        </nav>

        <Link href="/" className="mt-auto block px-4 py-2 rounded text-red-400 hover:bg-red-900/20 text-sm">
          ← Back to Shop
        </Link>
      </aside>

      {/* เนื้อหาหลักทางขวา */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}