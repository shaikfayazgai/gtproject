'use client'
import { Badge, Button } from '@glimmora/ui'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import type { EvidencePack } from '@glimmora/types'

interface ReworkRequestViewProps {
  taskId: string
}

export function ReworkRequestView({ taskId }: ReworkRequestViewProps) {
  const t = useTranslations('rework')
  const { data } = useQuery<{ data: EvidencePack }>({
    queryKey: ['evidence', taskId],
    queryFn: () => fetch(`/api/tasks/${taskId}/evidence`).then((r) => r.json()),
  })

  const pack = data?.data
  if (!pack) return null

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Badge status="urgent">Rework Required</Badge>
      </div>

      {/* Feedback from reviewer */}
      <div className="bg-status-urgent/5 border border-status-urgent/20 rounded-card p-6">
        <h2 className="font-display text-lg font-semibold text-text-heading mb-3">
          {t('feedback')}
        </h2>
        {pack.evidenceItems
          .filter((e) => e.reviewerFeedback)
          .map((item) => (
            <div key={item.id} className="mb-4 last:mb-0">
              <p className="text-sm font-body text-text-body whitespace-pre-wrap">
                {item.reviewerFeedback}
              </p>
              {item.reworkItems && item.reworkItems.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-body font-medium text-text-heading uppercase tracking-wider mb-2">
                    {t('items')}
                  </p>
                  <ul className="space-y-1">
                    {item.reworkItems.map((ri, i) => (
                      <li
                        key={i}
                        className="text-sm font-body text-text-body flex items-start gap-2"
                      >
                        <span className="text-status-urgent mt-0.5">-</span>
                        {ri}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
      </div>

      <Link href={`/tasks/${taskId}/submit`}>
        <Button variant="primary" className="w-full">
          {t('resubmit')}
        </Button>
      </Link>
    </div>
  )
}
