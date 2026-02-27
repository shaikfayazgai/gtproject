'use client'

import { useMemo } from 'react'
import { DataTable, Badge } from '@glimmora/ui'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import type { PlatformAuditEntry, AuditActionCategory } from '@glimmora/types'

const CATEGORY_BADGE_MAP: Record<AuditActionCategory, 'normal' | 'inprogress' | 'done' | 'atrisk' | 'urgent'> = {
  user_management: 'normal',
  project_intervention: 'inprogress',
  dispute_resolution: 'atrisk',
  content_management: 'done',
  apg_configuration: 'urgent',
  system: 'normal',
}

const CATEGORY_LABELS: Record<AuditActionCategory, string> = {
  user_management: 'User Mgmt',
  project_intervention: 'Project',
  dispute_resolution: 'Dispute',
  content_management: 'Content',
  apg_configuration: 'APG Config',
  system: 'System',
}

interface AuditLogTableProps {
  entries: PlatformAuditEntry[]
}

export function AuditLogTable({ entries }: AuditLogTableProps) {
  const columns: ColumnDef<PlatformAuditEntry, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'timestamp',
        header: 'Timestamp',
        cell: ({ getValue }) =>
          format(new Date(getValue() as string), 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        accessorKey: 'actorName',
        header: 'Actor',
        cell: ({ getValue }) => (
          <span className="font-medium text-text-heading">{String(getValue())}</span>
        ),
      },
      {
        accessorKey: 'actionCategory',
        header: 'Category',
        cell: ({ getValue }) => {
          const cat = getValue() as AuditActionCategory
          return (
            <Badge status={CATEGORY_BADGE_MAP[cat]}>
              {CATEGORY_LABELS[cat] ?? cat}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'actionType',
        header: 'Action',
        cell: ({ getValue }) => String(getValue()),
      },
      {
        id: 'entity',
        header: 'Affected Entity',
        cell: ({ row }) => {
          const entry = row.original
          return (
            <span className="text-text-body">
              {entry.affectedEntityType}:{entry.affectedEntityId}
            </span>
          )
        },
      },
      {
        accessorKey: 'reason',
        header: 'Reason',
        cell: ({ getValue }) => {
          const reason = String(getValue())
          return (
            <span className="truncate block max-w-[200px]" title={reason}>
              {reason}
            </span>
          )
        },
      },
    ],
    []
  )

  // CRITICAL: NO action column. This DataTable is entirely READ-ONLY.
  return (
    <DataTable<PlatformAuditEntry>
      columns={columns}
      data={entries}
      pageSize={15}
    />
  )
}
