'use client'
import { GradientCard, Skeleton } from '@glimmora/ui'
import { useQuery } from '@tanstack/react-query'

interface MentorProfileData {
  pendingReviews: number
  totalReviews: number
  averageReviewHours: number
}

export function MentorKPIRow() {
  const { data, isLoading } = useQuery({
    queryKey: ['mentor', 'profile', 'full'],
    queryFn: async () => {
      const response = await fetch('/api/mentor/profile')
      if (!response.ok) throw new Error('Failed to fetch mentor profile')
      return response.json() as Promise<MentorProfileData>
    },
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-card" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <GradientCard gradient="primary">
        <p className="text-sm font-body opacity-90">Pending Reviews</p>
        <p className="text-3xl font-display font-semibold mt-1">
          {data?.pendingReviews ?? 0}
        </p>
      </GradientCard>

      <GradientCard gradient="nature">
        <p className="text-sm font-body opacity-90">Total Reviews</p>
        <p className="text-3xl font-display font-semibold mt-1">
          {data?.totalReviews ?? 0}
        </p>
      </GradientCard>

      <GradientCard
        gradient="primary"
        style={{ background: 'linear-gradient(135deg, #4A6741 0%, #3A8FA0 100%)' }}
      >
        <p className="text-sm font-body opacity-90">Avg Review Time</p>
        <p className="text-3xl font-display font-semibold mt-1">
          {data?.averageReviewHours?.toFixed(1) ?? '0.0'}h
        </p>
      </GradientCard>
    </div>
  )
}
