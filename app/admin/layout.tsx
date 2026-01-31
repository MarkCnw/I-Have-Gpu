// app/admin/layout.tsx
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 flex font-sans">
      {/* Sidebar: Clean White Style */}
      <aside className="w-64 bg-white border-r border-neutral-200 p-6 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10">
           <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-bold italic">i</div>
           <h2 className="text-xl font-bold tracking-tight">Admin<span className="text-neutral-400 font-normal">Panel</span></h2>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-black transition">
            <span>📊</span> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-black transition">
            <span>📦</span> Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-black transition">
            <span>📑</span> Orders
          </Link>
        </nav>

        <Link href="/" className="mt-auto flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition">
          ← Back to Store
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  )
}