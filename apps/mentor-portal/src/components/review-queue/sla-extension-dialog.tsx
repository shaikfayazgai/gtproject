'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from '@glimmora/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface SLAExtensionDialogProps {
  reviewId: string
  trigger: React.ReactNode
}

export function SLAExtensionDialog({ reviewId, trigger }: SLAExtensionDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const extensionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/mentor/reviews/${reviewId}/sla-extension`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      if (!response.ok) throw new Error('Failed to request SLA extension')
      return response.json() as Promise<{ status: string; message: string }>
    },
    onSuccess: (data) => {
      setConfirmationMessage(data.message)
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      setTimeout(() => {
        setConfirmationMessage(null)
        setReason('')
        setOpen(false)
      }, 2000)
    },
  })

  const isValid = reason.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!extensionMutation.isPending && !confirmationMessage) {
        setOpen(value)
      }
    }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        {confirmationMessage ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-status-success/10 flex items-center justify-center">
              <svg className="h-5 w-5 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-body text-text-body">{confirmationMessage}</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-display font-semibold text-text-heading">
                Request SLA Extension
              </DialogTitle>
              <DialogDescription className="text-sm font-body text-text-caption">
                Extensions require Admin approval. Your request will be reviewed within 24 hours.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <label htmlFor={`extension-reason-${reviewId}`} className="text-sm font-body font-medium text-text-body">
                Reason for extension
              </label>
              <textarea
                id={`extension-reason-${reviewId}`}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why you need more time for this review..."
                className="w-full min-h-[100px] rounded-inner border border-border bg-bg-app px-3 py-2 text-sm font-body text-text-body placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-y"
              />
            </div>

            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setOpen(false)}
                disabled={extensionMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={() => extensionMutation.mutate()}
                disabled={!isValid || extensionMutation.isPending}
              >
                {extensionMutation.isPending ? 'Submitting...' : 'Request Extension'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
