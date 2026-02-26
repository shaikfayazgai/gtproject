'use client'
import { GradientCard, PageHeader, Skeleton, Tag, Badge } from '@glimmora/ui'
import { useQuery } from '@tanstack/react-query'
import { TierProgressCard } from './tier-progress-card'
import { ImpactMetricsCard } from './impact-metrics-card'
import type { MentorTier } from '@glimmora/types'

interface MentorProfileData {
  id: string
  displayName: string
  bio: string
  tier: MentorTier
  expertiseAreas: string[]
  skillTags: Array<{ tag: string; verified: boolean }>
  joinedAt: string
  totalReviews: number
  averageReviewHours: number
  reworkRate: number
  appealsOverturnedRate: number
  pendingReviews: number
}

const TIER_COLORS: Record<MentorTier, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  elite: '#A0614A',
}

export function MentorProfilePage() {
  const { data, isLoading } = useQuery<MentorProfileData>({
    queryKey: ['mentor', 'profile', 'full'],
    queryFn: () => fetch('/api/mentor/profile').then(r => r.json()),
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48 rounded-inner" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-card" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-card" />
      </div>
    )
  }

  if (!data) return null

  const tierColor = TIER_COLORS[data.tier]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <PageHeader title={data.displayName} />
          <p className="text-sm font-body text-text-caption mt-1">{data.bio}</p>
          <p className="text-xs font-body text-text-disabled mt-1">
            Member since {new Date(data.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span
          className="px-4 py-1.5 rounded-full text-sm font-body font-semibold text-white shrink-0"
          style={{ backgroundColor: tierColor }}
        >
          {data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} Mentor
        </span>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GradientCard gradient="primary">
          <p className="text-sm font-body opacity-90">Total Reviews</p>
          <p className="text-3xl font-display font-semibold mt-1">{data.totalReviews}</p>
        </GradientCard>

        <GradientCard gradient="nature">
          <p className="text-sm font-body opacity-90">Avg Review Time</p>
          <p className="text-3xl font-display font-semibold mt-1">{data.averageReviewHours.toFixed(1)}h</p>
        </GradientCard>

        <GradientCard
          gradient="primary"
          style={{ background: 'linear-gradient(135deg, #C4A23A, #3A8FA0)' }}
        >
          <p className="text-sm font-body opacity-90">Rework Rate</p>
          <p className="text-3xl font-display font-semibold mt-1">{Math.round(data.reworkRate * 100)}%</p>
        </GradientCard>
      </div>

      {/* Tier Progress */}
      <TierProgressCard
        currentTier={data.tier}
        totalReviews={data.totalReviews}
        averageReviewHours={data.averageReviewHours}
        reworkRate={data.reworkRate}
        appealsOverturnedRate={data.appealsOverturnedRate}
      />

      {/* Impact Metrics */}
      <ImpactMetricsCard
        metrics={{
          totalReviews: data.totalReviews,
          averageReviewHours: data.averageReviewHours,
          reworkRate: data.reworkRate,
          appealsOverturnedRate: data.appealsOverturnedRate,
          pendingReviews: data.pendingReviews,
        }}
      />

      {/* Expertise Tags */}
      <div className="bg-bg-card rounded-card shadow-card p-5">
        <h3 className="text-lg font-display font-semibold text-text-heading mb-4">Expertise & Skill Tags</h3>

        {data.expertiseAreas.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-body text-text-caption uppercase tracking-wider mb-2">Expertise Areas</p>
            <div className="flex flex-wrap gap-2">
              {data.expertiseAreas.map((area) => (
                <Tag key={area} variant="skill">{area}</Tag>
              ))}
            </div>
          </div>
        )}

        {data.skillTags.length > 0 && (
          <div>
            <p className="text-xs font-body text-text-caption uppercase tracking-wider mb-2">Skill Tags</p>
            <div className="flex flex-wrap gap-2">
              {data.skillTags.map((item) => (
                <div key={item.tag} className="flex items-center gap-1.5">
                  <Tag variant="skill">{item.tag}</Tag>
                  {item.verified ? (
                    <Badge status="done">Verified</Badge>
                  ) : (
                    <Badge status="normal">Pending</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
