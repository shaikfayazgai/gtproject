'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@glimmora/ui'
import { CheckCircle, RotateCcw, XCircle } from 'lucide-react'
import { useReviewDraftStore, type ReviewDraft } from '@/store/review-draft-store'
import { ApproveForm } from './approve-form'
import { ReworkForm } from './rework-form'
import { RejectForm } from './reject-form'

interface ReviewFormPanelProps {
  reviewId: string
}

type Decision = 'approve' | 'rework_required' | 'reject'

const DECISION_OPTIONS: { value: Decision; label: string; color: string }[] = [
  { value: 'approve', label: 'Approve', color: 'text-green-600' },
  { value: 'rework_required', label: 'Rework Required', color: 'text-amber-600' },
  { value: 'reject', label: 'Reject', color: 'text-red-600' },
]

export function ReviewFormPanel({ reviewId }: ReviewFormPanelProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { getDraft, saveDraft, clearDraft } = useReviewDraftStore()

  // Initialize from persisted draft
  const storedDraft = getDraft(reviewId)
  const [decision, setDecision] = useState<Decision | undefined>(storedDraft?.decision)
  const [feedbackComment, setFeedbackComment] = useState(storedDraft?.feedbackComment ?? '')
  const [reworkItems, setReworkItems] = useState(storedDraft?.reworkItems ?? '')
  const [guidanceNotes, setGuidanceNotes] = useState(storedDraft?.guidanceNotes ?? '')
  const [rejectionReason, setRejectionReason] = useState(storedDraft?.rejectionReason ?? '')
  const [nonComplianceEvidence, setNonComplianceEvidence] = useState(
    storedDraft?.nonComplianceEvidence ?? ''
  )
  const [draftSaved, setDraftSaved] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  // Auto-save draft debounced at 1.5s
  useEffect(() => {
    const draft: ReviewDraft = {
      decision,
      feedbackComment,
      reworkItems,
      guidanceNotes,
      rejectionReason,
      nonComplianceEvidence,
    }
    const timeout = setTimeout(() => {
      saveDraft(reviewId, draft)
      setDraftSaved(true)
      setTimeout(() => setDraftSaved(false), 2000)
    }, 1500)
    return () => clearTimeout(timeout)
  }, [
    decision,
    feedbackComment,
    reworkItems,
    guidanceNotes,
    rejectionReason,
    nonComplianceEvidence,
    reviewId,
    saveDraft,
  ])

  const submitDecision = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await fetch(`/api/mentor/reviews/${reviewId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to submit decision')
      return res.json()
    },
    onSuccess: () => {
      clearDraft(reviewId)
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      router.push('/queue')
    },
  })

  function handleFormFieldChange(field: string, value: string) {
    if (field === 'reworkItems') setReworkItems(value)
    else if (field === 'guidanceNotes') setGuidanceNotes(value)
    else if (field === 'rejectionReason') setRejectionReason(value)
    else if (field === 'nonComplianceEvidence') setNonComplianceEvidence(value)
  }

  function handleSubmit() {
    setShowValidation(true)

    // Validate required fields
    if (!decision) return

    if (decision === 'rework_required' && !reworkItems.trim()) return
    if (decision === 'reject' && (!rejectionReason.trim() || !nonComplianceEvidence.trim())) return

    const payload: Record<string, unknown> = { type: decision }
    if (decision === 'approve') {
      if (feedbackComment.trim()) payload.feedbackComment = feedbackComment
    } else if (decision === 'rework_required') {
      payload.reworkItems = reworkItems
      if (guidanceNotes.trim()) payload.guidanceNotes = guidanceNotes
    } else if (decision === 'reject') {
      payload.rejectionReason = rejectionReason
      payload.nonComplianceEvidence = nonComplianceEvidence
    }

    submitDecision.mutate(payload)
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-bg-card">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide">
            Review Decision
          </p>
          {draftSaved && (
            <span className="text-xs font-body text-text-caption animate-fade-in">
              Draft saved
            </span>
          )}
        </div>

        {/* Decision radio */}
        <fieldset>
          <legend className="sr-only">Select your decision</legend>
          <div className="space-y-2">
            {DECISION_OPTIONS.map(({ value, label, color }) => (
              <label
                key={value}
                className={`flex items-center gap-3 rounded-inner border p-3 cursor-pointer transition-colors ${
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
                <span
                  className={`h-3 w-3 rounded-full shrink-0 ${
                    value === 'approve'
                      ? 'bg-green-500'
                      : value === 'rework_required'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}
                />
                <span className={`text-sm font-body font-medium ${color}`}>{label}</span>
                {decision === value && (
                  value === 'approve' ? (
                    <CheckCircle className="ml-auto h-4 w-4 text-green-500" />
                  ) : value === 'rework_required' ? (
                    <RotateCcw className="ml-auto h-4 w-4 text-amber-500" />
                  ) : (
                    <XCircle className="ml-auto h-4 w-4 text-red-500" />
                  )
                )}
              </label>
            ))}
          </div>
          {showValidation && !decision && (
            <p className="mt-1.5 text-xs font-body text-red-500">Please select a decision.</p>
          )}
        </fieldset>

        {/* Conditional form */}
        {decision === 'approve' && (
          <ApproveForm feedbackComment={feedbackComment} onChange={setFeedbackComment} />
        )}
        {decision === 'rework_required' && (
          <ReworkForm
            reworkItems={reworkItems}
            guidanceNotes={guidanceNotes}
            onChange={handleFormFieldChange}
            showValidation={showValidation}
          />
        )}
        {decision === 'reject' && (
          <RejectForm
            rejectionReason={rejectionReason}
            nonComplianceEvidence={nonComplianceEvidence}
            onChange={handleFormFieldChange}
            showValidation={showValidation}
          />
        )}

        {/* Submit button */}
        {decision && (
          <Button
            onClick={handleSubmit}
            disabled={submitDecision.isPending}
            className="w-full"
          >
            {submitDecision.isPending
              ? 'Submitting...'
              : decision === 'approve'
                ? 'Submit Approval'
                : decision === 'rework_required'
                  ? 'Request Rework'
                  : 'Submit Rejection'}
          </Button>
        )}

        {submitDecision.isError && (
          <p className="text-xs font-body text-red-500 text-center">
            Failed to submit. Please try again.
          </p>
        )}
      </div>
    </div>
  )
}
