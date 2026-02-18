// components/AdminFinanceClient.tsx
'use client'

import { DollarSign, TrendingUp, CreditCard } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'
import AdminFinanceChart from '@/components/AdminFinanceChart'
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { useThemeStore } from '@/app/store/useThemeStore'

interface Props {
    data: {
        totalIncome: number
        paidOrders: number
        avgOrder: number
        recentTransactions: {
            id: string
            total: number
            status: string
            createdAt: string
            shippingName: string
        }[]
        orderStatusDistribution: { status: string; count: number }[]
        dailyRevenue: { date: string; total: number }[]
        topCategories: { category: string; revenue: number }[]
    }
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: '#f59e0b',
    VERIFYING: '#3b82f6',
    PAID: '#10b981',
    SHIPPED: '#8b5cf6',
    COMPLETED: '#06b6d4',
    CANCELLED: '#ef4444',
}

export default function AdminFinanceClient({ data }: Props) {
    const { locale } = useLanguageStore()
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const STATUS_LABEL: Record<string, string> = {
        PENDING: t('status.pending', locale),
        VERIFYING: t('status.verifying', locale),
        PAID: t('status.paid', locale),
        SHIPPED: t('status.shipped', locale),
        COMPLETED: t('status.completed', locale),
        CANCELLED: t('status.cancelled', locale),
    }

    const pieData = data.orderStatusDistribution.map(item => ({
        name: STATUS_LABEL[item.status] || item.status,
        value: item.count,
        color: STATUS_COLORS[item.status] || '#94a3b8',
    }))

    const textColor = isDark ? '#a3a3a3' : '#737373'
    const tooltipBg = isDark ? '#1a1a2e' : '#ffffff'
    const tooltipBorder = isDark ? '#333' : '#e2e8f0'
    const gridColor = isDark ? '#333' : '#f1f5f9'

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t('admin.financeDashboard', locale)}</h1>
                <p className="text-txt-muted">{t('admin.analyzeRevenue', locale)}</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-foreground text-surface-card p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold uppercase opacity-70">{t('admin.totalIncome', locale)}</p>
                            <h3 className="text-3xl font-bold mt-2">฿{data.totalIncome.toLocaleString()}</h3>
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg"><DollarSign size={20} /></div>
                    </div>
                </div>

                <div className="bg-surface-card p-6 rounded-2xl border border-border-main shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-txt-muted uppercase">{t('admin.paidOrders', locale)}</p>
                            <h3 className="text-3xl font-bold mt-2 text-foreground">{data.paidOrders}</h3>
                        </div>
                        <div className="bg-surface-bg p-2 rounded-lg text-txt-muted"><TrendingUp size={20} /></div>
                    </div>
                </div>

                <div className="bg-surface-card p-6 rounded-2xl border border-border-main shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-txt-muted uppercase">{t('admin.avgOrder', locale)}</p>
                            <h3 className="text-3xl font-bold mt-2 text-foreground">฿{Math.round(data.avgOrder).toLocaleString()}</h3>
                        </div>
                        <div className="bg-surface-bg p-2 rounded-lg text-txt-muted"><CreditCard size={20} /></div>
                    </div>
                </div>
            </div>

            {/* Revenue Trend (Area Chart) */}
            <div className="bg-surface-card p-6 rounded-2xl border border-border-main shadow-sm">
                <h2 className="font-bold text-xl mb-4 text-foreground">{t('admin.revenueTrends', locale)}</h2>
                <AdminFinanceChart data={
                    data.recentTransactions.reduce((acc: { date: string; total: number }[], tx) => {
                        const dateStr = new Date(tx.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })
                        const existing = acc.find(d => d.date === dateStr)
                        if (existing) existing.total += tx.total
                        else acc.push({ date: dateStr, total: tx.total })
                        return acc
                    }, [])
                } />
            </div>

            {/* Charts Row: Pie + Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Order Status Pie Chart */}
                <div className="bg-surface-card p-6 rounded-2xl border border-border-main shadow-sm">
                    <h2 className="font-bold text-xl mb-6 text-foreground">{t('admin.orderStatusDist', locale)}</h2>
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={4}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: `1px solid ${tooltipBorder}`,
                                        backgroundColor: tooltipBg,
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        color: isDark ? '#eee' : '#333',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                    }}
                                    formatter={(value: number | undefined) => [`${value || 0} รายการ`, '']}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    iconSize={10}
                                    wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: textColor }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Summary Stats under Pie */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        {pieData.slice(0, 3).map((item) => (
                            <div key={item.name} className="text-center p-3 rounded-xl bg-surface-bg">
                                <div className="text-2xl font-bold text-foreground">{item.value}</div>
                                <div className="text-xs text-txt-muted font-medium mt-1">{item.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Daily Revenue Bar Chart */}
                <div className="bg-surface-card p-6 rounded-2xl border border-border-main shadow-sm">
                    <h2 className="font-bold text-xl mb-6 text-foreground">{t('admin.dailyRevenue', locale)}</h2>
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={data.dailyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: textColor, fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: textColor, fontSize: 12 }}
                                    tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: `1px solid ${tooltipBorder}`,
                                        backgroundColor: tooltipBg,
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        color: isDark ? '#eee' : '#333',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                    }}
                                    formatter={(value: number | undefined) => [`฿${Number(value || 0).toLocaleString()}`, t('admin.revenue', locale)]}
                                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="#8b5cf6"
                                    radius={[8, 8, 0, 0]}
                                    maxBarSize={48}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Total in period */}
                    <div className="mt-4 p-4 rounded-xl bg-surface-bg flex items-center justify-between">
                        <span className="text-sm font-medium text-txt-muted">{t('admin.last7Days', locale)}</span>
                        <span className="text-lg font-bold text-foreground">
                            ฿{data.dailyRevenue.reduce((sum, d) => sum + d.total, 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Top Categories */}
            {data.topCategories.length > 0 && (
                <div className="bg-surface-card p-6 rounded-2xl border border-border-main shadow-sm">
                    <h2 className="font-bold text-xl mb-6 text-foreground">{t('admin.topCategories', locale)}</h2>
                    <div className="space-y-4">
                        {data.topCategories.map((cat, idx) => {
                            const maxRevenue = data.topCategories[0]?.revenue || 1
                            const percentage = Math.round((cat.revenue / maxRevenue) * 100)
                            const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4', '#ef4444']
                            return (
                                <div key={cat.category} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[idx % colors.length] }} />
                                            <span className="text-sm font-bold text-foreground">{cat.category}</span>
                                        </div>
                                        <span className="text-sm font-bold text-foreground">฿{cat.revenue.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2.5 bg-surface-bg rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${percentage}%`, backgroundColor: colors[idx % colors.length] }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Recent Transactions */}
            <div className="bg-surface-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border-main">
                    <h2 className="font-bold text-xl text-foreground">{t('admin.recentTx', locale)}</h2>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-surface-bg text-txt-muted font-bold border-b border-border-main">
                        <tr>
                            <th className="p-4">{t('admin.orderId', locale)}</th>
                            <th className="p-4">{t('admin.customer', locale)}</th>
                            <th className="p-4">{t('admin.amount', locale)}</th>
                            <th className="p-4">{t('admin.status', locale)}</th>
                            <th className="p-4">{t('admin.date', locale)}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main">
                        {data.recentTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-surface-bg transition">
                                <td className="p-4 font-mono text-foreground">{tx.id.split('-')[0]}</td>
                                <td className="p-4 font-bold text-foreground">{tx.shippingName}</td>
                                <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">฿{tx.total.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400">
                                        {STATUS_LABEL[tx.status] || tx.status}
                                    </span>
                                </td>
                                <td className="p-4 text-txt-muted text-xs">
                                    {new Date(tx.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
