// app/admin/finance/page.tsx
import { prisma } from '@/lib/prisma'
import AdminFinanceClient from '@/components/AdminFinanceClient'

async function getFinanceData() {
  const totalIncome = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] } }
  })

  const paidOrders = await prisma.order.count({
    where: { status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] } }
  })

  const avgOrder = paidOrders > 0 ? (Number(totalIncome._sum.total) || 0) / paidOrders : 0

  const recentTransactions = await prisma.order.findMany({
    where: { status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] } },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      total: true,
      status: true,
      createdAt: true,
      shippingName: true,
    }
  })

  // ===== NEW: Order Status Distribution (Pie Chart) =====
  const allStatuses = ['PENDING', 'VERIFYING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'] as const
  const statusCounts = await Promise.all(
    allStatuses.map(async (status) => ({
      status,
      count: await prisma.order.count({ where: { status } })
    }))
  )
  const orderStatusDistribution = statusCounts.filter(s => s.count > 0)

  // ===== NEW: Daily Revenue (Bar Chart) - Last 7 days =====
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const recentOrders = await prisma.order.findMany({
    where: {
      status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] },
      createdAt: { gte: sevenDaysAgo }
    },
    select: { total: true, createdAt: true }
  })

  // Aggregate by day
  const dailyRevenueMap = new Map<string, number>()
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })
    dailyRevenueMap.set(key, 0)
  }
  for (const order of recentOrders) {
    const key = order.createdAt.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })
    if (dailyRevenueMap.has(key)) {
      dailyRevenueMap.set(key, (dailyRevenueMap.get(key) || 0) + Number(order.total))
    }
  }
  const dailyRevenue = Array.from(dailyRevenueMap.entries()).map(([date, total]) => ({ date, total }))

  // ===== NEW: Top Categories by Revenue =====
  const categoryRevenue = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { price: true, quantity: true },
    orderBy: { _sum: { price: 'desc' } },
    take: 20,
  })

  const productIds = categoryRevenue.map(c => c.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, category: true }
  })

  const categoryMap = new Map<string, number>()
  for (const item of categoryRevenue) {
    const product = products.find(p => p.id === item.productId)
    const cat = product?.category || 'Other'
    const revenue = Number(item._sum.price || 0) * (item._sum.quantity || 1)
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + revenue)
  }
  const topCategories = Array.from(categoryMap.entries())
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6)

  return {
    totalIncome: Number(totalIncome._sum.total) || 0,
    paidOrders,
    avgOrder,
    recentTransactions: recentTransactions.map(tx => ({
      ...tx,
      total: Number(tx.total),
      shippingName: tx.shippingName || '',
      createdAt: tx.createdAt.toISOString(),
    })),
    orderStatusDistribution,
    dailyRevenue,
    topCategories,
  }
}

export default async function AdminFinancePage() {
  const data = await getFinanceData()

  return <AdminFinanceClient data={data} />
}