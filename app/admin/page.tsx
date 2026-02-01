// app/admin/page.tsx
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const totalOrders = await prisma.order.count()
  const totalProducts = await prisma.product.count()
  
  const allOrders = await prisma.order.findMany({ select: { total: true } })
  const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.total), 0)

  const recentProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Dashboard Overview</h1>

      {/* Stats Cards: Clean White Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-neutral-900">฿{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-neutral-900">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-2">Products</p>
          <p className="text-3xl font-bold text-neutral-900">{totalProducts}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100">
           <h2 className="text-lg font-bold text-neutral-900">Recently Added</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {recentProducts.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50 transition">
                <td className="px-6 py-4 font-medium text-neutral-900">{p.name}</td>
                <td className="px-6 py-4">
                  <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded text-xs font-medium border border-neutral-200">{p.category}</span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-neutral-900">฿{Number(p.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}