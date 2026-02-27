'use client'

import Link from 'next/link'
import { Badge } from '@glimmora/ui'
import { formatDistanceToNow, format } from 'date-fns'
import { Calendar, Building2, User, FileText, CreditCard, Shield, Lock } from 'lucide-react'
import type { Dispute, DisputeType, DisputeSeverity } from '@glimmora/types'

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

interface CaseContextPanelProps {
  dispute: Dispute & {
    assignedAdminName?: string
    slaDeadline?: string
    relatedEvidencePackId?: string
    relatedPaymentId?: string
    accessRestrictions?: string[]
    privacyRestricted?: boolean
    evidencePreserved?: boolean
  }
}

export function CaseContextPanel({ dispute }: CaseContextPanelProps) {
  return (
    <div className="h-full overflow-y-auto p-4 bg-bg-card space-y-6">
      {/* Type & Severity */}
      <div>
        <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide mb-2">
          Classification
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge status={typeStatusMap[dispute.type]}>{dispute.type}</Badge>
          <Badge status={severityStatusMap[dispute.severity]}>{dispute.severity}</Badge>
        </div>
      </div>

      {/* Privacy indicators (for safety cases) */}
      {dispute.privacyRestricted && (
        <div className="rounded-inner border border-status-urgent/20 bg-status-urgent/5 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-status-urgent" />
            <span className="text-xs font-body font-medium text-status-urgent">Privacy Restricted</span>
          </div>
          {dispute.accessRestrictions && dispute.accessRestrictions.length > 0 && (
            <ul className="space-y-1">
              {dispute.accessRestrictions.map((restriction, i) => (
                <li key={i} className="flex items-center gap-1.5 text-xs font-body text-text-caption">
                  <Lock className="h-3 w-3 text-text-disabled" />
                  {restriction}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Project Info */}
      <div>
        <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide mb-2">
          Project
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-text-disabled" />
            <Link
              href={`/projects/${dispute.projectId}`}
              className="text-sm font-body text-brand-primary hover:underline"
            >
              {dispute.projectName}
            </Link>
          </div>
        </div>
      </div>

      {/* Parties Involved */}
      <div>
        <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide mb-2">
          Parties Involved
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-text-disabled" />
            <div>
              <p className="text-sm font-body text-text-body">{dispute.requesterName}</p>
              <p className="text-xs font-body text-text-caption">Requester</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-text-disabled" />
            <div>
              <p className="text-sm font-body text-text-body font-mono">{dispute.contributorSeed}</p>
              <p className="text-xs font-body text-text-caption">Contributor (anonymized)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Dates */}
      <div>
        <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide mb-2">
          Key Dates
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-text-disabled" />
            <div>
              <p className="text-xs font-body text-text-caption">Filed</p>
              <p className="text-sm font-body text-text-body">
                {format(new Date(dispute.createdAt), 'MMM d, yyyy')}
                <span className="text-text-caption ml-1">
                  ({formatDistanceToNow(new Date(dispute.createdAt), { addSuffix: true })})
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-text-disabled" />
            <div>
              <p className="text-xs font-body text-text-caption">Last Updated</p>
              <p className="text-sm font-body text-text-body">
                {formatDistanceToNow(new Date(dispute.updatedAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          {dispute.slaDeadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-status-urgent" />
              <div>
                <p className="text-xs font-body text-text-caption">SLA Deadline</p>
                <p className="text-sm font-body text-status-urgent font-medium">
                  {format(new Date(dispute.slaDeadline), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Evidence Preserved (safety cases) */}
      {dispute.evidencePreserved && (
        <div className="flex items-center gap-2 text-xs font-body text-status-success">
          <FileText className="h-4 w-4" />
          Evidence Preserved
        </div>
      )}

      {/* Related Entities */}
      {(dispute.relatedEvidencePackId || dispute.relatedPaymentId) && (
        <div>
          <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide mb-2">
            Related Entities
          </p>
          <div className="space-y-2">
            {dispute.relatedEvidencePackId && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-text-disabled" />
                <span className="text-sm font-body text-brand-primary font-mono">
                  {dispute.relatedEvidencePackId}
                </span>
              </div>
            )}
            {dispute.relatedPaymentId && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-text-disabled" />
                <span className="text-sm font-body text-brand-primary font-mono">
                  {dispute.relatedPaymentId}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assigned Admin */}
      {dispute.assignedAdminName && (
        <div>
          <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide mb-2">
            Assigned To
          </p>
          <p className="text-sm font-body text-text-body">{dispute.assignedAdminName}</p>
        </div>
      )}
    </div>
  )
}
