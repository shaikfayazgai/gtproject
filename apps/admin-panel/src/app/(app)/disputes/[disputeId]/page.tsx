'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import {
  PageHeader,
  Spinner,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@glimmora/ui'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import type { Dispute, DisputeType, DisputeSeverity, DisputeStatus } from '@glimmora/types'
import { DisputeDetailLayout, DisputeAuditTrail } from '@/components/disputes'

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

type DisputeDetail = Dispute & {
  assignedAdminName?: string
  slaDeadline: string
  relatedEvidencePackId?: string
  relatedPaymentId?: string
  decision?: {
    decisionType: string
    summary: string
    detailedReasoning: string
    adminId: string
    decidedAt: string
  }
}

export default function DisputeDetailPage({
  params,
}: {
  params: Promise<{ disputeId: string }>
}) {
  const { disputeId } = use(params)

  const { data: dispute, isLoading, error } = useQuery<DisputeDetail>({
    queryKey: ['dispute-detail', disputeId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/disputes/${disputeId}`)
      if (!res.ok) throw new Error('Failed to fetch dispute')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader title="Dispute Detail" />
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading dispute..." />
        </div>
      </div>
    )
  }

  if (error || !dispute) {
    return (
      <div className="p-6">
        <PageHeader title="Dispute Detail" />
        <div className="p-4 text-status-urgent text-sm">
          Failed to load dispute. Please try again.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader
        title={dispute.title}
        breadcrumb={
          <Link
            href="/disputes"
            className="inline-flex items-center gap-1 text-text-caption hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Disputes
          </Link>
        }
        actions={
          <div className="flex items-center gap-2">
            <Badge status={typeStatusMap[dispute.type]}>{dispute.type}</Badge>
            <Badge status={severityStatusMap[dispute.severity]}>{dispute.severity}</Badge>
            <Badge status={disputeStatusMap[dispute.status]}>
              {dispute.status.replace(/_/g, ' ')}
            </Badge>
          </div>
        }
      />

      {/* Resolution banner */}
      {dispute.status === 'resolved' && dispute.decision && (
        <div className="mb-4 rounded-inner border border-status-success/30 bg-status-success/5 p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-status-success shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-body font-medium text-text-heading">
              Resolved: {dispute.decision.decisionType.replace(/_/g, ' ')}
            </p>
            <p className="text-sm font-body text-text-caption mt-1">{dispute.decision.summary}</p>
          </div>
        </div>
      )}

      {/* Tabs: Case Review vs Audit Trail */}
      <Tabs defaultValue="review">
        <TabsList>
          <TabsTrigger value="review">Case Review</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="review">
          <DisputeDetailLayout dispute={dispute} />
        </TabsContent>

        <TabsContent value="audit">
          <DisputeAuditTrail disputeId={dispute.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
