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

interface SkipDialogProps {
  reviewId: string
  trigger: React.ReactNode
}

export function SkipDialog({ reviewId, trigger }: SkipDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const queryClient = useQueryClient()

  const skipMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/mentor/reviews/${reviewId}/skip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      if (!response.ok) throw new Error('Failed to skip review')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      setReason('')
      setOpen(false)
    },
  })

  const isValid = reason.trim().length >= 20

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-display font-semibold text-text-heading">
            Skip this review
          </DialogTitle>
          <DialogDescription className="text-sm font-body text-text-caption">
            This review will be reassigned to the next available mentor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label htmlFor={`skip-reason-${reviewId}`} className="text-sm font-body font-medium text-text-body">
            Reason for skipping
          </label>
          <textarea
            id={`skip-reason-${reviewId}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please explain why you need to skip this review (min 20 characters)..."
            className="w-full min-h-[100px] rounded-inner border border-border bg-bg-app px-3 py-2 text-sm font-body text-text-body placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-y"
          />
          <p className="text-xs text-text-caption">
            {reason.trim().length}/20 characters minimum
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={skipMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => skipMutation.mutate()}
            disabled={!isValid || skipMutation.isPending}
          >
            {skipMutation.isPending ? 'Skipping...' : 'Skip Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
