'use client'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DataTable, Badge, Button, Spinner } from '@glimmora/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { Snowflake, AlertTriangle } from 'lucide-react'
import { FreezeDialog } from './freeze-dialog'
import type { FreezeHistoryEntry } from '@/lib/msw/factories/project'

const freezeHistoryColumns: ColumnDef<FreezeHistoryEntry, unknown>[] = [
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ getValue }) => {
      const action = getValue<string>()
      return (
        <Badge status={action === 'freeze' ? 'urgent' : 'done'}>
          {action === 'freeze' ? 'Freeze' : 'Unfreeze'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ getValue }) => (
      <span className="text-sm font-body text-text-body line-clamp-2">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'performedBy',
    header: 'Performed By',
    cell: ({ getValue }) => (
      <span className="text-sm font-body text-text-body">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'performedAt',
    header: 'Date',
    cell: ({ getValue }) => (
      <span className="text-xs font-body text-text-caption">
        {new Date(getValue<string>()).toLocaleString()}
      </span>
    ),
  },
]

interface FreezeTabProps {
  projectId: string
  isFrozen: boolean
}

export function FreezeTab({ projectId, isFrozen: initialFrozen }: FreezeTabProps) {
  const queryClient = useQueryClient()
  const [frozen, setFrozen] = useState(initialFrozen)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<'freeze' | 'unfreeze'>('freeze')

  const { data: history, isLoading, error } = useQuery<FreezeHistoryEntry[]>({
    queryKey: ['admin-project-freeze-history', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/projects/${projectId}/freeze-history`)
      if (!res.ok) throw new Error('Failed to fetch freeze history')
      return res.json()
    },
  })

  function openFreezeDialog() {
    setDialogAction('freeze')
    setDialogOpen(true)
  }

  function openUnfreezeDialog() {
    setDialogAction('unfreeze')
    setDialogOpen(true)
  }

  function handleSuccess() {
    setFrozen(dialogAction === 'freeze')
    queryClient.invalidateQueries({ queryKey: ['admin-project-freeze-history', projectId] })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner label="Loading freeze history..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-status-urgent text-sm">
        Failed to load freeze history. Please try again.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-semibold text-text-heading">Freeze / Unfreeze</h3>
        <p className="text-sm font-body text-text-caption mt-0.5">
          Freeze a project to pause all activity, or unfreeze to resume. All freeze/unfreeze actions are permanently logged.
        </p>
      </div>

      {/* Current freeze status */}
      {frozen ? (
        <div className="flex items-start gap-4 p-4 rounded-card bg-status-urgent/5 border border-status-urgent/20">
          <Snowflake className="h-6 w-6 text-status-urgent shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-body font-semibold text-status-urgent">Project is FROZEN</p>
            <p className="text-sm font-body text-text-caption mt-1">
              All activity is paused. Contributors have been notified. Payments are held until unfrozen.
            </p>
            <Button
              className="mt-3"
              onClick={openUnfreezeDialog}
            >
              Unfreeze Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 p-4 rounded-card bg-bg-card border border-border">
          <Snowflake className="h-6 w-6 text-text-caption shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-body font-medium text-text-heading">Project is Active</p>
            <p className="text-sm font-body text-text-caption mt-1">
              Freezing will pause all project activity and notify all contributors.
            </p>
            <Button
              variant="destructive"
              className="mt-3"
              onClick={openFreezeDialog}
            >
              <AlertTriangle className="h-4 w-4 mr-1.5" />
              Freeze Project
            </Button>
          </div>
        </div>
      )}

      {/* Freeze history */}
      <div>
        <h4 className="text-base font-display font-semibold text-text-heading mb-3">Freeze History</h4>
        {history && history.length > 0 ? (
          <DataTable columns={freezeHistoryColumns} data={history} enableSorting />
        ) : (
          <div className="text-center py-8">
            <p className="text-sm font-body text-text-caption">No freeze/unfreeze history for this project.</p>
          </div>
        )}
      </div>

      <FreezeDialog
        projectId={projectId}
        action={dialogAction}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
