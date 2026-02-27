'use client'

import { useQuery } from '@tanstack/react-query'
import { Spinner, Badge } from '@glimmora/ui'
import { format, formatDistanceToNow } from 'date-fns'
import {
  Plus,
  FileText,
  UserCheck,
  MessageSquare,
  Gavel,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react'
import type { DisputeAuditEntry } from '@/lib/msw/factories/dispute'

const actionIconMap: Record<string, React.ElementType> = {
  created: Plus,
  evidence_submitted: FileText,
  assigned: UserCheck,
  message_sent: MessageSquare,
  decision_made: Gavel,
  escalated: AlertTriangle,
  resolved: CheckCircle,
  status_changed: Clock,
  case_viewed: Eye,
}

const actionStatusMap: Record<string, 'normal' | 'inprogress' | 'atrisk' | 'urgent' | 'done'> = {
  created: 'normal',
  evidence_submitted: 'inprogress',
  assigned: 'inprogress',
  message_sent: 'normal',
  decision_made: 'done',
  escalated: 'urgent',
  resolved: 'done',
  status_changed: 'atrisk',
  case_viewed: 'normal',
}

interface DisputeAuditTrailProps {
  disputeId: string
}

export function DisputeAuditTrail({ disputeId }: DisputeAuditTrailProps) {
  const { data: auditEntries, isLoading, error } = useQuery<DisputeAuditEntry[]>({
    queryKey: ['dispute-audit', disputeId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/disputes/${disputeId}/audit`)
      if (!res.ok) throw new Error('Failed to fetch audit trail')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner label="Loading audit trail..." />
      </div>
    )
  }

  if (error || !auditEntries) {
    return (
      <div className="p-4 text-status-urgent text-sm">
        Failed to load audit trail.
      </div>
    )
  }

  return (
    <div className="p-6">
      <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide mb-4">
        Case History
      </p>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {auditEntries.map((entry) => {
            const Icon = actionIconMap[entry.action] || Clock
            const status = actionStatusMap[entry.action] || 'normal'

            return (
              <div key={entry.id} className="relative flex gap-4 pl-10">
                {/* Timeline dot */}
                <div className="absolute left-2.5 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-bg-card border-2 border-border">
                  <div className="h-1.5 w-1.5 rounded-full bg-text-caption" />
                </div>

                <div className="flex-1 rounded-inner border border-border bg-bg-card p-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Icon className="h-3.5 w-3.5 text-text-caption shrink-0" />
                    <Badge status={status}>{entry.action.replace(/_/g, ' ')}</Badge>
                    <span className="text-xs font-body text-text-caption ml-auto">
                      {format(new Date(entry.timestamp), 'MMM d, yyyy HH:mm')}
                      <span className="ml-1 text-text-disabled">
                        ({formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })})
                      </span>
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <p className="text-xs font-body font-medium text-text-body">
                      {entry.actorName}
                    </p>
                    <p className="text-sm font-body text-text-caption">{entry.details}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
