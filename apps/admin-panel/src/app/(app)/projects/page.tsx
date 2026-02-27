'use client'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, Spinner, TextInput, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@glimmora/ui'
import type { Project } from '@glimmora/types'
import { ProjectListTable } from '@/components/projects'
import { Search } from 'lucide-react'

interface ProjectWithOrg extends Project {
  organizationName?: string
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [healthFilter, setHealthFilter] = useState('all')

  const { data: projects, isLoading, error } = useQuery<ProjectWithOrg[]>({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const res = await fetch('/api/admin/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      return res.json()
    },
  })

  const filtered = useMemo(() => {
    if (!projects) return []
    return projects.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.organizationName ?? '').toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter
      const matchesHealth = healthFilter === 'all' || p.health === healthFilter
      return matchesSearch && matchesStatus && matchesHealth
    })
  }, [projects, search, statusFilter, healthFilter])

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader title="Project Management" />
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading projects..." />
        </div>
      </div>
    )
  }

  if (error || !projects) {
    return (
      <div className="p-6">
        <PageHeader title="Project Management" />
        <div className="p-4 text-status-urgent text-sm">
          Failed to load projects. Please try again.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader title="Project Management" />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mt-6 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-caption" />
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or enterprises..."
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="frozen">Frozen</SelectItem>
          </SelectContent>
        </Select>

        <Select value={healthFilter} onValueChange={setHealthFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Health" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Health</SelectItem>
            <SelectItem value="on-track">On Track</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProjectListTable projects={filtered} />
    </div>
  )
}
