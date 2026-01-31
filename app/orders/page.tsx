// app/orders/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth' // อย่าลืม Import auth เพื่อดึง user จริงๆ
import { ScrollText, ArrowLeft, ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
     return <div className="p-8 text-center">Please Login</div>
  }

  // ใช้ user จาก session แทน hardcode
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return <div className="p-8 text-white">User not found</div>
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-emerald-400 flex items-center gap-3">
            <ScrollText /> My Orders
          </h1>
          <Link href="/" className="text-slate-400 hover:text-white transition flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700 flex flex-col items-center">
            <ShoppingBag size={48} className="text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">ยังไม่มีรายการสั่งซื้อ</p>
            <Link href="/" className="text-emerald-400 hover:underline mt-2 inline-block">
              ไปช้อปกันเลย!
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
                <div className="bg-slate-900/50 p-4 flex flex-wrap justify-between items-center border-b border-slate-700 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Order ID</p>
                    <p className="font-mono text-sm text-slate-300">{order.id.split('-')[0]}...</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Date</p>
                    <p className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                      ${order.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}
                    `}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-slate-700/30 p-2 rounded-lg">
                      <div className="w-12 h-12 bg-white rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.product.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                        ) : (
                          <ShoppingBag size={20} className="text-neutral-400" />
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className="font-medium text-sm text-slate-200 line-clamp-1">{item.product.name}</h4>
                        <p className="text-xs text-slate-400">{item.product.category}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-400">
                          ฿{Number(item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-emerald-900/20 border-t border-slate-700 flex justify-between items-center">
                  <span className="text-sm text-slate-400">Total Amount</span>
                  <span className="text-2xl font-bold text-white">
                    ฿{Number(order.total).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}