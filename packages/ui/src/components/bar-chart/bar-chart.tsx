'use client'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '../../lib/utils'

interface BarChartProps {
  data: Array<Record<string, unknown>>
  dataKey: string
  xAxisKey: string
  height?: number
  className?: string
}

export function BarChart({ data, dataKey, xAxisKey, height = 300, className }: BarChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fontFamily: 'var(--font-body)', fill: 'var(--color-text-caption)' }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fontFamily: 'var(--font-body)', fill: 'var(--color-text-caption)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-inner)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--color-text-body)',
            }}
          />
          <Bar dataKey={dataKey} fill="var(--color-brand-primary)" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
