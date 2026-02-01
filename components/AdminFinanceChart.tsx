// components/AdminFinanceChart.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface AdminFinanceChartProps {
  range: string // รับค่า 'TODAY' | '7D' | '30D'
}

export default function AdminFinanceChart({ range }: AdminFinanceChartProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // ฟังก์ชันจำลองข้อมูล (Mock Data) ตามช่วงเวลา
    const generateMockData = () => {
      const mockData = []
      const today = new Date()

      if (range === 'TODAY') {
        // ข้อมูลรายชั่วโมง (00:00 - 23:00)
        for (let i = 8; i <= 22; i += 2) {
          mockData.push({
            date: `${i}:00`,
            total: Math.floor(Math.random() * 15000) + 2000
          })
        }
      } else if (range === '7D') {
        // ข้อมูล 7 วันย้อนหลัง
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today)
          d.setDate(today.getDate() - i)
          mockData.push({
            date: d.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue...
            total: Math.floor(Math.random() * 50000) + 10000
          })
        }
      } else {
        // ข้อมูล 30 วัน
        for (let i = 29; i >= 0; i -= 4) {
          const d = new Date(today)
          d.setDate(today.getDate() - i)
          mockData.push({
            date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }), // 1 Jan
            total: Math.floor(Math.random() * 80000) + 20000
          })
        }
      }

      setData(mockData)
    }

    generateMockData()
  }, [range])

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            tickFormatter={(value) => `฿${value/1000}k`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            // 🔥 แก้ไขตรงนี้: ใช้ any หรือ number | undefined เพื่อแก้ Error
            formatter={(value: number | string | undefined) => [`฿${Number(value || 0).toLocaleString()}`, 'Revenue']}
            cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}