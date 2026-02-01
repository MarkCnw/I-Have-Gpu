// app/admin/layout.tsx
import Link from 'next/link'
import { LayoutDashboard, DollarSign, Package, ClipboardList, ArrowLeft } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-emerald-400 mb-8 flex items-center gap-2">
           🔧 Admin Panel
        </h2>
        
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="px-4 py-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center gap-3">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          
          <Link href="/admin/finance" className="px-4 py-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center gap-3">
            <DollarSign size={18} /> Finance
          </Link>

          <Link href="/admin/products" className="px-4 py-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center gap-3">
            <Package size={18} /> Manage Products
          </Link>
          <Link href="/admin/orders" className="px-4 py-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center gap-3">
            <ClipboardList size={18} /> View Orders
          </Link>
        </nav>

        <Link href="/" className="mt-auto px-4 py-2 rounded text-red-400 hover:bg-red-900/20 text-sm flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto bg-[#F8F9FA] text-slate-900"> 
        {children}
      </main>
    </div>
  )
}