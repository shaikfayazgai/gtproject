'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Button, Textarea } from '@glimmora/ui'
import {
  CheckCircle,
  UserCheck,
  Scale,
  AlertTriangle,
  XCircle,
  Shield,
} from 'lucide-react'
import type { DisputeType, DisputeDecisionType } from '@glimmora/types'

interface DecisionOption {
  value: DisputeDecisionType
  label: string
  description: string
  icon: React.ElementType
  color: string
}

const ALL_DECISION_OPTIONS: DecisionOption[] = [
  {
    value: 'resolved_favor_requester',
    label: 'Resolve: Favor Requester',
    description: 'Requester\'s position upheld',
    icon: UserCheck,
    color: 'text-blue-600',
  },
  {
    value: 'resolved_favor_contributor',
    label: 'Resolve: Favor Contributor',
    description: 'Contributor\'s position upheld',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    value: 'partial_resolution',
    label: 'Partial Resolution',
    description: 'Compromise between both parties',
    icon: Scale,
    color: 'text-amber-600',
  },
  {
    value: 'escalated_to_safety',
    label: 'Escalate to Safety Case',
    description: 'Requires Safety Case protocol',
    icon: Shield,
    color: 'text-status-urgent',
  },
  {
    value: 'dismissed',
    label: 'Dismiss',
    description: 'Dispute lacks merit',
    icon: XCircle,
    color: 'text-text-caption',
  },
]

interface DecisionFormPanelProps {
  disputeId: string
  disputeType: DisputeType
  isSafetyCase?: boolean
}

export function DecisionFormPanel({
  disputeId,
  disputeType,
  isSafetyCase = false,
}: DecisionFormPanelProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [decision, setDecision] = useState<DisputeDecisionType | undefined>()
  const [summary, setSummary] = useState('')
  const [detailedReasoning, setDetailedReasoning] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const [additionalPayment, setAdditionalPayment] = useState('')
  const [privacyImpact, setPrivacyImpact] = useState('')
  const [showValidation, setShowValidation] = useState(false)

  // Filter out 'dismissed' for safety cases
  const decisionOptions =
    disputeType === 'safety' || isSafetyCase
      ? ALL_DECISION_OPTIONS.filter((opt) => opt.value !== 'dismissed')
      : ALL_DECISION_OPTIONS

  const submitDecision = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await fetch(`/api/admin/disputes/${disputeId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to submit decision')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispute-detail', disputeId] })
      queryClient.invalidateQueries({ queryKey: ['disputes'] })
      router.push('/disputes')
    },
  })

  function handleSubmit() {
    setShowValidation(true)

    if (!decision) return
    if (!summary.trim()) return
    if (!detailedReasoning.trim()) return

    const payload: Record<string, unknown> = {
      disputeId,
      decisionType: decision,
      summary: summary.trim(),
      detailedReasoning: detailedReasoning.trim(),
      adminId: 'admin-001',
      decidedAt: new Date().toISOString(),
    }

    // Financial resolution for payment disputes
    if (disputeType === 'payment') {
      const financial: Record<string, unknown> = { currency: 'USD' }
      if (refundAmount) financial.refundAmount = parseFloat(refundAmount)
      if (additionalPayment) financial.additionalPayment = parseFloat(additionalPayment)
      payload.financialResolution = financial
    }

    // Privacy impact for safety cases
    if (isSafetyCase && privacyImpact.trim()) {
      payload.privacyImpactAssessment = privacyImpact.trim()
    }

    submitDecision.mutate(payload)
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-bg-card">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide">
            Decision
          </p>
          {isSafetyCase && (
            <div className="mt-2 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-status-urgent" />
              <span className="text-xs font-body text-status-urgent font-medium">
                Safety Case decisions are permanent and fully audited
              </span>
            </div>
          )}
        </div>

        {/* Decision radio options */}
        <fieldset>
          <legend className="sr-only">Select your decision</legend>
          <div className="space-y-2">
            {decisionOptions.map(({ value, label, description, icon: Icon, color }) => (
              <label
                key={value}
                className={`flex items-start gap-3 rounded-inner border p-3 cursor-pointer transition-colors ${
                  decision === value
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-border hover:border-brand-primary/30'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value={value}
                  checked={decision === value}
                  onChange={() => setDecision(value)}
                  className="sr-only"
                />
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${color}`} />
                <div>
                  <span className={`text-sm font-body font-medium ${color}`}>{label}</span>
                  <p className="text-xs font-body text-text-caption">{description}</p>
                </div>
                {decision === value && (
                  <CheckCircle className="ml-auto h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                )}
              </label>
            ))}
          </div>
          {showValidation && !decision && (
            <p className="mt-1.5 text-xs font-body text-status-urgent">
              Please select a decision type.
            </p>
          )}
        </fieldset>

        {/* Summary */}
        {decision && (
          <>
            <div>
              <label className="block text-xs font-body font-medium text-text-caption uppercase tracking-wide mb-1">
                Summary (2-3 sentences)
              </label>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of the decision and rationale..."
                className="min-h-[80px] resize-none"
              />
              {showValidation && !summary.trim() && (
                <p className="mt-1 text-xs font-body text-status-urgent">Summary is required.</p>
              )}
            </div>

            {/* Detailed Reasoning */}
            <div>
              <label className="block text-xs font-body font-medium text-text-caption uppercase tracking-wide mb-1">
                Detailed Reasoning
              </label>
              <Textarea
                value={detailedReasoning}
                onChange={(e) => setDetailedReasoning(e.target.value)}
                placeholder="Full explanation of the decision, evidence considered, and outcome justification..."
                className="min-h-[120px] resize-none"
              />
              {showValidation && !detailedReasoning.trim() && (
                <p className="mt-1 text-xs font-body text-status-urgent">
                  Detailed reasoning is required.
                </p>
              )}
            </div>

            {/* Financial Resolution (payment disputes only) */}
            {disputeType === 'payment' && (
              <div className="rounded-inner border border-border p-3 space-y-3">
                <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide">
                  Financial Resolution
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-body text-text-caption mb-1">
                      Refund Amount (USD)
                    </label>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full h-9 px-3 text-sm font-body border border-border bg-bg-card rounded-inner focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-text-caption mb-1">
                      Additional Payment (USD)
                    </label>
                    <input
                      type="number"
                      value={additionalPayment}
                      onChange={(e) => setAdditionalPayment(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full h-9 px-3 text-sm font-body border border-border bg-bg-card rounded-inner focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Impact Assessment (safety cases only) */}
            {isSafetyCase && (
              <div className="rounded-inner border border-status-urgent/20 bg-status-urgent/5 p-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-status-urgent" />
                  <label className="text-xs font-body font-medium text-status-urgent uppercase tracking-wide">
                    Privacy Impact Assessment
                  </label>
                </div>
                <Textarea
                  value={privacyImpact}
                  onChange={(e) => setPrivacyImpact(e.target.value)}
                  placeholder="Document any privacy implications of this decision..."
                  className="min-h-[80px] resize-none"
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={submitDecision.isPending}
              className="w-full"
            >
              {submitDecision.isPending ? 'Submitting Decision...' : 'Submit Decision'}
            </Button>

            {submitDecision.isError && (
              <p className="text-xs font-body text-status-urgent text-center">
                Failed to submit decision. Please try again.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
