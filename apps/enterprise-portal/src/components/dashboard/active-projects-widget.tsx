'use client'
import { Card, CardHeader, CardTitle, CardContent, Progress } from '@glimmora/ui'
import Link from 'next/link'

interface ActiveProject {
  id: string
  name: string
  status: string
  health: 'on-track' | 'at-risk' | 'delayed' | 'critical'
  completionPercentage: number
  totalTasks: number
  completedTasks: number
}

const healthConfig: Record<string, { dot: string; label: string }> = {
  'on-track': { dot: 'bg-status-success', label: 'On Track' },
  'at-risk': { dot: 'bg-status-warning', label: 'At Risk' },
  'delayed': { dot: 'bg-status-urgent', label: 'Delayed' },
  'critical': { dot: 'bg-status-urgent', label: 'Critical' },
}

interface ActiveProjectsWidgetProps {
  projects: ActiveProject[]
}

export function ActiveProjectsWidget({ projects }: ActiveProjectsWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => {
            const health = healthConfig[project.health] ?? healthConfig['on-track']
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block rounded-inner p-3 hover:bg-hover transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-body font-medium text-text-heading truncate">
                    {project.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`h-2 w-2 rounded-full ${health.dot}`} />
                    <span className="text-xs font-body text-text-caption">
                      {health.label}
                    </span>
                  </div>
                </div>
                <Progress value={project.completionPercentage} className="h-1.5 mb-1" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-body text-text-caption">
                    {project.completedTasks}/{project.totalTasks} tasks complete
                  </span>
                  <span className="text-xs font-body font-medium text-text-body">
                    {project.completionPercentage}%
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
