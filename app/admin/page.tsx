// app/admin/page.tsx
import { prisma } from '@/lib/prisma'
import { DollarSign, ShoppingBag, Package, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import AdminDashboardClient from '@/components/AdminDashboardClient'

async function getStats() {
  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] } }
  })

  const totalOrders = await prisma.order.count()
  const totalProducts = await prisma.product.count()

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

  return <AdminDashboardClient stats={{
    revenue: Number(stats.revenue),
    orders: stats.orders,
    products: stats.products,
    pendingSlip: stats.pendingSlip,
    toShip: stats.toShip,
    lowStock: stats.lowStock
  }} />
}