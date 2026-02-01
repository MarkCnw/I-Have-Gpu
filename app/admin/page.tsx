// app/admin/page.tsx
import { prisma } from '@/lib/prisma'
import { DollarSign, ShoppingBag, Package, AlertCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] } }
  })

  const totalOrders = await prisma.order.count()
  const totalProducts = await prisma.product.count()
  
  // Action Items
  const pendingSlip = await prisma.order.count({ where: { status: 'VERIFYING' } })
  const toShip = await prisma.order.count({ where: { status: 'PAID' } })
  const lowStock = await prisma.product.count({ where: { stock: { lte: 5 } } })

  return { 
    revenue: totalRevenue._sum.total || 0,
    orders: totalOrders,
    products: totalProducts,
    pendingSlip,
    toShip,
    lowStock
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">ภาพรวมระบบ (Dashboard)</h1>
        <p className="text-slate-500">สรุปข้อมูลร้านค้าและสิ่งที่ต้องทำวันนี้</p>
      </div>

      {/* --- Action Cards (สิ่งที่ต้องทำด่วน) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/orders?filter=VERIFYING" className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition group relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
            <AlertCircle size={80} className="text-blue-600" />
          </div>
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-1">รอตรวจสลิป</p>
          <p className="text-4xl font-extrabold text-slate-900">{stats.pendingSlip}</p>
          <div className="mt-4 text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full inline-block">
            ต้องดำเนินการทันที
          </div>
        </Link>

        <Link href="/admin/orders?filter=PAID" className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition group relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
            <Package size={80} className="text-emerald-600" />
          </div>
          <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide mb-1">รอจัดส่งสินค้า</p>
          <p className="text-4xl font-extrabold text-slate-900">{stats.toShip}</p>
          <div className="mt-4 text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full inline-block">
            พร้อมส่ง
          </div>
        </Link>

        <Link href="/admin/products" className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition group relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
            <ShoppingBag size={80} className="text-orange-600" />
          </div>
          <p className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-1">สินค้าใกล้หมด</p>
          <p className="text-4xl font-extrabold text-slate-900">{stats.lowStock}</p>
          <div className="mt-4 text-xs font-bold bg-orange-50 text-orange-700 px-3 py-1 rounded-full inline-block">
            เติมสต็อกด่วน
          </div>
        </Link>
      </div>

      {/* --- Stat Cards (สถิติรวม) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase">รายได้รวมทั้งหมด</p>
              <h3 className="text-2xl font-bold mt-1">฿{Number(stats.revenue).toLocaleString()}</h3>
            </div>
            <div className="bg-white/10 p-2 rounded-lg"><DollarSign size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase">คำสั่งซื้อทั้งหมด</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-900">{stats.orders}</h3>
            </div>
            <div className="bg-slate-100 p-2 rounded-lg text-slate-600"><ShoppingBag size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase">สินค้าทั้งหมด</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-900">{stats.products}</h3>
            </div>
            <div className="bg-slate-100 p-2 rounded-lg text-slate-600"><Package size={20} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}