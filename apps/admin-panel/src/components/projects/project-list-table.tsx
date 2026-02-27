'use client'
import { DataTable, Badge, Progress, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@glimmora/ui'
import type { Project } from '@glimmora/types'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

interface ProjectWithOrg extends Project {
  organizationName?: string
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

const statusToBadge: Record<string, { label: string; variant: 'done' | 'normal' | 'inprogress' | 'atrisk' | 'urgent' }> = {
  'active': { label: 'Active', variant: 'inprogress' },
  'paused': { label: 'Paused', variant: 'normal' },
  'completed': { label: 'Completed', variant: 'done' },
  'frozen': { label: 'Frozen', variant: 'urgent' },
  'draft': { label: 'Draft', variant: 'normal' },
  'blueprint-review': { label: 'Blueprint Review', variant: 'inprogress' },
  'archived': { label: 'Archived', variant: 'normal' },
}

const columns: ColumnDef<ProjectWithOrg, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Project Name',
    cell: ({ row }) => (
      <Link
        href={`/projects/${row.original.id}`}
        className="text-sm font-body font-medium text-brand-primary hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorFn: (row) => row.organizationName ?? 'Unknown',
    id: 'organization',
    header: 'Enterprise',
    cell: ({ getValue }) => (
      <span className="text-sm font-body text-text-body">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<string>()
      const config = statusToBadge[status] ?? { label: status, variant: 'normal' as const }
      return <Badge status={config.variant}>{config.label}</Badge>
    },
  },
  {
    accessorKey: 'health',
    header: 'Health',
    cell: ({ getValue }) => {
      const health = getValue<string>()
      return (
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${healthDotColor[health] ?? 'bg-text-disabled'}`} />
          <span className="text-sm font-body text-text-body">{healthLabel[health] ?? health}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'completionPercentage',
    header: 'Completion',
    cell: ({ getValue }) => {
      const pct = getValue<number>()
      return (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress value={pct} className="h-2 flex-1" />
          <span className="text-xs font-body text-text-caption w-8 text-right">{pct}%</span>
        </div>
      )
    },
  },
  {
    id: 'tasks',
    header: 'Tasks',
    cell: ({ row }) => (
      <span className="text-sm font-body text-text-body">
        {row.original.completedTasks}/{row.original.totalTasks}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ getValue }) => (
      <span className="text-xs font-body text-text-caption">
        {new Date(getValue<string>()).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded-inner hover:bg-hover transition-colors">
            <MoreHorizontal className="h-4 w-4 text-text-caption" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/projects/${row.original.id}`}>View Details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/projects/${row.original.id}#freeze`}>Freeze Project</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    size: 50,
    enableSorting: false,
  },
]

interface ProjectListTableProps {
  projects: ProjectWithOrg[]
}

export function ProjectListTable({ projects }: ProjectListTableProps) {
  return <DataTable columns={columns} data={projects} enableSorting pageSize={10} />
}
