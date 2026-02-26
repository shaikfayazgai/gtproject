'use client'
import { APGFeed } from '@glimmora/ui'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import type { APGActivity } from '@glimmora/types'

// Map from @glimmora/types APGActivity.type (hyphenated) to APGFeed action types (underscored)
const TYPE_MAP: Record<string, 'task_assigned' | 'review_requested' | 'milestone_completed' | 'risk_detected' | 'team_formed' | 'payment_triggered'> = {
  'task-assigned': 'task_assigned',
  'evidence-reviewed': 'review_requested',
  'milestone-updated': 'milestone_completed',
  'team-formed': 'team_formed',
  'guidance-issued': 'risk_detected',
  'payment-triggered': 'payment_triggered',
}

export function APGActivityWidget() {
  const t = useTranslations('dashboard')
  const { data } = useQuery<{ data: APGActivity[] }>({
    queryKey: ['apg-activities'],
    queryFn: () => fetch('/api/apg/activities').then((r) => r.json()),
  })

  const activities = data?.data ?? []

  const actions = activities.map((a) => ({
    id: a.id,
    type: TYPE_MAP[a.type] ?? 'task_assigned',
    title: a.message,
    description: '',
    timestamp: new Date(a.timestamp).toLocaleString(),
  }))

  return (
    <div className="bg-bg-card rounded-card shadow-card p-6">
      <h2 className="font-display text-lg font-semibold text-text-heading mb-4">
        {t('apgActivity')}
      </h2>
      <APGFeed actions={actions} maxVisible={5} />
    </div>
  )
}
