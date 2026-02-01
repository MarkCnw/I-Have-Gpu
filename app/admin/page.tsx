// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Clock, Truck, AlertTriangle, TrendingUp, Calendar } from 'lucide-react'
import AdminFinanceChart from '@/components/AdminFinanceChart'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingVerify: 0,
    toShip: 0,
    lowStock: 0,
    totalSales: 0
  })
  const [dateRange, setDateRange] = useState('7D') // 7D, 30D, TODAY

  useEffect(() => {
    // Fetch stats logic here
    // Mock Data
    setStats({ pendingVerify: 5, toShip: 12, lowStock: 3, totalSales: 154000 })
  }, [dateRange])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back! Here's what needs your attention.</p>
      </div>

      {/* 1. Action Cards (งานด่วน) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: รอตรวจสลิป (สีส้ม) */}
        <Link href="/admin/orders?status=VERIFYING" className="bg-orange-50 border border-orange-100 p-6 rounded-2xl hover:shadow-md transition group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl group-hover:scale-110 transition">
              <Clock size={24} />
            </div>
            {stats.pendingVerify > 0 && <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">{stats.pendingVerify} PENDING</span>}
          </div>
          <h3 className="text-slate-500 font-medium text-sm">Waiting for Verification</h3>
          <p className="text-2xl font-bold text-orange-900 mt-1">{stats.pendingVerify} Orders</p>
        </Link>

        {/* Card 2: ต้องแพ็คส่ง (สีแดง - ด่วนสุด) */}
        <Link href="/admin/orders?status=PAID" className="bg-red-50 border border-red-100 p-6 rounded-2xl hover:shadow-md transition group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl group-hover:scale-110 transition">
              <Truck size={24} />
            </div>
            {stats.toShip > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{stats.toShip} TO SHIP</span>}
          </div>
          <h3 className="text-slate-500 font-medium text-sm">Ready to Ship</h3>
          <p className="text-2xl font-bold text-red-900 mt-1">{stats.toShip} Orders</p>
        </Link>

        {/* Card 3: สินค้าใกล้หมด (สีเหลือง/เทา) */}
        <Link href="/admin/products?filter=lowstock" className="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl hover:shadow-md transition group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl group-hover:scale-110 transition">
              <AlertTriangle size={24} />
            </div>
            <span className="text-slate-400 text-xs">Threshold: &lt; 5</span>
          </div>
          <h3 className="text-slate-500 font-medium text-sm">Low Stock Items</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.lowStock} Items</p>
        </Link>
      </div>

      {/* 2. Sales Chart with Filter */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <TrendingUp className="text-emerald-500" /> Sales Performance
          </h2>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {['TODAY', '7D', '30D'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${dateRange === range ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-black'}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[300px]">
           <AdminFinanceChart range={dateRange} />
        </div>
      </div>
    </div>
  )
}