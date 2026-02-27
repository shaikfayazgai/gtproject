'use client'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Button,
  Textarea,
} from '@glimmora/ui'
import { AlertTriangle } from 'lucide-react'

interface FreezeDialogProps {
  projectId: string
  action: 'freeze' | 'unfreeze'
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function FreezeDialog({ projectId, action, open, onOpenChange, onSuccess }: FreezeDialogProps) {
  const queryClient = useQueryClient()
  const [reason, setReason] = useState('')

  const mutation = useMutation({
    mutationFn: async (freezeReason: string) => {
      const res = await fetch(`/api/admin/projects/${projectId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: freezeReason }),
      })
      if (!res.ok) throw new Error(`Failed to ${action} project`)
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-project-freeze-history', projectId] })
      queryClient.invalidateQueries({ queryKey: ['admin-project-detail', projectId] })
      queryClient.invalidateQueries({ queryKey: ['admin-project-interventions', projectId] })
      setReason('')
      onOpenChange(false)
      onSuccess()
    },
  })

  function handleConfirm() {
    if (!reason.trim()) return
    mutation.mutate(reason.trim())
  }

  const isFreeze = action === 'freeze'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-display font-semibold text-text-heading">
            {isFreeze ? 'Freeze Project' : 'Unfreeze Project'}
          </DialogTitle>
          <DialogDescription className="text-sm font-body text-text-caption">
            {isFreeze
              ? 'Freezing will pause all project activity and notify all contributors. This action is logged permanently.'
              : 'Unfreezing will resume all project activity and notify contributors. This action is logged permanently.'}
          </DialogDescription>
        </DialogHeader>

        {isFreeze && (
          <div className="flex items-start gap-3 p-3 rounded-inner bg-status-urgent/5 border border-status-urgent/20 mt-2">
            <AlertTriangle className="h-5 w-5 text-status-urgent shrink-0 mt-0.5" />
            <div className="text-sm font-body text-text-body">
              <p className="font-medium text-status-urgent">Warning</p>
              <p className="mt-1 text-text-caption">
                All active tasks will be paused. Contributors will be notified immediately.
                Payments in progress will be held until the project is unfrozen.
              </p>
            </div>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-body font-medium text-text-heading mb-1">
            Reason <span className="text-status-urgent">*</span>
          </label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={isFreeze
              ? 'Why is this project being frozen?'
              : 'Why is this project being unfrozen?'
            }
            rows={3}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant={isFreeze ? 'destructive' : 'primary'}
            onClick={handleConfirm}
            disabled={!reason.trim() || mutation.isPending}
          >
            {mutation.isPending
              ? (isFreeze ? 'Freezing...' : 'Unfreezing...')
              : (isFreeze ? 'Freeze Project' : 'Unfreeze Project')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
