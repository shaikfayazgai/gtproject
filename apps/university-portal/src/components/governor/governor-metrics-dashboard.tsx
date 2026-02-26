'use client'
import { useQuery } from '@tanstack/react-query'
import type { GovernorMetrics } from '@glimmora/types'

export function GovernorMetricsDashboard() {
  const { data } = useQuery<{ data: GovernorMetrics }>({
    queryKey: ['governor-metrics'],
    queryFn: () => fetch('/api/governor/metrics').then(r => r.json()),
  })

  const metrics = data?.data
  if (!metrics) return null

  return (
    <div className="space-y-6">
      {/* KPI grid -- aggregated numbers ONLY, no individual identifiers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-card rounded-card shadow-card p-6">
          <p className="text-xs font-body text-text-caption uppercase tracking-wider">Active Contributors</p>
          <p className="text-3xl font-display font-semibold text-text-heading mt-2">{metrics.totalActiveStudents}</p>
          <p className="text-xs font-body text-text-caption mt-1">anonymous count</p>
        </div>
        <div className="bg-bg-card rounded-card shadow-card p-6">
          <p className="text-xs font-body text-text-caption uppercase tracking-wider">Tasks Completed</p>
          <p className="text-3xl font-display font-semibold text-text-heading mt-2">{metrics.totalTasksCompleted}</p>
        </div>
        <div className="bg-bg-card rounded-card shadow-card p-6">
          <p className="text-xs font-body text-text-caption uppercase tracking-wider">PoDLs Issued</p>
          <p className="text-3xl font-display font-semibold text-text-heading mt-2">{metrics.totalPoDLsIssued}</p>
        </div>
        <div className="bg-bg-card rounded-card shadow-card p-6">
          <p className="text-xs font-body text-text-caption uppercase tracking-wider">Total Distributed</p>
          <p className="text-3xl font-display font-semibold text-text-heading mt-2">
            {metrics.currency} {metrics.totalEarningsDistributed.toLocaleString()}
          </p>
          <p className="text-xs font-body text-text-caption mt-1">aggregate earnings</p>
        </div>
      </div>

      {/* Period indicator */}
      <div className="text-xs font-body text-text-caption">
        Report period: {metrics.reportPeriod}
      </div>
    </div>
  )
}
