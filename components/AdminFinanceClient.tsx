// components/AdminFinanceClient.tsx
'use client'

import { DollarSign, TrendingUp, CreditCard } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'
import AdminFinanceChart from '@/components/AdminFinanceChart'

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
    }
}

export default function AdminFinanceClient({ data }: Props) {
    const { locale } = useLanguageStore()

    const STATUS_LABEL: Record<string, string> = {
        PAID: t('status.paid', locale),
        SHIPPED: t('status.shipped', locale),
        COMPLETED: t('status.completed', locale),
    }

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

            {/* Chart */}
            <div className="bg-surface-card p-6 rounded-2xl border border-border-main shadow-sm">
                <h2 className="font-bold text-xl mb-4 text-foreground">{t('admin.revenueTrends', locale)}</h2>
                <AdminFinanceChart />
            </div>

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
