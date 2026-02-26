'use client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Skeleton } from '@glimmora/ui'
import { ArrowLeft } from 'lucide-react'
import { ReviewLayout } from '@/components/review-detail'
import type { ReviewDetail } from '@glimmora/types'

function ReviewDetailSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-5 w-24" />
      <div className="hidden lg:flex gap-4 h-[calc(100vh-8rem)]">
        <div className="w-1/4 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="w-1/4 space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function ReviewDetailPage() {
  const params = useParams()
  const reviewId = params.id as string

  const { data: review, isLoading, isError } = useQuery({
    queryKey: ['review', reviewId],
    queryFn: async () => {
      const res = await fetch(`/api/mentor/reviews/${reviewId}`)
      if (!res.ok) throw new Error('Failed to fetch review')
      return res.json() as Promise<ReviewDetail>
    },
  })

  if (isLoading) return <ReviewDetailSkeleton />

  if (isError || !review) {
    return (
      <div className="p-6">
        <Link
          href="/queue"
          className="inline-flex items-center gap-1.5 text-sm font-body text-text-caption hover:text-text-body transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Queue
        </Link>
        <p className="text-sm font-body text-text-caption">
          Failed to load review. Please try again.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Back link */}
      <div className="px-4 pt-3 pb-0 lg:px-6">
        <Link
          href="/queue"
          className="inline-flex items-center gap-1.5 text-sm font-body text-text-caption hover:text-text-body transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Queue
        </Link>
      </div>

      <ReviewLayout review={review} />
    </div>
  )
}
