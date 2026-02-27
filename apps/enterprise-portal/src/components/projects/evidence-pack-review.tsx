'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DataTable,
  Badge,
  Button,
  SlideOutPanel,
  Card,
  CardContent,
} from '@glimmora/ui'
import { EvidenceViewer } from '@glimmora/ui'
import type { Evidence as ViewerEvidence } from '@glimmora/ui'
import type { Evidence as PackEvidence, EvidencePack, EvidenceStatus } from '@glimmora/types'
import type { ColumnDef } from '@tanstack/react-table'
import { ReworkRequestForm } from './rework-request-form'
import { EscalationForm } from './escalation-form'

// Strip contributorId -- blind review boundary
// Enterprise users must NOT see who submitted evidence
function toViewerEvidence(e: PackEvidence): ViewerEvidence {
  switch (e.type) {
    case 'code':
      return {
        type: 'code',
        language: 'typescript',
        code: e.content,
        filename: e.fileName,
      }
    case 'file':
      return {
        type: 'document',
        filename: e.fileName || 'file',
        fileSize: String(e.fileSize || 'Unknown'),
        fileType: 'application/octet-stream',
        downloadUrl: e.fileUrl || '#',
      }
    case 'url':
      return {
        type: 'link',
        url: e.content,
        title: e.title,
        description: e.description,
      }
    case 'video-url':
      return {
        type: 'video',
        url: e.content,
        title: e.title,
      }
    case 'text':
      return {
        type: 'text',
        content: e.content,
      }
  }
}

type EvidencePackWithMilestone = EvidencePack & { milestoneName?: string }

function statusToBadge(status: EvidenceStatus): { label: string; variant: 'done' | 'normal' | 'atrisk' | 'inprogress' } {
  switch (status) {
    case 'approved':
      return { label: 'Approved', variant: 'done' }
    case 'submitted':
      return { label: 'Submitted', variant: 'normal' }
    case 'under-review':
      return { label: 'Under Review', variant: 'inprogress' }
    case 'rework-required':
      return { label: 'Rework Required', variant: 'atrisk' }
    case 'rejected':
      return { label: 'Rejected', variant: 'atrisk' }
  }
}

const packColumns: ColumnDef<EvidencePackWithMilestone, unknown>[] = [
  {
    accessorKey: 'id',
    header: 'Pack ID',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'milestoneName',
    header: 'Milestone',
    cell: ({ getValue }) => (
      <span className="text-sm">{getValue<string>() || '--'}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const { label, variant } = statusToBadge(getValue<EvidenceStatus>())
      return <Badge status={variant}>{label}</Badge>
    },
  },
  {
    accessorKey: 'submittedAt',
    header: 'Submitted',
    cell: ({ getValue }) => {
      const date = new Date(getValue<string>())
      return <span className="text-xs text-text-caption">{date.toLocaleDateString()}</span>
    },
  },
  {
    id: 'items',
    header: 'Items',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.evidenceItems.length}</span>
    ),
  },
]

interface EvidencePackReviewProps {
  projectId: string
}

export function EvidencePackReview({ projectId }: EvidencePackReviewProps) {
  const queryClient = useQueryClient()
  const [selectedPack, setSelectedPack] = useState<EvidencePackWithMilestone | null>(null)
  const [reworkOpen, setReworkOpen] = useState(false)
  const [escalationOpen, setEscalationOpen] = useState(false)

  const { data: packs = [], isLoading } = useQuery<EvidencePackWithMilestone[]>({
    queryKey: ['evidence', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/enterprise/projects/${projectId}/evidence`)
      if (!res.ok) throw new Error('Failed to fetch evidence packs')
      return res.json()
    },
  })

  const approveMutation = useMutation({
    mutationFn: async (packId: string) => {
      const res = await fetch(`/api/enterprise/evidence/${packId}/approve`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to approve')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] })
      setSelectedPack(null)
    },
  })

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm font-body text-text-caption">Loading evidence packs...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display font-semibold text-text-heading">Evidence Packs</h3>
          <p className="text-sm font-body text-text-caption mt-0.5">
            Review submitted evidence for milestone completion. Contributor identity is hidden for blind review.
          </p>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          const target = e.target as HTMLElement
          const row = target.closest('tr')
          if (!row) return
          const rowIndex = Array.from(row.parentElement?.children || []).indexOf(row)
          if (rowIndex >= 0 && rowIndex < packs.length) {
            setSelectedPack(packs[rowIndex])
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            (e.target as HTMLElement).click()
          }
        }}
        className="cursor-pointer"
      >
        <DataTable columns={packColumns} data={packs} enableSorting />
      </div>

      <SlideOutPanel
        open={!!selectedPack}
        onClose={() => setSelectedPack(null)}
        title={`Evidence Pack: ${selectedPack?.id || ''}`}
        className="w-[520px]"
      >
        {selectedPack && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-body text-text-caption">Milestone</span>
                  <span className="text-sm font-body text-text-heading">{selectedPack.milestoneName || '--'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-body text-text-caption">Status</span>
                  {(() => {
                    const { label, variant } = statusToBadge(selectedPack.status)
                    return <Badge status={variant}>{label}</Badge>
                  })()}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-body text-text-caption">Submitted</span>
                  <span className="text-sm font-body text-text-body">
                    {new Date(selectedPack.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-body text-text-caption">Evidence Items</span>
                  <span className="text-sm font-body text-text-body">
                    {selectedPack.evidenceItems.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div>
              <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide mb-3">
                Evidence Items
                <span className="ml-1.5 text-text-disabled">({selectedPack.evidenceItems.length})</span>
              </p>
              <EvidenceViewer
                evidence={selectedPack.evidenceItems.map(toViewerEvidence)}
              />
            </div>

            {selectedPack.status !== 'approved' && selectedPack.status !== 'rejected' && (
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <Button
                  onClick={() => approveMutation.mutate(selectedPack.id)}
                  disabled={approveMutation.isPending}
                  className="bg-status-success hover:bg-status-success/90 text-white"
                >
                  {approveMutation.isPending ? 'Approving...' : 'Approve'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setReworkOpen(true)}
                  className="border-status-warning text-status-warning hover:bg-status-warning/10"
                >
                  Request Rework
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setEscalationOpen(true)}
                  className="border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  Escalate to Mentor
                </Button>
              </div>
            )}
          </div>
        )}
      </SlideOutPanel>

      {selectedPack && (
        <>
          <ReworkRequestForm
            packId={selectedPack.id}
            open={reworkOpen}
            onOpenChange={setReworkOpen}
          />
          <EscalationForm
            packId={selectedPack.id}
            open={escalationOpen}
            onOpenChange={setEscalationOpen}
          />
        </>
      )}
    </div>
  )
}
