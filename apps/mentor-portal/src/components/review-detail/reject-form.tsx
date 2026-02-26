'use client'
import { AlertTriangle } from 'lucide-react'

interface RejectFormProps {
  rejectionReason: string
  nonComplianceEvidence: string
  onChange: (field: string, value: string) => void
  showValidation?: boolean
}

export function RejectForm({
  rejectionReason,
  nonComplianceEvidence,
  onChange,
  showValidation,
}: RejectFormProps) {
  const rejectionReasonEmpty = showValidation && !rejectionReason.trim()
  const nonComplianceEmpty = showValidation && !nonComplianceEvidence.trim()

  return (
    <div className="space-y-3">
      {/* Warning banner */}
      <div className="flex items-start gap-2.5 rounded-inner border border-amber-200 bg-amber-50 p-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-xs font-body text-amber-800 leading-snug">
          <strong className="font-semibold">Rejection is a serious action.</strong> It requires
          evidence of deliberate non-compliance. If the work simply needs improvement, use
          &quot;Rework Required&quot; instead.
        </p>
      </div>

      <div>
        <label
          htmlFor="rejection-reason"
          className="block text-sm font-body font-medium text-text-body mb-1.5"
        >
          Rejection Reason
          <span className="ml-1 text-xs text-red-500 font-normal">*</span>
        </label>
        <textarea
          id="rejection-reason"
          rows={3}
          required
          value={rejectionReason}
          onChange={(e) => onChange('rejectionReason', e.target.value)}
          placeholder="Explain why this submission is being rejected..."
          className={`w-full rounded-inner border bg-bg-card px-3 py-2 text-sm font-body text-text-body placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none ${
            rejectionReasonEmpty
              ? 'border-red-500 focus:ring-red-500'
              : 'border-border'
          }`}
        />
        {rejectionReasonEmpty && (
          <p className="mt-1 text-xs font-body text-red-500">
            Please provide a rejection reason.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="non-compliance-evidence"
          className="block text-sm font-body font-medium text-text-body mb-1.5"
        >
          Non-Compliance Evidence
          <span className="ml-1 text-xs text-red-500 font-normal">*</span>
        </label>
        <textarea
          id="non-compliance-evidence"
          rows={3}
          required
          value={nonComplianceEvidence}
          onChange={(e) => onChange('nonComplianceEvidence', e.target.value)}
          placeholder="Describe the specific evidence of deliberate non-compliance..."
          className={`w-full rounded-inner border bg-bg-card px-3 py-2 text-sm font-body text-text-body placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none ${
            nonComplianceEmpty
              ? 'border-red-500 focus:ring-red-500'
              : 'border-border'
          }`}
        />
        {nonComplianceEmpty && (
          <p className="mt-1 text-xs font-body text-red-500">
            Please describe the non-compliance evidence.
          </p>
        )}
      </div>
    </div>
  )
}
