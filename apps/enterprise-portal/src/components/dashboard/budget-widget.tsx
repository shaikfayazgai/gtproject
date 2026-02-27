'use client'
import { Card, CardHeader, CardTitle, CardContent, Progress } from '@glimmora/ui'

interface BudgetWidgetProps {
  released: number
  pending: number
  total: number
  currency: string
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export function BudgetWidget({ released, pending, total, currency }: BudgetWidgetProps) {
  const remaining = total - released - pending
  const releasedPercent = total > 0 ? Math.round((released / total) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-body text-text-caption">Released</span>
              <span className="text-sm font-body font-medium text-text-heading">
                {formatCurrency(released, currency)}
              </span>
            </div>
            <Progress value={releasedPercent} variant="gradient" className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-body text-text-caption">Pending</p>
              <p className="text-sm font-body font-medium text-text-heading">
                {formatCurrency(pending, currency)}
              </p>
            </div>
            <div>
              <p className="text-xs font-body text-text-caption">Remaining</p>
              <p className="text-sm font-body font-medium text-text-heading">
                {formatCurrency(remaining, currency)}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-text-caption">Total Budget</span>
              <span className="text-sm font-body font-semibold text-text-heading">
                {formatCurrency(total, currency)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
