// components/AdminDashboardClient.tsx
'use client'

import { DollarSign, ShoppingBag, Package, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

interface Props {
    stats: {
        revenue: number
        orders: number
        products: number
        pendingSlip: number
        toShip: number
        lowStock: number
    }
}

export default function AdminDashboardClient({ stats }: Props) {
    const { locale } = useLanguageStore()

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t('admin.dashboardTitle', locale)}</h1>
                <p className="text-txt-muted">{t('admin.dashboardDesc', locale)}</p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/admin/orders?filter=VERIFYING" className="bg-surface-card p-6 rounded-2xl border border-blue-200 dark:border-blue-900 shadow-sm hover:shadow-md transition group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <AlertCircle size={80} className="text-blue-600" />
                    </div>
                    <p className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-1">{t('admin.pendingSlip', locale)}</p>
                    <p className="text-4xl font-extrabold text-foreground">{stats.pendingSlip}</p>
                    <div className="mt-4 text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full inline-block">
                        {t('admin.actionRequired', locale)}
                    </div>
                </Link>

                <Link href="/admin/orders?filter=PAID" className="bg-surface-card p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900 shadow-sm hover:shadow-md transition group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <Package size={80} className="text-emerald-600" />
                    </div>
                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide mb-1">{t('admin.toShip', locale)}</p>
                    <p className="text-4xl font-extrabold text-foreground">{stats.toShip}</p>
                    <div className="mt-4 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full inline-block">
                        {t('admin.readyToShip', locale)}
                    </div>
                </Link>

                <Link href="/admin/products" className="bg-surface-card p-6 rounded-2xl border border-orange-200 dark:border-orange-900 shadow-sm hover:shadow-md transition group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <ShoppingBag size={80} className="text-orange-600" />
                    </div>
                    <p className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-1">{t('admin.lowStock', locale)}</p>
                    <p className="text-4xl font-extrabold text-foreground">{stats.lowStock}</p>
                    <div className="mt-4 text-xs font-bold bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full inline-block">
                        {t('admin.restockNow', locale)}
                    </div>
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-foreground text-surface-card p-6 rounded-2xl shadow-lg flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-txt-muted text-xs font-bold uppercase">{t('admin.totalRevenue', locale)}</p>
                            <h3 className="text-2xl font-bold mt-1">฿{stats.revenue.toLocaleString()}</h3>
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg"><DollarSign size={20} /></div>
                    </div>
                </div>

                <div className="bg-surface-card p-6 rounded-2xl border border-border-main shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-txt-muted text-xs font-bold uppercase">{t('admin.totalOrders', locale)}</p>
                            <h3 className="text-2xl font-bold mt-1 text-foreground">{stats.orders}</h3>
                        </div>
                        <div className="bg-surface-bg p-2 rounded-lg text-txt-muted"><ShoppingBag size={20} /></div>
                    </div>
                </div>

                <div className="bg-surface-card p-6 rounded-2xl border border-border-main shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-txt-muted text-xs font-bold uppercase">{t('admin.totalProducts', locale)}</p>
                            <h3 className="text-2xl font-bold mt-1 text-foreground">{stats.products}</h3>
                        </div>
                        <div className="bg-surface-bg p-2 rounded-lg text-txt-muted"><Package size={20} /></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
