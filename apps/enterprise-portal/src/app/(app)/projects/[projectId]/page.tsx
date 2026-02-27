'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, Badge, Spinner } from '@glimmora/ui'
import { ProjectDetailTabs } from '@/components/projects'
import type { Project } from '@glimmora/types'

const healthConfig: Record<string, { dot: string; label: string }> = {
  'on-track': { dot: 'bg-status-success', label: 'On Track' },
  'at-risk': { dot: 'bg-status-warning', label: 'At Risk' },
  'delayed': { dot: 'bg-status-urgent', label: 'Delayed' },
  'critical': { dot: 'bg-status-urgent', label: 'Critical' },
}

const statusBadgeMap: Record<string, 'normal' | 'inprogress' | 'done' | 'atrisk' | 'urgent'> = {
  'draft': 'normal',
  'blueprint-review': 'inprogress',
  'active': 'done',
  'paused': 'atrisk',
  'completed': 'done',
  'archived': 'normal',
  'frozen': 'urgent',
}

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>()
  const projectId = params.projectId

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['enterprise-project', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/enterprise/projects/${projectId}`)
      if (!res.ok) throw new Error('Failed to fetch project')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading project..." />
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <div className="p-4 text-status-urgent text-sm">
          Failed to load project. Please try again.
        </div>
      </div>
    )
  }

  const health = healthConfig[project.health] ?? healthConfig['on-track']
  const badgeStatus = statusBadgeMap[project.status] ?? 'normal'

  return (
    <div className="p-6">
      <PageHeader
        title={project.name}
        breadcrumb={
          <span className="text-sm font-body text-text-caption">
            <a href="/projects" className="hover:text-brand-primary transition-colors">Active Projects</a>
            {' / '}
            {project.name}
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            <Badge status={badgeStatus}>{project.status.replace('-', ' ')}</Badge>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${health.dot}`} />
              <span className="text-sm font-body text-text-caption">{health.label}</span>
            </div>
          </div>
        }
      />

      <ProjectDetailTabs project={project} projectId={projectId} />
    </div>
  )
}
