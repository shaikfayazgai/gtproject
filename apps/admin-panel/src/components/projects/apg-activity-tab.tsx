'use client'
import { useQuery } from '@tanstack/react-query'
import { APGFeed, Spinner } from '@glimmora/ui'
import { Bot } from 'lucide-react'

interface APGAction {
  id: string
  type: 'task_assigned' | 'review_requested' | 'milestone_completed' | 'risk_detected' | 'team_formed' | 'payment_triggered'
  title: string
  description: string
  timestamp: string
  detail?: string
}

interface APGActivityTabProps {
  projectId: string
}

export function APGActivityTab({ projectId }: APGActivityTabProps) {
  const { data: actions, isLoading, error } = useQuery<APGAction[]>({
    queryKey: ['admin-project-apg-activity', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/projects/${projectId}/apg-activity`)
      if (!res.ok) throw new Error('Failed to fetch APG activity')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner label="Loading APG activity..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-status-urgent text-sm">
        Failed to load APG activity. Please try again.
      </div>
    )
  }

  if (!actions || actions.length === 0) {
    return (
      <div className="text-center py-12">
        <Bot className="h-12 w-12 text-text-disabled mx-auto mb-3" />
        <p className="text-sm font-body text-text-caption">No APG activity recorded for this project yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-display font-semibold text-text-heading">APG Activity Log</h3>
        <p className="text-sm font-body text-text-caption mt-0.5">
          Complete history of all Autonomous Project Governor actions for this project.
        </p>
      </div>

      <div className="bg-bg-card rounded-card border border-border p-6">
        <APGFeed actions={actions} />
      </div>
    </div>
  )
}
