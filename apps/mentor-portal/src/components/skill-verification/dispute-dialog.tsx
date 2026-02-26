'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Textarea,
} from '@glimmora/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface DisputeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  verificationId: string
}

export function DisputeDialog({ open, onOpenChange, verificationId }: DisputeDialogProps) {
  const [reason, setReason] = useState('')
  const queryClient = useQueryClient()

  const disputeMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const res = await fetch(`/api/mentor/skill-verification/${id}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill-verification'] })
      setReason('')
      onOpenChange(false)
    },
  })

  const handleSubmit = () => {
    if (!reason.trim()) return
    disputeMutation.mutate({ id: verificationId, reason: reason.trim() })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dispute Skill Claim</DialogTitle>
          <DialogDescription>
            Provide a reason for disputing this skill tag verification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <label htmlFor="dispute-reason" className="block text-sm font-body font-medium text-text-body">
            Reason for dispute <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="dispute-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this skill claim is not supported by the evidence..."
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setReason('')
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reason.trim() || disputeMutation.isPending}
            loading={disputeMutation.isPending}
          >
            Submit Dispute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
