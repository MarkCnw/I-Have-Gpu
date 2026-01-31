// app/admin/orders/page.tsx
import OrderStatusSelector from '@/components/OrderStatusSelector'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  // ดึง Order ทั้งหมดในระบบ (รวมข้อมูล User และ Items)
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }, // ล่าสุดขึ้นก่อน
    include: {
      user: true, // ดึงชื่อคนสั่ง
      items: {
        include: { product: true } // ดึงรายละเอียดสินค้าที่สั่ง
      }
    }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📑 Customer Orders</h1>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 text-sm uppercase">
            <tr>
              <th className="p-4 border-b border-slate-800">Order ID</th>
              <th className="p-4 border-b border-slate-800">Customer</th>
              <th className="p-4 border-b border-slate-800">Items</th>
              <th className="p-4 border-b border-slate-800">Total</th>
              <th className="p-4 border-b border-slate-800">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-800/50 transition">
                <td className="p-4 font-mono text-sm text-slate-400">
                  {order.id.split('-')[0]}...
                  <div className="text-xs text-slate-600">
                    {new Date(order.createdAt).toLocaleDateString('th-TH')}
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="font-bold text-white">{order.user?.name || 'Unknown'}</div>
                  <div className="text-xs text-slate-500">{order.user?.email}</div>
                </td>

                <td className="p-4">
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="text-sm text-slate-300 flex items-center gap-2">
                        <span className="text-emerald-500">1x</span>
                        {item.product.name}
                      </div>
                    ))}
                  </div>
                </td>

                <td className="p-4 font-bold text-emerald-400">
                  ฿{Number(order.total).toLocaleString()}
                </td>

                <td className="p-4">
  <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
</td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No orders found yet.
          </div>
        )}
      </div>
    </div>
  )
}