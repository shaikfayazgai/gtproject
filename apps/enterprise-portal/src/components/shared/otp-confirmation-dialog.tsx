'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  OTPInput,
} from '@glimmora/ui'

interface OTPConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: (otp: string) => Promise<void>
}

export function OTPConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: OTPConfirmationDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleComplete(otp: string) {
    setLoading(true)
    setError(null)
    try {
      await onConfirm(otp)
      onOpenChange(false)
    } catch {
      setError('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <OTPInput length={6} onComplete={handleComplete} />
          {error && <p className="text-sm text-status-urgent">{error}</p>}
          {loading && <p className="text-sm text-text-caption">Verifying...</p>}
        </div>
        <div className="flex justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
