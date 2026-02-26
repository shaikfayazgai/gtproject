'use client'
import { cn } from '../../lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Sparkline } from '../sparkline/sparkline'

interface KPIStatCardProps {
  label: string
  value: string | number
  trend?: { direction: 'up' | 'down' | 'neutral'; value: string }
  sparklineData?: number[]
  className?: string
}

export function KPIStatCard({ label, value, trend, sparklineData, className }: KPIStatCardProps) {
  return (
    <div className={cn('bg-bg-card rounded-card shadow-card p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[36px] font-display font-semibold text-text-heading leading-tight">{value}</p>
          <p className="text-sm font-body text-text-caption mt-1">{label}</p>
        </div>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-body font-medium px-2 py-1 rounded-full',
              trend.direction === 'up' && 'text-status-success bg-status-success/10',
              trend.direction === 'down' && 'text-status-urgent bg-status-urgent/10',
              trend.direction === 'neutral' && 'text-text-caption bg-hover'
            )}
          >
            {trend.direction === 'up' && <TrendingUp className="h-3.5 w-3.5" />}
            {trend.direction === 'down' && <TrendingDown className="h-3.5 w-3.5" />}
            {trend.direction === 'neutral' && <Minus className="h-3.5 w-3.5" />}
            {trend.value}
          </div>
        )}
      </div>
      {sparklineData && sparklineData.length >= 2 && (
        <div className="mt-3">
          <Sparkline data={sparklineData} width={100} height={24} showDot />
        </div>
      )}
    </div>
  )
}
