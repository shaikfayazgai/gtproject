'use client'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, Spinner, Button } from '@glimmora/ui'
import { ProjectCard } from '@/components/projects'
import type { Project } from '@glimmora/types'
import Link from 'next/link'
import { Upload, FolderKanban } from 'lucide-react'

export default function ProjectsPage() {
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['enterprise-projects'],
    queryFn: async () => {
      const res = await fetch('/api/enterprise/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      return res.json()
    },
  })

  return (
    <div className="p-6">
      <PageHeader
        title="Active Projects"
        subtitle="Monitor and manage your project portfolio"
        actions={
          <Button asChild>
            <Link href="/sow/upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload New SOW
            </Link>
          </Button>
        }
      />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading projects..." />
        </div>
      )}

      {error && (
        <div className="p-4 text-status-urgent text-sm">
          Failed to load projects. Please try again.
        </div>
      )}

      {projects && projects.length === 0 && (
        <div className="text-center py-16">
          <FolderKanban className="h-12 w-12 text-text-disabled mx-auto mb-3" />
          <p className="text-base font-body font-medium text-text-heading mb-1">
            No active projects
          </p>
          <p className="text-sm font-body text-text-caption mb-4">
            Upload a Statement of Work to get started
          </p>
          <Button asChild>
            <Link href="/sow/upload">Upload SOW</Link>
          </Button>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
