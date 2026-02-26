'use client'
import { useQuery } from '@tanstack/react-query'
import { Progress } from '@glimmora/ui'
import type { CohortTrend } from '@glimmora/types'

export function CohortTrendsView() {
  const { data } = useQuery<{ data: CohortTrend[] }>({
    queryKey: ['governor-cohorts'],
    queryFn: () => fetch('/api/governor/cohorts').then(r => r.json()),
  })

  const cohorts = data?.data || []

  return (
    <div className="space-y-4">
      <p className="text-xs font-body text-text-caption">
        Showing anonymized batch-level data. Individual student performance is never displayed.
      </p>

      {cohorts.map((cohort) => (
        <div key={cohort.cohortLabel} className="bg-bg-card rounded-card shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-display font-semibold text-text-heading">{cohort.cohortLabel}</h3>
              <p className="text-sm font-body text-text-caption">Report: {cohort.reportPeriod}</p>
            </div>
          </div>

          {/* Completion rate bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-body text-text-caption">Completion Rate</span>
              <span className="text-xs font-body font-medium text-text-heading">{cohort.completionRate}%</span>
            </div>
            <Progress value={cohort.completionRate} />
          </div>

          {/* Aggregate metrics -- NOT individual */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-body text-text-caption">Avg Tasks per Contributor</p>
              <p className="text-lg font-display font-semibold text-text-heading">{cohort.averageTasksPerStudent}</p>
              <p className="text-[10px] font-body text-text-caption">aggregate average</p>
            </div>
            <div>
              <p className="text-xs font-body text-text-caption">PoDL Issuance Rate</p>
              <p className="text-lg font-display font-semibold text-brand-primary">{cohort.podlIssuanceRate}%</p>
              <p className="text-[10px] font-body text-text-caption">batch-level metric</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
