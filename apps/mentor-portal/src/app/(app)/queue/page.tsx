import { MentorKPIRow } from '@/components/dashboard/mentor-kpi-row'
import { ReviewQueueTabs } from '@/components/review-queue/review-queue-tabs'

export default function QueuePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-text-heading">
          Review Queue
        </h1>
        <p className="text-sm font-body text-text-caption mt-1">
          Manage your assigned code reviews and deliverable assessments.
        </p>
      </div>

      <MentorKPIRow />

      <ReviewQueueTabs />
    </div>
  )
}
