// app/admin/page.tsx
import { prisma } from '@/lib/prisma'

// บังคับโหลดใหม่เสมอ จะได้เห็นยอดล่าสุด
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  // 1. ดึงข้อมูลสรุป
  const totalOrders = await prisma.order.count()
  const totalProducts = await prisma.product.count()
  
  // 2. คำนวณยอดเงินรวม (Sum)
  const allOrders = await prisma.order.findMany({ select: { total: true } })
  const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.total), 0)

  // 3. ดึงสินค้า 5 ชิ้นล่าสุด
  const recentProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">📊 Dashboard Overview</h1>

      {/* การ์ดสรุปตัวเลข (Stats Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm uppercase">Total Revenue</p>
          <p className="text-3xl font-bold text-emerald-400">฿{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm uppercase">Total Orders</p>
          <p className="text-3xl font-bold text-blue-400">{totalOrders}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm uppercase">Products in Stock</p>
          <p className="text-3xl font-bold text-purple-400">{totalProducts}</p>
        </div>
      </div>

      {/* ตารางสินค้าล่าสุด */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold mb-4">🆕 Recently Added Products</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-sm">
              <th className="py-2">Name</th>
              <th className="py-2">Category</th>
              <th className="py-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.map((p) => (
              <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition">
                <td className="py-3">{p.name}</td>
                <td className="py-3">
                  <span className="bg-slate-800 px-2 py-1 rounded text-xs">{p.category}</span>
                </td>
                <td className="py-3 text-right font-mono">฿{Number(p.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}