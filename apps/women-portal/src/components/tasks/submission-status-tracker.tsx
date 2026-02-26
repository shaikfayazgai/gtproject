'use client'
import { Badge } from '@glimmora/ui'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import type { Task, APIResponse } from '@glimmora/types'

const REVIEW_STATUSES = [
  'evidence-submitted',
  'under-review',
  'rework-required',
  'approved',
  'rejected',
]

const STATUS_BADGE_MAP: Record<
  string,
  'urgent' | 'normal' | 'inprogress' | 'done' | 'atrisk'
> = {
  'evidence-submitted': 'inprogress',
  'under-review': 'atrisk',
  'rework-required': 'urgent',
  approved: 'done',
  rejected: 'urgent',
}

export function SubmissionStatusTracker() {
  const t = useTranslations('submissions')
  const { data } = useQuery<APIResponse<Task[]>>({
    queryKey: ['tasks', 'all'],
    queryFn: () => fetch('/api/tasks').then((r) => r.json()),
  })

  const submittedTasks = (data?.data ?? []).filter((task) =>
    REVIEW_STATUSES.includes(task.status)
  )

  return (
    <div className="space-y-4">
      {submittedTasks.map((task) => (
        <Link
          key={task.id}
          href={
            task.status === 'rework-required'
              ? `/tasks/${task.id}/rework`
              : `/tasks/${task.id}`
          }
          className="block bg-bg-card rounded-card shadow-card p-4 hover:shadow-card-hover transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-body font-medium text-text-heading">
                {task.title}
              </h3>
              <p className="text-xs font-body text-text-caption mt-1">
                Submitted {new Date(task.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <Badge status={STATUS_BADGE_MAP[task.status] ?? 'normal'}>
              {task.status}
            </Badge>
          </div>

          {/* Pipeline visualization */}
          <div className="flex items-center gap-1 mt-3">
            {['Submitted', 'Under Review', 'Decision'].map((step, i) => {
              const stepIndex =
                task.status === 'evidence-submitted'
                  ? 0
                  : task.status === 'under-review'
                    ? 1
                    : 2
              const isComplete = i < stepIndex
              const isActive = i === stepIndex
              return (
                <div key={step} className="flex items-center gap-1 flex-1">
                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      isComplete || isActive
                        ? task.status === 'approved'
                          ? 'bg-status-success'
                          : task.status === 'rework-required'
                            ? 'bg-status-warning'
                            : 'bg-brand-primary'
                        : 'bg-hover'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-body shrink-0 ${
                      isActive ? 'text-text-heading font-medium' : 'text-text-caption'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
        </Link>
      ))}
      {submittedTasks.length === 0 && (
        <p className="text-center text-sm font-body text-text-caption py-8">
          {t('noSubmissions')}
        </p>
      )}
    </div>
  )
}
