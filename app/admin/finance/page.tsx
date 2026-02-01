// app/admin/finance/page.tsx
import { prisma } from '@/lib/prisma'
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react'
import AdminFinanceChart from '@/components/AdminFinanceChart'

// 🔥 เพิ่มตัวแปลงภาษาตรงนี้
const STATUS_LABEL: Record<string, string> = {
  PENDING: 'รอชำระเงิน',
  VERIFYING: 'รอตรวจสอบ',
  PAID: 'ชำระแล้ว',
  SHIPPED: 'จัดส่งแล้ว',
  CANCELLED: 'ยกเลิก',
  COMPLETED: 'สำเร็จ'
}

async function getFinanceData() {
  const paidOrders = await prisma.order.findMany({
    where: { status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] } },
    orderBy: { createdAt: 'desc' },
    select: { id: true, total: true, createdAt: true, status: true }
  })

  const totalRevenue = paidOrders.reduce((acc, order) => acc + Number(order.total), 0)
  const totalOrders = paidOrders.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Prepare Chart Data
  const chartMap = new Map()
  paidOrders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })
    const current = chartMap.get(date) || 0
    chartMap.set(date, current + Number(order.total))
  })
  
  const chartData = Array.from(chartMap, ([date, total]) => ({ date, total })).reverse()

  return { totalRevenue, totalOrders, avgOrderValue, paidOrders, chartData }
}

export default async function FinancePage() {
  const { totalRevenue, totalOrders, avgOrderValue, paidOrders, chartData } = await getFinanceData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">แดชบอร์ดการเงิน</h1>
        <p className="text-slate-500">วิเคราะห์รายได้และยอดขาย</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-500 text-white p-6 rounded-2xl shadow-lg shadow-emerald-200">
           <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg"><DollarSign size={20}/></div>
              <span className="font-bold text-emerald-100">รายรับรวม</span>
           </div>
           <p className="text-3xl font-extrabold">฿{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><CreditCard size={20}/></div>
              <span className="font-bold text-slate-500">ออเดอร์ที่ชำระแล้ว</span>
           </div>
           <p className="text-3xl font-extrabold text-slate-800">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><TrendingUp size={20}/></div>
              <span className="font-bold text-slate-500">ยอดเฉลี่ย/ออเดอร์</span>
           </div>
           <p className="text-3xl font-extrabold text-slate-800">฿{avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-lg mb-6">แนวโน้มรายได้ (Revenue Trends)</h3>
        <div className="h-[300px] w-full">
           <AdminFinanceChart data={chartData} />
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
           <h3 className="font-bold text-lg">รายการล่าสุด</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold">
            <tr>
              <th className="p-4">วันที่</th>
              <th className="p-4">รหัสออเดอร์</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4 text-right">ยอดเงิน</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {paidOrders.slice(0, 5).map((order: any) => (
              <tr key={order.id}>
                <td className="p-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString('th-TH')}</td>
                <td className="p-4 font-mono">#{order.id.split('-')[0]}</td>
                <td className="p-4">
                  {/* 🔥 แก้ไขตรงนี้: เรียกใช้ STATUS_LABEL เพื่อแสดงภาษาไทย */}
                  <span className={`px-2 py-1 rounded text-xs font-bold
                    ${order.status === 'PAID' ? 'bg-indigo-100 text-indigo-700' :
                      order.status === 'SHIPPED' ? 'bg-green-100 text-green-700' :
                      order.status === 'COMPLETED' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </td>
                <td className="p-4 text-right font-bold text-slate-800">+฿{Number(order.total).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}