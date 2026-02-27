'use client'
import { useQuery } from '@tanstack/react-query'
import { DataTable, Badge, Spinner } from '@glimmora/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { AdminEscalation } from '@/lib/msw/factories/project'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

function typeToBadge(type: AdminEscalation['type']): { label: string; variant: 'normal' | 'inprogress' | 'atrisk' } {
  switch (type) {
    case 'quality':
      return { label: 'Quality', variant: 'atrisk' }
    case 'timeline':
      return { label: 'Timeline', variant: 'inprogress' }
    case 'conduct':
      return { label: 'Conduct', variant: 'atrisk' }
  }
}

const escalationColumns: ColumnDef<AdminEscalation, unknown>[] = [
  {
    accessorKey: 'taskName',
    header: 'Task Name',
    cell: ({ getValue }) => (
      <span className="text-sm font-body font-medium text-text-heading">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'escalatedByRole',
    header: 'Escalated By',
    cell: ({ getValue }) => (
      <span className="text-sm font-body text-text-body">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ getValue }) => {
      const { label, variant } = typeToBadge(getValue<AdminEscalation['type']>())
      return <Badge status={variant}>{label}</Badge>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<string>()
      return (
        <Badge status={status === 'resolved' ? 'done' : 'normal'}>
          {status === 'resolved' ? 'Resolved' : 'Open'}
        </Badge>
      )
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
  {
    id: 'dispute',
    header: 'Dispute',
    cell: ({ row }) => {
      if (!row.original.disputeId) return <span className="text-xs text-text-disabled">--</span>
      return (
        <Link
          href={`/disputes/${row.original.disputeId}`}
          className="text-xs font-body text-brand-primary hover:underline"
        >
          View Dispute
        </Link>
      )
    },
    enableSorting: false,
  },
]

interface ProjectEscalationTabProps {
  projectId: string
}

export function ProjectEscalationTab({ projectId }: ProjectEscalationTabProps) {
  const { data: escalations = [], isLoading, error } = useQuery<AdminEscalation[]>({
    queryKey: ['admin-project-escalations', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/projects/${projectId}/escalations`)
      if (!res.ok) throw new Error('Failed to fetch escalations')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner label="Loading escalations..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-status-urgent text-sm">
        Failed to load escalations. Please try again.
      </div>
    )
  }

  if (escalations.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-text-disabled mx-auto mb-3" />
        <p className="text-sm font-body text-text-caption">No escalations for this project.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-display font-semibold text-text-heading">Escalation Centre</h3>
        <p className="text-sm font-body text-text-caption mt-0.5">
          Escalated evidence packs and disputes requiring attention.
        </p>
      </div>

      <DataTable columns={escalationColumns} data={escalations} enableSorting />
    </div>
  )
}
