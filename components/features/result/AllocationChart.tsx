'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { PortfolioResult } from '@/types'

const COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#6B7280',
]

interface AllocationChartProps {
  allocations: PortfolioResult['allocations']
}

export function AllocationChart({ allocations }: AllocationChartProps) {
  const data = allocations.map((a) => ({
    name: a.asset_class,
    value: a.ratio,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`${value}%`, '비중']} />
      </PieChart>
    </ResponsiveContainer>
  )
}
