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
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@glimmora/ui'

interface EscalationFormProps {
  packId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EscalationForm({ packId, open, onOpenChange }: EscalationFormProps) {
  const queryClient = useQueryClient()
  const [reason, setReason] = useState('')
  const [priority, setPriority] = useState<string>('normal')
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/enterprise/evidence/${packId}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, priority }),
      })
      if (!res.ok) throw new Error('Failed to escalate')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] })
      queryClient.invalidateQueries({ queryKey: ['escalations'] })
      setReason('')
      setPriority('normal')
      setError(null)
      onOpenChange(false)
    },
  })

  function handleSubmit() {
    if (!reason.trim()) {
      setError('Escalation reason is required')
      return
    }
    setError(null)
    mutation.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escalate to Mentor</DialogTitle>
          <DialogDescription>
            Escalate this evidence pack for mentor review. The assigned mentor will evaluate and provide a decision.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label htmlFor="escalation-reason" className="block text-sm font-body font-medium text-text-heading mb-1">
              Why does this need mentor review?
            </label>
            <textarea
              id="escalation-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the concern that requires mentor expertise..."
              rows={4}
              className="w-full rounded-inner border border-border bg-bg-card px-3 py-2 text-sm font-body text-text-body placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
            />
            {error && (
              <p className="mt-1 text-xs text-status-urgent">{error}</p>
            )}
          </div>
          <div>
            <label htmlFor="escalation-priority" className="block text-sm font-body font-medium text-text-heading mb-1">
              Priority
            </label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="escalation-priority" className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Escalating...' : 'Escalate to Mentor'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
