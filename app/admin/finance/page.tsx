// app/admin/finance/page.tsx
import { prisma } from '@/lib/prisma'
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react'
import AdminFinanceChart from '@/components/AdminFinanceChart'
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

  return {
    totalIncome: Number(totalIncome._sum.total) || 0,
    paidOrders,
    avgOrder,
    recentTransactions: recentTransactions.map(tx => ({
      ...tx,
      total: Number(tx.total),
      createdAt: tx.createdAt.toISOString(),
    })),
  }
}

export default async function AdminFinancePage() {
  const data = await getFinanceData()

  return <AdminFinanceClient data={data} />
}