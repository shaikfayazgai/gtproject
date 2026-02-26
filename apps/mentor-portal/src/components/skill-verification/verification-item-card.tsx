'use client'
import { useState } from 'react'
import { Tag, Badge, Button } from '@glimmora/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DisputeDialog } from './dispute-dialog'
import type { SkillTagVerificationRequest } from '@glimmora/types'

interface VerificationItemCardProps {
  item: SkillTagVerificationRequest
}

const STATUS_BADGE: Record<SkillTagVerificationRequest['status'], React.ReactNode> = {
  pending: <Badge status="normal">Pending</Badge>,
  verified: <Badge status="done">Verified</Badge>,
  disputed: <Badge status="atrisk">Disputed</Badge>,
}

export function VerificationItemCard({ item }: VerificationItemCardProps) {
  const [disputeOpen, setDisputeOpen] = useState(false)
  const queryClient = useQueryClient()

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/mentor/skill-verification/${id}/verify`, {
        method: 'POST',
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill-verification'] })
    },
  })

  return (
    <div className="bg-bg-card border border-border rounded-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Tag variant="skill">{item.skillTag}</Tag>
            {STATUS_BADGE[item.status]}
          </div>

          <p className="text-xs font-body text-text-caption mb-1">
            Contributor: <span className="font-medium text-text-body">#{item.contributorSeed}</span>
          </p>

          <p className="text-xs font-body text-text-caption mb-1">
            Evidence items: {item.evidenceIds.length}
          </p>

          <p className="text-xs font-body text-text-disabled">
            Submitted {new Date(item.submittedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        {item.status === 'pending' && (
          <div className="flex flex-col gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => verifyMutation.mutate(item.id)}
              disabled={verifyMutation.isPending}
              loading={verifyMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Verify
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setDisputeOpen(true)}
            >
              Dispute
            </Button>
          </div>
        )}
      </div>

      <DisputeDialog
        open={disputeOpen}
        onOpenChange={setDisputeOpen}
        verificationId={item.id}
      />
    </div>
  )
}
