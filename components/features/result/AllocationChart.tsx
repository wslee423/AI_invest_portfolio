'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { PortfolioResult } from '@/types'

export const ALLOCATION_COLORS = [
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
    <ResponsiveContainer width="100%" height={340}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={70}
          outerRadius={110}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={ALLOCATION_COLORS[index % ALLOCATION_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [`${value}%`, name]}
        />
        <Legend
          iconType="circle"
          iconSize={10}
          formatter={(value, entry) => {
            const item = data.find((d) => d.name === value)
            return (
              <span style={{ color: '#374151', fontSize: '13px' }}>
                {value}
                <strong style={{ marginLeft: '6px', color: entry.color }}>
                  {item?.value}%
                </strong>
              </span>
            )
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
