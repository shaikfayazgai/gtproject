'use client'
import { Card, Progress } from '@glimmora/ui'
import type { Project } from '@glimmora/types'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

const healthConfig: Record<string, { dot: string; label: string; badgeClass: string }> = {
  'on-track': { dot: 'bg-status-success', label: 'On Track', badgeClass: 'text-status-success bg-status-success/10' },
  'at-risk': { dot: 'bg-status-warning', label: 'At Risk', badgeClass: 'text-status-warning bg-status-warning/10' },
  'delayed': { dot: 'bg-status-urgent', label: 'Delayed', badgeClass: 'text-status-urgent bg-status-urgent/10' },
  'critical': { dot: 'bg-status-urgent', label: 'Critical', badgeClass: 'text-status-urgent bg-status-urgent/10' },
}

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  'draft': { label: 'Draft', badgeClass: 'text-text-caption bg-hover' },
  'blueprint-review': { label: 'Blueprint Review', badgeClass: 'text-status-inprogress bg-status-inprogress/10' },
  'active': { label: 'Active', badgeClass: 'text-status-success bg-status-success/10' },
  'paused': { label: 'Paused', badgeClass: 'text-status-warning bg-status-warning/10' },
  'completed': { label: 'Completed', badgeClass: 'text-status-success bg-status-success/10' },
  'archived': { label: 'Archived', badgeClass: 'text-text-caption bg-hover' },
  'frozen': { label: 'Frozen', badgeClass: 'text-status-urgent bg-status-urgent/10' },
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const health = healthConfig[project.health] ?? healthConfig['on-track']
  const status = statusConfig[project.status] ?? statusConfig['active']

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-display font-semibold text-text-heading leading-tight pr-2">
            {project.name}
          </h3>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-body font-medium uppercase tracking-wider shrink-0 ${status.badgeClass}`}>
            {status.label}
          </span>
        </div>

        {/* Health indicator */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`h-2 w-2 rounded-full ${health.dot}`} />
          <span className="text-xs font-body text-text-caption">{health.label}</span>
        </div>

        {/* Completion */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-body text-text-caption">
              {project.completedTasks}/{project.totalTasks} tasks complete
            </span>
            <span className="text-sm font-body font-semibold text-text-heading">
              {project.completionPercentage}%
            </span>
          </div>
          <Progress value={project.completionPercentage} className="h-2" />
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-1.5 text-xs font-body text-text-caption">
          <Calendar className="h-3.5 w-3.5" />
          <span>{project.startDate} - {project.targetEndDate}</span>
        </div>
      </Card>
    </Link>
  )
}
