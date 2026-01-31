// app/admin/finance/page.tsx
import { prisma } from '@/lib/prisma'
import AdminFinanceChart from '@/components/AdminFinanceChart'

export const dynamic = 'force-dynamic'

export default async function AdminFinancePage() {
  // 1. ดึงข้อมูลออเดอร์ที่จ่ายเงินแล้ว (ไม่เอา Cancelled / Pending)
  const orders = await prisma.order.findMany({
    where: {
      status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] }
    },
    orderBy: { createdAt: 'asc' }
  })

  // 2. คำนวณยอดรวม (Stats Cards)
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0)
  const totalOrders = orders.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // 3. เตรียมข้อมูลสำหรับกราฟ (Group by Date)
  const salesMap = new Map<string, number>()
  
  orders.forEach(order => {
    // แปลงวันที่เป็น YYYY-MM-DD
    const date = new Date(order.createdAt).toISOString().split('T')[0]
    const currentTotal = salesMap.get(date) || 0
    salesMap.set(date, currentTotal + Number(order.total))
  })

  // แปลง Map เป็น Array เพื่อส่งให้ Recharts
  // (ถ้าข้อมูลจริงน้อย อาจจะดูแหว่งๆ แนะนำให้ลองสั่งซื้อเพิ่มหลายๆ วันครับ)
  const chartData = Array.from(salesMap.entries()).map(([date, total]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total
  }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-slate-800">💰 Financial Overview</h1>
      <p className="text-slate-500 mb-8">วิเคราะห์รายได้และกระแสเงินสดของร้านค้า</p>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-red-100"></div>
          <p className="text-slate-500 text-sm uppercase font-bold tracking-wider relative z-10">Total Revenue</p>
          <h2 className="text-4xl font-black text-slate-800 mt-2 relative z-10">
            ฿{totalRevenue.toLocaleString()}
          </h2>
          <p className="text-emerald-500 text-xs mt-2 flex items-center font-bold">
            ▲ +12.5% <span className="text-slate-400 font-normal ml-1">from last month</span>
          </p>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-blue-100"></div>
          <p className="text-slate-500 text-sm uppercase font-bold tracking-wider relative z-10">Paid Orders</p>
          <h2 className="text-4xl font-black text-slate-800 mt-2 relative z-10">
            {totalOrders}
          </h2>
          <p className="text-slate-400 text-xs mt-2">Successful transactions</p>
        </div>

        {/* Card 3: Average Order Value */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-emerald-100"></div>
          <p className="text-slate-500 text-sm uppercase font-bold tracking-wider relative z-10">Avg. Order Value</p>
          <h2 className="text-4xl font-black text-slate-800 mt-2 relative z-10">
            ฿{Math.round(avgOrderValue).toLocaleString()}
          </h2>
          <p className="text-slate-400 text-xs mt-2">Per transaction</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <AdminFinanceChart data={chartData} />
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-700">💳 Recent Transactions</h3>
          <button className="text-xs text-red-600 font-bold hover:underline">Export CSV</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
            {orders.slice(-5).reverse().map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-mono text-xs">{order.id.split('-')[0]}...</td>
                <td className="p-4">
                  {new Date(order.createdAt).toLocaleDateString('th-TH', { 
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                  })}
                </td>
                <td className="p-4">
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right font-bold text-slate-800">
                  +฿{Number(order.total).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}