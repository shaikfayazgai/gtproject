'use client'
import { Tabs, TabsList, TabsTrigger, TabsContent, Skeleton, EmptyState } from '@glimmora/ui'
import { useQuery } from '@tanstack/react-query'
import { Inbox, FileCheck, CheckCircle } from 'lucide-react'
import type { ReviewQueueItem } from '@glimmora/types'
import { ReviewQueueItemCard } from './review-queue-item-card'

function useQueueData(status: string) {
  return useQuery({
    queryKey: ['queue', status],
    queryFn: async () => {
      const response = await fetch(`/api/mentor/queue?status=${status}`)
      if (!response.ok) throw new Error('Failed to fetch queue')
      const json = await response.json()
      return json.data as ReviewQueueItem[]
    },
  })
}

function QueueSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-bg-card border border-border rounded-card p-4">
          <Skeleton className="h-4 w-3/4 mb-3" />
          <div className="flex gap-2 mb-3">
            <Skeleton className="h-6 w-16 rounded-badge" />
            <Skeleton className="h-6 w-20 rounded-badge" />
          </div>
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

function QueueList({ status }: { status: 'pending' | 'in_progress' | 'completed' }) {
  const { data: items, isLoading } = useQueueData(status)

  if (isLoading) return <QueueSkeleton />

  if (!items || items.length === 0) {
    const emptyConfig = {
      pending: { icon: <Inbox className="h-10 w-10" />, title: 'No pending reviews', description: 'New submissions will appear here when assigned to you.' },
      in_progress: { icon: <FileCheck className="h-10 w-10" />, title: 'No reviews in progress', description: 'Start a review from the Pending tab to see it here.' },
      completed: { icon: <CheckCircle className="h-10 w-10" />, title: 'No completed reviews', description: 'Reviews you finish will appear here.' },
    }
    const config = emptyConfig[status]
    return <EmptyState icon={config.icon} title={config.title} description={config.description} />
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ReviewQueueItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export function ReviewQueueTabs() {
  const { data: pendingItems } = useQueueData('pending')
  const { data: inProgressItems } = useQueueData('in_progress')
  const { data: completedItems } = useQueueData('completed')

  const pendingCount = pendingItems?.length ?? 0
  const inProgressCount = inProgressItems?.length ?? 0
  const completedCount = completedItems?.length ?? 0

  return (
    <Tabs defaultValue="pending">
      <TabsList>
        <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
        <TabsTrigger value="in_progress">In Progress ({inProgressCount})</TabsTrigger>
        <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <QueueList status="pending" />
      </TabsContent>

      <TabsContent value="in_progress">
        <QueueList status="in_progress" />
      </TabsContent>

      <TabsContent value="completed">
        <QueueList status="completed" />
      </TabsContent>
    </Tabs>
  )
}
