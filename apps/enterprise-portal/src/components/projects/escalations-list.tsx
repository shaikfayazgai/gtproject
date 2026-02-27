'use client'
import { useQuery } from '@tanstack/react-query'
import { Badge, Card, CardContent } from '@glimmora/ui'
import type { MockEscalation } from '../../lib/msw/factories/evidence'

function priorityToBadge(priority: MockEscalation['priority']): { label: string; variant: 'normal' | 'atrisk' | 'inprogress' } {
  switch (priority) {
    case 'normal':
      return { label: 'Normal', variant: 'normal' }
    case 'high':
      return { label: 'High', variant: 'inprogress' }
    case 'urgent':
      return { label: 'Urgent', variant: 'atrisk' }
  }
}

interface EscalationsListProps {
  projectId: string
}

export function EscalationsList({ projectId }: EscalationsListProps) {
  const { data: escalations = [], isLoading } = useQuery<MockEscalation[]>({
    queryKey: ['escalations', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/enterprise/projects/${projectId}/escalations`)
      if (!res.ok) throw new Error('Failed to fetch escalations')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm font-body text-text-caption">Loading escalations...</p>
      </div>
    )
  }

  if (escalations.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm font-body text-text-caption">No escalations found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-display font-semibold text-text-heading">Escalation Centre</h3>
        <p className="text-sm font-body text-text-caption mt-0.5">
          Evidence packs escalated for mentor review and resolution.
        </p>
      </div>

      <div className="space-y-3">
        {escalations.map((esc) => (
          <Card key={esc.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-body font-medium text-text-heading">
                    {esc.milestoneName}
                  </p>
                  <p className="text-xs font-body text-text-caption mt-0.5">
                    Pack: {esc.packId}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const { label, variant } = priorityToBadge(esc.priority)
                    return <Badge status={variant}>{label}</Badge>
                  })()}
                  <Badge status={esc.status === 'resolved' ? 'done' : 'normal'}>
                    {esc.status === 'resolved' ? 'Resolved' : 'Pending Mentor'}
                  </Badge>
                </div>
              </div>
              <p className="text-sm font-body text-text-body line-clamp-2 mb-2">
                {esc.reason}
              </p>
              <div className="flex items-center justify-between text-xs font-body text-text-caption">
                <span>
                  Submitted {new Date(esc.submittedAt).toLocaleDateString()}
                </span>
                {esc.resolvedAt && (
                  <span>
                    Resolved {new Date(esc.resolvedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
