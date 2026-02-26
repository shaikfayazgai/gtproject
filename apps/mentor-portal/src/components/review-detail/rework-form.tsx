'use client'

interface ReworkFormProps {
  reworkItems: string
  guidanceNotes: string
  onChange: (field: string, value: string) => void
  showValidation?: boolean
}

export function ReworkForm({ reworkItems, guidanceNotes, onChange, showValidation }: ReworkFormProps) {
  const reworkItemsEmpty = showValidation && !reworkItems.trim()

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="rework-items"
          className="block text-sm font-body font-medium text-text-body mb-1.5"
        >
          Items to Address
          <span className="ml-1 text-xs text-red-500 font-normal">*</span>
        </label>
        <textarea
          id="rework-items"
          rows={4}
          required
          value={reworkItems}
          onChange={(e) => onChange('reworkItems', e.target.value)}
          placeholder="List specific items the contributor must fix or improve..."
          className={`w-full rounded-inner border bg-bg-card px-3 py-2 text-sm font-body text-text-body placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none ${
            reworkItemsEmpty
              ? 'border-red-500 focus:ring-red-500'
              : 'border-border'
          }`}
        />
        {reworkItemsEmpty && (
          <p className="mt-1 text-xs font-body text-red-500">
            Please specify the items to address before submitting.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="guidance-notes"
          className="block text-sm font-body font-medium text-text-body mb-1.5"
        >
          Guidance Notes
          <span className="ml-1 text-xs text-text-caption font-normal">(optional)</span>
        </label>
        <textarea
          id="guidance-notes"
          rows={3}
          value={guidanceNotes}
          onChange={(e) => onChange('guidanceNotes', e.target.value)}
          placeholder="Additional guidance to help the contributor improve..."
          className="w-full rounded-inner border border-border bg-bg-card px-3 py-2 text-sm font-body text-text-body placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none"
        />
      </div>
    </div>
  )
}
