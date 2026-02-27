'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable, Badge, Spinner, SlideOutPanel, Card, CardContent } from '@glimmora/ui'
import { EvidenceViewer } from '@glimmora/ui'
import type { Evidence as ViewerEvidence } from '@glimmora/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { AdminEvidencePack } from '@/lib/msw/factories/project'
import { FileCheck } from 'lucide-react'

function statusToBadge(status: AdminEvidencePack['status']): { label: string; variant: 'done' | 'normal' | 'inprogress' | 'atrisk' } {
  switch (status) {
    case 'approved':
      return { label: 'Approved', variant: 'done' }
    case 'pending':
      return { label: 'Pending', variant: 'normal' }
    case 'under_review':
      return { label: 'Under Review', variant: 'inprogress' }
    case 'rejected':
      return { label: 'Rejected', variant: 'atrisk' }
  }
}

const evidenceColumns: ColumnDef<AdminEvidencePack, unknown>[] = [
  {
    accessorKey: 'taskName',
    header: 'Task Name',
    cell: ({ getValue }) => (
      <span className="text-sm font-body font-medium text-text-heading">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'milestoneName',
    header: 'Milestone',
    cell: ({ getValue }) => (
      <span className="text-sm font-body text-text-body">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'submittedAt',
    header: 'Submitted',
    cell: ({ getValue }) => (
      <span className="text-xs font-body text-text-caption">
        {new Date(getValue<string>()).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const { label, variant } = statusToBadge(getValue<AdminEvidencePack['status']>())
      return <Badge status={variant}>{label}</Badge>
    },
  },
  {
    accessorKey: 'reviewerRole',
    header: 'Reviewer',
    cell: ({ getValue }) => (
      <span className="text-sm font-body text-text-body">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'decisionDate',
    header: 'Decision Date',
    cell: ({ getValue }) => {
      const v = getValue<string | undefined>()
      return (
        <span className="text-xs font-body text-text-caption">
          {v ? new Date(v).toLocaleDateString() : '--'}
        </span>
      )
    },
  },
]

interface ProjectEvidenceTabProps {
  projectId: string
}

export function ProjectEvidenceTab({ projectId }: ProjectEvidenceTabProps) {
  const [selectedPack, setSelectedPack] = useState<AdminEvidencePack | null>(null)

  const { data: packs = [], isLoading, error } = useQuery<AdminEvidencePack[]>({
    queryKey: ['admin-project-evidence', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/projects/${projectId}/evidence`)
      if (!res.ok) throw new Error('Failed to fetch evidence')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner label="Loading evidence packs..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-status-urgent text-sm">
        Failed to load evidence packs. Please try again.
      </div>
    )
  }

  if (packs.length === 0) {
    return (
      <div className="text-center py-12">
        <FileCheck className="h-12 w-12 text-text-disabled mx-auto mb-3" />
        <p className="text-sm font-body text-text-caption">No evidence packs submitted yet.</p>
      </div>
    )
  }

  // Mock evidence items for viewer (admin sees status but evidence review happens in mentor/enterprise portals)
  const mockEvidence: ViewerEvidence[] = [
    { type: 'code', language: 'typescript', code: '// Evidence code sample\nexport function handleAuth() {\n  return validateToken()\n}', filename: 'auth-handler.ts' },
    { type: 'text', content: 'Implementation follows the agreed architecture pattern. All endpoints tested with 95% coverage.' },
    { type: 'link', url: 'https://github.com/project/pr/42', title: 'Pull Request #42', description: 'Core implementation PR' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-display font-semibold text-text-heading">Evidence Packs</h3>
        <p className="text-sm font-body text-text-caption mt-0.5">
          Review submitted evidence for milestone completion. Contributor identity is hidden for blind review.
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          const target = e.target as HTMLElement
          const row = target.closest('tr')
          if (!row || !row.parentElement) return
          const rowIndex = Array.from(row.parentElement.children).indexOf(row)
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
        <DataTable columns={evidenceColumns} data={packs} enableSorting />
      </div>

      <SlideOutPanel
        open={!!selectedPack}
        onClose={() => setSelectedPack(null)}
        title={`Evidence: ${selectedPack?.taskName || ''}`}
        className="w-[520px]"
      >
        {selectedPack && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-body text-text-caption">Milestone</span>
                  <span className="text-sm font-body text-text-heading">{selectedPack.milestoneName}</span>
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
                  <span className="text-xs font-body text-text-caption">Reviewer</span>
                  <span className="text-sm font-body text-text-body">{selectedPack.reviewerRole}</span>
                </div>
              </CardContent>
            </Card>

            <div>
              <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide mb-3">
                Evidence Items
              </p>
              <EvidenceViewer evidence={mockEvidence} />
            </div>
          </div>
        )}
      </SlideOutPanel>
    </div>
  )
}
