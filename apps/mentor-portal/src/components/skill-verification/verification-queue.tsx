'use client'
import { PageHeader, Skeleton } from '@glimmora/ui'
import { useQuery } from '@tanstack/react-query'
import { VerificationItemCard } from './verification-item-card'
import type { SkillTagVerificationRequest } from '@glimmora/types'

export function VerificationQueue() {
  const { data, isLoading } = useQuery<{ data: SkillTagVerificationRequest[] }>({
    queryKey: ['skill-verification'],
    queryFn: () => fetch('/api/mentor/skill-verification').then(r => r.json()),
  })

  const items = data?.data ?? []

  return (
    <div className="p-6 space-y-6">
      <div>
        <PageHeader title="Skill Tag Verification" />
        <p className="text-sm font-body text-text-caption mt-1">
          Verify or dispute contributor skill claims based on their evidence
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-card" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-bg-card rounded-card shadow-card p-8 text-center">
          <p className="text-sm font-body text-text-caption">
            No pending skill verification requests at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <VerificationItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
