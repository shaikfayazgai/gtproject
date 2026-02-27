'use client'

import Link from 'next/link'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable, Badge } from '@glimmora/ui'
import { formatDistanceToNow } from 'date-fns'
import type { Dispute, DisputeType, DisputeSeverity, DisputeStatus } from '@glimmora/types'

const typeStatusMap: Record<DisputeType, 'normal' | 'inprogress' | 'atrisk' | 'urgent'> = {
  payment: 'normal',
  quality: 'inprogress',
  conduct: 'atrisk',
  technical: 'normal',
  safety: 'urgent',
}

const severityStatusMap: Record<DisputeSeverity, 'normal' | 'inprogress' | 'atrisk' | 'urgent'> = {
  low: 'normal',
  medium: 'inprogress',
  high: 'atrisk',
  critical: 'urgent',
}

const disputeStatusMap: Record<DisputeStatus, 'normal' | 'inprogress' | 'atrisk' | 'done' | 'urgent'> = {
  open: 'normal',
  under_review: 'inprogress',
  awaiting_evidence: 'atrisk',
  resolved: 'done',
  escalated: 'urgent',
}

const columns: ColumnDef<Dispute, unknown>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <Link
        href={`/disputes/${row.original.id}`}
        className="text-brand-primary hover:underline font-mono text-xs"
      >
        {row.original.id}
      </Link>
    ),
    size: 120,
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <span className="truncate max-w-[240px] block" title={row.original.title}>
        {row.original.title}
      </span>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <Badge status={typeStatusMap[row.original.type]}>
        {row.original.type}
      </Badge>
    ),
    size: 100,
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: ({ row }) => (
      <Badge status={severityStatusMap[row.original.severity]}>
        {row.original.severity}
      </Badge>
    ),
    size: 100,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge status={disputeStatusMap[row.original.status]}>
        {row.original.status.replace(/_/g, ' ')}
      </Badge>
    ),
    size: 130,
  },
  {
    accessorKey: 'projectName',
    header: 'Project',
    cell: ({ row }) => (
      <Link
        href={`/projects/${row.original.projectId}`}
        className="text-brand-primary hover:underline text-sm"
      >
        {row.original.projectName}
      </Link>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <span className="text-text-caption text-xs">
        {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
      </span>
    ),
    size: 120,
  },
  {
    accessorKey: 'assignedAdminId',
    header: 'Assigned To',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.assignedAdminId ? 'Admin' : 'Unassigned'}
      </span>
    ),
    size: 110,
  },
]

interface DisputeQueueTableProps {
  disputes: Dispute[]
}

export function DisputeQueueTable({ disputes }: DisputeQueueTableProps) {
  // Sort by severity descending (critical first), then created ascending (oldest first)
  const severityOrder: Record<DisputeSeverity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  }

  const sorted = [...disputes].sort((a, b) => {
    const sevDiff = severityOrder[a.severity] - severityOrder[b.severity]
    if (sevDiff !== 0) return sevDiff
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  return <DataTable columns={columns} data={sorted} pageSize={10} />
}
