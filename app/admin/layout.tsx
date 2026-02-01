// app/admin/layout.tsx
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, DollarSign, LogOut, ArrowLeft } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-extrabold flex items-center gap-2">
            <span className="bg-black text-white px-2 py-1 rounded text-sm">ADMIN</span>
            <span className="text-slate-800">Panel</span>
          </h1>
        </div>
        
        <nav className="p-4 space-y-1">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase mb-2 mt-4">เมนูหลัก</p>
          
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-black rounded-lg transition font-medium">
            <LayoutDashboard size={20} /> ภาพรวมระบบ
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-black rounded-lg transition font-medium">
            <Package size={20} /> จัดการสินค้า
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-black rounded-lg transition font-medium">
            <ShoppingCart size={20} /> รายการคำสั่งซื้อ
          </Link>
          <Link href="/admin/finance" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-black rounded-lg transition font-medium">
            <DollarSign size={20} /> การเงิน & รายได้
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 bg-slate-50">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-black mb-3 px-2">
            <ArrowLeft size={16} /> กลับหน้าร้าน
          </Link>
          <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-red-600 py-2.5 rounded-lg font-bold hover:bg-red-50 transition text-sm">
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}