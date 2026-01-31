// app/admin/orders/page.tsx
import OrderStatusSelector from '@/components/OrderStatusSelector'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Customer Orders</h1>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase font-semibold border-b border-neutral-200">
            <tr>
              <th className="p-4 pl-6">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50 transition">
                <td className="p-4 pl-6">
                  <span className="font-mono text-sm text-neutral-900 font-medium">#{order.id.split('-')[0]}</span>
                  <div className="text-xs text-neutral-400 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('th-TH')}
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="font-bold text-neutral-900 text-sm">{order.user?.name || 'Guest'}</div>
                  <div className="text-xs text-neutral-500">{order.user?.email}</div>
                </td>

                <td className="p-4">
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="text-xs text-neutral-600 flex items-center gap-1">
                        <span className="font-bold text-black">1x</span>
                        {item.product.name}
                      </div>
                    ))}
                  </div>
                </td>

                <td className="p-4 font-bold text-neutral-900">
                  ฿{Number(order.total).toLocaleString()}
                </td>

                <td className="p-4">
                  <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                </td>
              </tr>
            ))}
            
            {orders.length === 0 && (
               <tr><td colSpan={5} className="p-12 text-center text-neutral-400">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}