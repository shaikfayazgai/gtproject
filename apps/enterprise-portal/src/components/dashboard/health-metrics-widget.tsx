'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@glimmora/ui'

interface HealthMetricsWidgetProps {
  onTimeDeliveryRate: number
  reworkRate: number
  avgReviewTime: string
}

export function HealthMetricsWidget({ onTimeDeliveryRate, reworkRate, avgReviewTime }: HealthMetricsWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-text-caption">On-time Delivery</span>
            <span className="text-sm font-body font-semibold text-status-success">
              {onTimeDeliveryRate}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-text-caption">Rework Rate</span>
            <span className="text-sm font-body font-semibold text-text-heading">
              {reworkRate}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-text-caption">Avg Review Time</span>
            <span className="text-sm font-body font-semibold text-text-heading">
              {avgReviewTime}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
