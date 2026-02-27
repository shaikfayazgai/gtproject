'use client'
import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, Spinner, Badge } from '@glimmora/ui'
import type { Project } from '@glimmora/types'
import { ProjectAdminTabs } from '@/components/projects'
import { Snowflake } from 'lucide-react'

interface ProjectWithOrg extends Project {
  organizationName?: string
}

const statusToBadge: Record<string, { label: string; variant: 'done' | 'normal' | 'inprogress' | 'atrisk' | 'urgent' }> = {
  'active': { label: 'Active', variant: 'inprogress' },
  'paused': { label: 'Paused', variant: 'normal' },
  'completed': { label: 'Completed', variant: 'done' },
  'frozen': { label: 'Frozen', variant: 'urgent' },
  'draft': { label: 'Draft', variant: 'normal' },
  'blueprint-review': { label: 'Blueprint Review', variant: 'inprogress' },
  'archived': { label: 'Archived', variant: 'normal' },
}

const healthDotColor: Record<string, string> = {
  'on-track': 'bg-status-success',
  'at-risk': 'bg-status-warning',
  'delayed': 'bg-status-warning',
  'critical': 'bg-status-urgent',
}

const healthLabel: Record<string, string> = {
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  'delayed': 'Delayed',
  'critical': 'Critical',
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = use(params)

  const { data: project, isLoading, error } = useQuery<ProjectWithOrg>({
    queryKey: ['admin-project-detail', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/projects/${projectId}`)
      if (!res.ok) throw new Error('Failed to fetch project')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader title="Project Detail" />
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading project..." />
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <PageHeader title="Project Detail" />
        <div className="p-4 text-status-urgent text-sm">
          Failed to load project. Please try again.
        </div>
      </div>
    )
  }

  const statusConfig = statusToBadge[project.status] ?? { label: project.status, variant: 'normal' as const }

  return (
    <div className="p-6">
      <PageHeader
        title={project.name}
        actions={
          <div className="flex items-center gap-3">
            <Badge status={statusConfig.variant}>{statusConfig.label}</Badge>
            <div className="flex items-center gap-1.5">
              <div className={`h-2.5 w-2.5 rounded-full ${healthDotColor[project.health] ?? 'bg-text-disabled'}`} />
              <span className="text-sm font-body text-text-body">{healthLabel[project.health] ?? project.health}</span>
            </div>
            {project.status === 'frozen' && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-inner bg-status-urgent/10">
                <Snowflake className="h-4 w-4 text-status-urgent" />
                <span className="text-xs font-body font-medium text-status-urgent">FROZEN</span>
              </div>
            )}
          </div>
        }
      />

      <div className="mt-6">
        <ProjectAdminTabs projectId={projectId} project={project} />
      </div>
    </div>
  )
}
