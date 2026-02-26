'use client'
import Link from 'next/link'
import { Badge, Tag } from '@glimmora/ui'
import { SLATimer } from './sla-timer'
import { SkipDialog } from './skip-dialog'
import { SLAExtensionDialog } from './sla-extension-dialog'
import type { ReviewQueueItem } from '@glimmora/types'

interface ReviewQueueItemCardProps {
  item: ReviewQueueItem
}

function CardBody({ item }: { item: ReviewQueueItem }) {
  const visibleTags = item.skillTags.slice(0, 3)
  const overflowCount = item.skillTags.length - 3

  return (
    <div className="bg-bg-card border border-border rounded-card p-4 hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-text-heading text-sm font-medium truncate">
            {item.taskTitle}
          </h3>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {visibleTags.map((tag) => (
              <Tag key={tag} variant="skill">{tag}</Tag>
            ))}
            {overflowCount > 0 && (
              <span className="text-xs text-text-caption">+{overflowCount}</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            {item.submissionCount > 1 && (
              <Badge status="atrisk">Resubmission #{item.submissionCount}</Badge>
            )}

            {item.status === 'pending' && (
              <SLATimer deadline={item.slaDeadline} />
            )}

            {item.status === 'in_progress' && item.hasDraft && (
              <Badge status="inprogress">Draft saved</Badge>
            )}

            {item.hasSLAExtensionPending && (
              <Badge status="atrisk">Extension Requested</Badge>
            )}

            <span className="text-xs text-text-caption">
              Submitted {new Date(item.submittedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {item.status === 'pending' && (
          <div className="flex flex-col gap-1.5 shrink-0" onClick={(e) => e.preventDefault()}>
            <SkipDialog
              reviewId={item.id}
              trigger={
                <button
                  type="button"
                  className="text-xs text-text-caption hover:text-text-body transition-colors px-2 py-1 rounded-inner hover:bg-hover"
                >
                  Skip
                </button>
              }
            />
            {!item.hasSLAExtensionPending && (
              <SLAExtensionDialog
                reviewId={item.id}
                trigger={
                  <button
                    type="button"
                    className="text-xs text-text-caption hover:text-text-body transition-colors px-2 py-1 rounded-inner hover:bg-hover"
                  >
                    Extend SLA
                  </button>
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function ReviewQueueItemCard({ item }: ReviewQueueItemCardProps) {
  if (item.status === 'completed') {
    return <CardBody item={item} />
  }

  return (
    <Link href={`/queue/${item.id}`} className="block">
      <CardBody item={item} />
    </Link>
  )
}
