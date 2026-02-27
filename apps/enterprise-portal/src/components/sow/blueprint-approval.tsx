'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Button, Checkbox, Card, CardContent, CardHeader, CardTitle } from '@glimmora/ui'
import type { Blueprint } from '@glimmora/types'
import { OTPConfirmationDialog } from '@/components/shared'

interface BlueprintApprovalProps {
  blueprint: Blueprint
  sowId: string
}

const CHECKLIST_ITEMS = [
  {
    id: 'review-tasks',
    label: 'I have reviewed all task descriptions and acceptance criteria',
  },
  {
    id: 'verify-budget',
    label: 'I have verified the budget allocation for each milestone',
  },
  {
    id: 'confirm-timeline',
    label: 'I have confirmed the timeline is acceptable',
  },
  {
    id: 'understand-launch',
    label: 'I understand that approved projects will begin team formation immediately',
  },
]

export function BlueprintApproval({ blueprint, sowId }: BlueprintApprovalProps) {
  const router = useRouter()
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [otpOpen, setOtpOpen] = useState(false)

  const allChecked = checkedItems.size === CHECKLIST_ITEMS.length

  const approveMutation = useMutation({
    mutationFn: async (otp: string) => {
      const res = await fetch(`/api/enterprise/blueprint/${sowId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      })
      if (!res.ok) throw new Error('Approval failed')
      return res.json()
    },
    onSuccess: () => {
      router.push('/projects')
    },
  })

  function toggleItem(itemId: string, checked: boolean) {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(itemId)
      } else {
        next.delete(itemId)
      }
      return next
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Project summary */}
      <Card>
        <CardHeader>
          <CardTitle>Project Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-body text-text-caption">Project Name</p>
              <p className="text-sm font-body font-medium text-text-heading">{blueprint.projectName}</p>
            </div>
            <div>
              <p className="text-xs font-body text-text-caption">Total Budget</p>
              <p className="text-sm font-body font-medium text-text-heading">${blueprint.totalBudget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-body text-text-caption">Timeline</p>
              <p className="text-sm font-body font-medium text-text-heading">
                {blueprint.timeline.startDate} to {blueprint.timeline.endDate}
              </p>
            </div>
            <div>
              <p className="text-xs font-body text-text-caption">Tasks / Milestones</p>
              <p className="text-sm font-body font-medium text-text-heading">
                {blueprint.tasks.length} tasks across {blueprint.milestones.length} milestones
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-launch checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-Launch Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {CHECKLIST_ITEMS.map((item) => (
              <Checkbox
                key={item.id}
                id={item.id}
                label={item.label}
                checked={checkedItems.has(item.id)}
                onCheckedChange={(checked) => toggleItem(item.id, checked === true)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => router.push(`/sow/${sowId}/editor`)}>
          Back to Editor
        </Button>
        <Button
          onClick={() => setOtpOpen(true)}
          disabled={!allChecked || approveMutation.isPending}
        >
          {approveMutation.isPending ? 'Approving...' : 'Approve & Launch Project'}
        </Button>
      </div>

      {approveMutation.error && (
        <p className="text-sm text-status-urgent text-center">
          Approval failed. Please try again.
        </p>
      )}

      {/* OTP Confirmation */}
      <OTPConfirmationDialog
        open={otpOpen}
        onOpenChange={setOtpOpen}
        title="Approve Blueprint"
        description="Enter the 6-digit code sent to your email to confirm project launch."
        onConfirm={async (otp) => {
          await approveMutation.mutateAsync(otp)
        }}
      />
    </div>
  )
}
