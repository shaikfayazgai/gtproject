'use client'
import { Tag, Badge } from '@glimmora/ui'
import type { ReviewDetail } from '@glimmora/types'

interface TaskContextPanelProps {
  review: ReviewDetail
}

export function TaskContextPanel({ review }: TaskContextPanelProps) {
  return (
    <div className="h-full overflow-y-auto p-4 bg-bg-card">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <p className="text-xs font-body font-medium text-text-caption uppercase tracking-wide mb-1">
            Task Context
          </p>
          {review.submissionCount > 1 && (
            <Badge status="atrisk">Submission #{review.submissionCount}</Badge>
          )}
        </div>

        {/* Task title */}
        <h2 className="text-base font-display font-semibold text-text-heading leading-snug">
          {review.taskTitle}
        </h2>

        {/* Task brief */}
        <p className="text-sm font-body text-text-body leading-relaxed">
          {review.taskBrief}
        </p>

        <hr className="border-border" />

        {/* Deliverables */}
        <div>
          <p className="text-xs font-body font-semibold text-text-caption uppercase tracking-wide mb-2">
            Deliverables
          </p>
          <ul className="space-y-1.5">
            {review.deliverables.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-body text-text-body">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <hr className="border-border" />

        {/* Required skills */}
        <div>
          <p className="text-xs font-body font-semibold text-text-caption uppercase tracking-wide mb-2">
            Required Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {review.skillTagsRequired.map((skill) => (
              <Tag key={skill} variant="skill">{skill}</Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
