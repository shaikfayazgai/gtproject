'use client'
import { Card, CardHeader, CardTitle, Progress } from '@glimmora/ui'
import { CheckCircle } from 'lucide-react'
import type { MentorTier } from '@glimmora/types'

interface TierRequirement {
  label: string
  current: number
  target: number
  unit: string
  lowerIsBetter?: boolean
}

interface TierProgressCardProps {
  currentTier: MentorTier
  totalReviews: number
  averageReviewHours: number
  reworkRate: number
  appealsOverturnedRate: number
}

const TIER_COLORS: Record<MentorTier, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  elite: '#A0614A',
}

const TIER_NEXT: Record<MentorTier, MentorTier | null> = {
  bronze: 'silver',
  silver: 'gold',
  gold: 'elite',
  elite: null,
}

const TIER_REQUIREMENTS: Record<MentorTier, { totalReviews: number; avgHours: number; reworkRate: number; appealsRate: number }> = {
  bronze: { totalReviews: 10, avgHours: 12, reworkRate: 0.3, appealsRate: 0.1 },
  silver: { totalReviews: 100, avgHours: 8, reworkRate: 0.2, appealsRate: 0.07 },
  gold: { totalReviews: 500, avgHours: 6, reworkRate: 0.15, appealsRate: 0.05 },
  elite: { totalReviews: 1000, avgHours: 4, reworkRate: 0.1, appealsRate: 0.03 },
}

export function TierProgressCard({
  currentTier,
  totalReviews,
  averageReviewHours,
  reworkRate,
  appealsOverturnedRate,
}: TierProgressCardProps) {
  const nextTier = TIER_NEXT[currentTier]
  const tierColor = TIER_COLORS[currentTier]

  if (!nextTier) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tier Status</CardTitle>
        </CardHeader>
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 rounded-full text-sm font-body font-semibold text-white"
            style={{ backgroundColor: tierColor }}
          >
            {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
          </span>
          <p className="text-sm font-body text-text-caption">You have reached the highest tier!</p>
        </div>
      </Card>
    )
  }

  const nextReqs = TIER_REQUIREMENTS[nextTier]
  const nextTierColor = TIER_COLORS[nextTier]

  const requirements: TierRequirement[] = [
    {
      label: 'Total Reviews',
      current: totalReviews,
      target: nextReqs.totalReviews,
      unit: '',
    },
    {
      label: 'Average Review Time',
      current: averageReviewHours,
      target: nextReqs.avgHours,
      unit: 'h',
      lowerIsBetter: true,
    },
    {
      label: 'Rework Rate',
      current: Math.round(reworkRate * 100),
      target: Math.round(nextReqs.reworkRate * 100),
      unit: '%',
      lowerIsBetter: true,
    },
    {
      label: 'Appeals Overturned Rate',
      current: Math.round(appealsOverturnedRate * 100),
      target: Math.round(nextReqs.appealsRate * 100),
      unit: '%',
      lowerIsBetter: true,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tier Progression</CardTitle>
      </CardHeader>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-sm font-body font-semibold text-white"
            style={{ backgroundColor: tierColor }}
          >
            {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
          </span>
          <span className="text-text-caption text-sm font-body">Current Tier</span>
        </div>
        <span className="text-text-disabled text-sm">→</span>
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-sm font-body font-semibold text-white"
            style={{ backgroundColor: nextTierColor }}
          >
            {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}
          </span>
          <span className="text-text-caption text-sm font-body">Next Tier</span>
        </div>
      </div>

      <div className="space-y-4">
        {requirements.map((req) => {
          const met = req.lowerIsBetter
            ? req.current <= req.target
            : req.current >= req.target

          const barValue = met
            ? 100
            : Math.min(100, Math.round((req.current / req.target) * 100))

          return (
            <div key={req.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-body text-text-body">{req.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-body text-text-caption">
                    {req.current}{req.unit}/{req.target}{req.unit}
                  </span>
                  {met && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
              </div>
              <Progress value={barValue} variant="gradient" />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
