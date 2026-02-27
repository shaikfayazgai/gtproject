'use client'
import { useQuery } from '@tanstack/react-query'
import { DataTable, Badge, Spinner } from '@glimmora/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { AdminReworkRequest } from '@/lib/msw/factories/project'
import { RotateCcw } from 'lucide-react'

function statusToBadge(status: AdminReworkRequest['status']): { label: string; variant: 'done' | 'normal' | 'inprogress' } {
  switch (status) {
    case 'completed':
      return { label: 'Completed', variant: 'done' }
    case 'pending':
      return { label: 'Pending', variant: 'normal' }
    case 'in_progress':
      return { label: 'In Progress', variant: 'inprogress' }
  }
}

const reworkColumns: ColumnDef<AdminReworkRequest, unknown>[] = [
  {
    accessorKey: 'taskName',
    header: 'Task Name',
    cell: ({ getValue }) => (
      <span className="text-sm font-body font-medium text-text-heading">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'requestedByRole',
    header: 'Requested By',
    cell: ({ getValue }) => (
      <span className="text-sm font-body text-text-body">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ getValue }) => (
      <span className="text-sm font-body text-text-body line-clamp-2">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const { label, variant } = statusToBadge(getValue<AdminReworkRequest['status']>())
      return <Badge status={variant}>{label}</Badge>
    },
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
]

interface ProjectReworkTabProps {
  projectId: string
}

export function ProjectReworkTab({ projectId }: ProjectReworkTabProps) {
  const { data: requests = [], isLoading, error } = useQuery<AdminReworkRequest[]>({
    queryKey: ['admin-project-reworks', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/projects/${projectId}/reworks`)
      if (!res.ok) throw new Error('Failed to fetch rework requests')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner label="Loading rework requests..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-status-urgent text-sm">
        Failed to load rework requests. Please try again.
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <RotateCcw className="h-12 w-12 text-text-disabled mx-auto mb-3" />
        <p className="text-sm font-body text-text-caption">No rework requests for this project.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-display font-semibold text-text-heading">Rework Requests</h3>
        <p className="text-sm font-body text-text-caption mt-0.5">
          Evidence packs returned for revision with specific feedback.
        </p>
      </div>

      <DataTable columns={reworkColumns} data={requests} enableSorting />
    </div>
  )
}
