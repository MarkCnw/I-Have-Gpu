// components/AdminFinanceChart.tsx
'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useThemeStore } from '@/app/store/useThemeStore'

interface AdminFinanceChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[]
}

export default function AdminFinanceChart({ data }: AdminFinanceChartProps) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const gridColor = isDark ? '#333' : '#f1f5f9'
  const textColor = isDark ? '#888' : '#94a3b8'
  const tooltipBg = isDark ? '#1a1a2e' : '#ffffff'
  const tooltipBorder = isDark ? '#333' : '#e2e8f0'

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
            tickFormatter={(value) => `฿${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: `1px solid ${tooltipBorder}`,
              backgroundColor: tooltipBg,
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              color: isDark ? '#eee' : '#333',
            }}
            formatter={(value: number | string | undefined) => [`฿${Number(value || 0).toLocaleString()}`, 'Revenue']}
            cursor={{ stroke: tooltipBorder, strokeWidth: 1 }}
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