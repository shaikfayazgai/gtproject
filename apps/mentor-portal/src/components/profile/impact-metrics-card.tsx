'use client'
import { Card, CardHeader, CardTitle } from '@glimmora/ui'
import type { MentorImpactMetrics } from '@glimmora/types'

interface ImpactMetricsCardProps {
  metrics: MentorImpactMetrics
}

function getRateColor(rate: number, thresholds: { good: number; warn: number }): string {
  if (rate <= thresholds.good) return 'text-green-600'
  if (rate <= thresholds.warn) return 'text-amber-600'
  return 'text-red-600'
}

export function ImpactMetricsCard({ metrics }: ImpactMetricsCardProps) {
  const reworkRatePercent = Math.round(metrics.reworkRate * 100)
  const appealsPercent = Math.round(metrics.appealsOverturnedRate * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Metrics</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-bg-dashboard rounded-inner">
          <p className="text-xs font-body text-text-caption uppercase tracking-wider">Total Reviews</p>
          <p className="text-2xl font-display font-semibold text-text-heading mt-1">
            {metrics.totalReviews}
          </p>
        </div>

        <div className="p-3 bg-bg-dashboard rounded-inner">
          <p className="text-xs font-body text-text-caption uppercase tracking-wider">Avg Review Time</p>
          <p className="text-2xl font-display font-semibold text-text-heading mt-1">
            {metrics.averageReviewHours.toFixed(1)}h
          </p>
        </div>

        <div className="p-3 bg-bg-dashboard rounded-inner">
          <p className="text-xs font-body text-text-caption uppercase tracking-wider">Rework Rate</p>
          <p className={`text-2xl font-display font-semibold mt-1 ${getRateColor(metrics.reworkRate, { good: 0.15, warn: 0.25 })}`}>
            {reworkRatePercent}%
          </p>
          <p className="text-[10px] font-body text-text-disabled mt-0.5">
            {metrics.reworkRate <= 0.15 ? 'Excellent' : metrics.reworkRate <= 0.25 ? 'Monitor' : 'High'}
          </p>
        </div>

        <div className="p-3 bg-bg-dashboard rounded-inner">
          <p className="text-xs font-body text-text-caption uppercase tracking-wider">Appeals Overturned</p>
          <p className={`text-2xl font-display font-semibold mt-1 ${getRateColor(metrics.appealsOverturnedRate, { good: 0.05, warn: 0.1 })}`}>
            {appealsPercent}%
          </p>
          <p className="text-[10px] font-body text-text-disabled mt-0.5">
            {metrics.appealsOverturnedRate <= 0.05 ? 'Excellent' : metrics.appealsOverturnedRate <= 0.1 ? 'Monitor' : 'High'}
          </p>
        </div>

        <div className="col-span-2 p-3 bg-bg-dashboard rounded-inner">
          <p className="text-xs font-body text-text-caption uppercase tracking-wider">Pending Reviews</p>
          <p className="text-2xl font-display font-semibold text-text-heading mt-1">
            {metrics.pendingReviews}
          </p>
        </div>
      </div>
    </Card>
  )
}
