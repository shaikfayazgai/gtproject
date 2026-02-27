'use client'
import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent, Progress, APGFeed, Spinner } from '@glimmora/ui'
import type { Project, ProjectMilestone } from '@glimmora/types'
import { CheckCircle, Clock, AlertTriangle, Circle } from 'lucide-react'

interface ProjectOverviewProps {
  projectId: string
  project: Project
}

const milestoneStatusConfig: Record<string, { icon: React.ElementType; iconClass: string; label: string }> = {
  'completed': { icon: CheckCircle, iconClass: 'text-status-success', label: 'Completed' },
  'in-progress': { icon: Clock, iconClass: 'text-status-inprogress', label: 'In Progress' },
  'overdue': { icon: AlertTriangle, iconClass: 'text-status-urgent', label: 'Overdue' },
  'pending': { icon: Circle, iconClass: 'text-text-disabled', label: 'Pending' },
}

interface APGAction {
  id: string
  type: 'task_assigned' | 'review_requested' | 'milestone_completed' | 'risk_detected' | 'team_formed' | 'payment_triggered'
  title: string
  description: string
  timestamp: string
  detail?: string
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

export function ProjectOverview({ projectId, project }: ProjectOverviewProps) {
  const { data: milestones, isLoading: milestonesLoading } = useQuery<ProjectMilestone[]>({
    queryKey: ['project-timeline', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/enterprise/projects/${projectId}/timeline`)
      if (!res.ok) throw new Error('Failed to fetch timeline')
      return res.json()
    },
  })

  const { data: activity, isLoading: activityLoading } = useQuery<APGAction[]>({
    queryKey: ['project-apg-activity', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/enterprise/projects/${projectId}/apg-activity`)
      if (!res.ok) throw new Error('Failed to fetch APG activity')
      return res.json()
    },
  })

  // Mock budget data (would come from project details in real implementation)
  const budgetTotal = 200000
  const budgetReleased = 70000
  const budgetPending = 28000
  const budgetRemaining = budgetTotal - budgetReleased - budgetPending

  // Calculate days remaining
  const targetEnd = new Date(project.targetEndDate)
  const now = new Date()
  const daysRemaining = Math.max(0, Math.ceil((targetEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <p className="text-xs font-body text-text-caption">Total Tasks</p>
            <p className="text-2xl font-display font-bold text-text-heading mt-1">{project.totalTasks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs font-body text-text-caption">Completed</p>
            <p className="text-2xl font-display font-bold text-status-success mt-1">{project.completedTasks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs font-body text-text-caption">Budget Used</p>
            <p className="text-2xl font-display font-bold text-text-heading mt-1">
              {formatCurrency(budgetReleased + budgetPending)}
            </p>
            <p className="text-xs font-body text-text-caption">of {formatCurrency(budgetTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs font-body text-text-caption">Days Remaining</p>
            <p className="text-2xl font-display font-bold text-text-heading mt-1">{daysRemaining}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestone Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Milestone Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {milestonesLoading ? (
              <div className="flex justify-center py-6">
                <Spinner size="sm" />
              </div>
            ) : milestones && milestones.length > 0 ? (
              <div className="space-y-4">
                {milestones.map((milestone) => {
                  const config = milestoneStatusConfig[milestone.status] ?? milestoneStatusConfig['pending']
                  const Icon = config.icon
                  return (
                    <div key={milestone.id} className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${config.iconClass}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-body font-medium text-text-heading">
                          {milestone.name}
                        </p>
                        <p className="text-xs font-body text-text-caption mt-0.5">
                          Target: {milestone.targetDate}
                          {milestone.completedDate && ` | Completed: ${milestone.completedDate}`}
                        </p>
                        <p className="text-xs font-body text-text-disabled mt-0.5">
                          {milestone.taskIds.length} tasks
                        </p>
                      </div>
                      <span className={`text-xs font-body font-medium px-2 py-0.5 rounded-full ${
                        milestone.status === 'completed' ? 'text-status-success bg-status-success/10' :
                        milestone.status === 'in-progress' ? 'text-status-inprogress bg-status-inprogress/10' :
                        milestone.status === 'overdue' ? 'text-status-urgent bg-status-urgent/10' :
                        'text-text-caption bg-hover'
                      }`}>
                        {config.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm font-body text-text-caption">No milestones defined yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Budget Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Budget bar - stacked segments */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-body">
                  <span className="text-text-caption">Released</span>
                  <span className="text-text-heading font-medium">{formatCurrency(budgetReleased)}</span>
                </div>
                <Progress value={(budgetReleased / budgetTotal) * 100} variant="gradient" className="h-3" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-body">
                  <span className="text-text-caption">Pending Release</span>
                  <span className="text-text-heading font-medium">{formatCurrency(budgetPending)}</span>
                </div>
                <Progress value={(budgetPending / budgetTotal) * 100} className="h-3" />
              </div>

              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-xs font-body">
                  <span className="text-text-caption">Remaining</span>
                  <span className="text-text-heading font-medium">{formatCurrency(budgetRemaining)}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-body">
                  <span className="text-text-caption">Total Budget</span>
                  <span className="text-text-heading font-semibold">{formatCurrency(budgetTotal)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* APG Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>APG Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="flex justify-center py-6">
              <Spinner size="sm" />
            </div>
          ) : activity && activity.length > 0 ? (
            <APGFeed actions={activity} maxVisible={5} />
          ) : (
            <p className="text-sm font-body text-text-caption">No APG activity yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
