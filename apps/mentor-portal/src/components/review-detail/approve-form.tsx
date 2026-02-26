'use client'

interface ApproveFormProps {
  feedbackComment: string
  onChange: (value: string) => void
}

export function ApproveForm({ feedbackComment, onChange }: ApproveFormProps) {
  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="feedback-comment"
          className="block text-sm font-body font-medium text-text-body mb-1.5"
        >
          Feedback Comment
          <span className="ml-1 text-xs text-text-caption font-normal">(optional)</span>
        </label>
        <textarea
          id="feedback-comment"
          rows={4}
          value={feedbackComment}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Optional feedback for the contributor..."
          className="w-full rounded-inner border border-border bg-bg-card px-3 py-2 text-sm font-body text-text-body placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none"
        />
      </div>
    </div>
  )
}
