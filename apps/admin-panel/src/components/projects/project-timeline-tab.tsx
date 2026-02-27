'use client'
import { useQuery } from '@tanstack/react-query'
import { TimelineBar, Badge, Spinner, Card, CardContent } from '@glimmora/ui'
import type { ProjectMilestone } from '@glimmora/types'
import { CheckCircle, Clock, AlertTriangle, Circle } from 'lucide-react'

const milestoneStatusConfig: Record<string, { icon: React.ElementType; iconClass: string; label: string; badgeVariant: 'done' | 'normal' | 'inprogress' | 'atrisk' }> = {
  'completed': { icon: CheckCircle, iconClass: 'text-status-success', label: 'Completed', badgeVariant: 'done' },
  'in-progress': { icon: Clock, iconClass: 'text-status-inprogress', label: 'In Progress', badgeVariant: 'inprogress' },
  'overdue': { icon: AlertTriangle, iconClass: 'text-status-urgent', label: 'Overdue', badgeVariant: 'atrisk' },
  'pending': { icon: Circle, iconClass: 'text-text-disabled', label: 'Pending', badgeVariant: 'normal' },
}

interface ProjectTimelineTabProps {
  projectId: string
}

function computeCompletion(milestone: ProjectMilestone): number {
  if (milestone.status === 'completed') return 100
  if (milestone.status === 'pending') return 0
  // Approximate: in-progress milestones are 50% done
  return 50
}

export function ProjectTimelineTab({ projectId }: ProjectTimelineTabProps) {
  const { data: milestones, isLoading, error } = useQuery<ProjectMilestone[]>({
    queryKey: ['admin-project-timeline', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/projects/${projectId}/timeline`)
      if (!res.ok) throw new Error('Failed to fetch timeline')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner label="Loading timeline..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-status-urgent text-sm">
        Failed to load timeline. Please try again.
      </div>
    )
  }

  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm font-body text-text-caption">No milestones found for this project.</p>
      </div>
    )
  }

  // Build TimelineBar data
  const totalMilestones = milestones.length
  const timelineData = milestones.map((ms, idx) => ({
    id: ms.id,
    label: ms.name,
    date: new Date(ms.targetDate).toLocaleDateString(),
    progress: Math.round(((idx + 1) / totalMilestones) * 100),
    status: ms.status === 'completed' ? 'completed' as const
      : ms.status === 'in-progress' ? 'active' as const
      : 'upcoming' as const,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-semibold text-text-heading">Timeline</h3>
        <p className="text-sm font-body text-text-caption mt-0.5">
          Milestone progress overview for this project.
        </p>
      </div>

      {/* Visual timeline bar */}
      <Card>
        <CardContent className="py-6">
          <TimelineBar milestones={timelineData} />
        </CardContent>
      </Card>

      {/* Milestone list */}
      <div className="space-y-3">
        {milestones.map((milestone) => {
          const config = milestoneStatusConfig[milestone.status] ?? milestoneStatusConfig['pending']
          const Icon = config.icon
          const completion = computeCompletion(milestone)

          return (
            <Card key={milestone.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${config.iconClass}`} />
                    <div>
                      <p className="text-sm font-body font-medium text-text-heading">
                        {milestone.name}
                      </p>
                      <p className="text-xs font-body text-text-caption mt-0.5">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <Badge status={config.badgeVariant}>{config.label}</Badge>
                </div>

                <div className="ml-8 mt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs font-body text-text-caption">
                    <span>Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                    {milestone.completedDate && (
                      <span>Completed: {new Date(milestone.completedDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-hover">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-gold transition-all"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <span className="text-xs font-body text-text-caption w-8 text-right">{completion}%</span>
                  </div>
                  <p className="text-xs font-body text-text-disabled">
                    {milestone.taskIds.length} tasks in this milestone
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
