'use client'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from '@glimmora/ui'

interface ReworkRequestFormProps {
  packId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReworkRequestForm({ packId, open, onOpenChange }: ReworkRequestFormProps) {
  const queryClient = useQueryClient()
  const [reason, setReason] = useState('')
  const [itemsToAddress, setItemsToAddress] = useState('')
  const [errors, setErrors] = useState<{ reason?: string; itemsToAddress?: string }>({})

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/enterprise/evidence/${packId}/rework`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, itemsToAddress }),
      })
      if (!res.ok) throw new Error('Failed to submit rework request')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] })
      setReason('')
      setItemsToAddress('')
      setErrors({})
      onOpenChange(false)
    },
  })

  function handleSubmit() {
    const newErrors: { reason?: string; itemsToAddress?: string } = {}
    if (!reason.trim()) newErrors.reason = 'Rework reason is required'
    if (!itemsToAddress.trim()) newErrors.itemsToAddress = 'Items to address are required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    mutation.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Rework</DialogTitle>
          <DialogDescription>
            Provide feedback on what needs to be improved in this evidence pack.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label htmlFor="rework-reason" className="block text-sm font-body font-medium text-text-heading mb-1">
              Why is this evidence pack being returned?
            </label>
            <textarea
              id="rework-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe why this evidence is insufficient..."
              rows={3}
              className="w-full rounded-inner border border-border bg-bg-card px-3 py-2 text-sm font-body text-text-body placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
            />
            {errors.reason && (
              <p className="mt-1 text-xs text-status-urgent">{errors.reason}</p>
            )}
          </div>
          <div>
            <label htmlFor="rework-items" className="block text-sm font-body font-medium text-text-heading mb-1">
              List specific items the contributor must fix or improve
            </label>
            <textarea
              id="rework-items"
              value={itemsToAddress}
              onChange={(e) => setItemsToAddress(e.target.value)}
              placeholder="1. Fix authentication flow&#10;2. Add missing test coverage&#10;3. Update API documentation"
              rows={4}
              className="w-full rounded-inner border border-border bg-bg-card px-3 py-2 text-sm font-body text-text-body placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
            />
            {errors.itemsToAddress && (
              <p className="mt-1 text-xs text-status-urgent">{errors.itemsToAddress}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Submitting...' : 'Request Rework'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
