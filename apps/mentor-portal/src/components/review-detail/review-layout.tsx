'use client'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@glimmora/ui'
import { TaskContextPanel } from './task-context-panel'
import { EvidenceCenterPanel } from './evidence-center-panel'
import { ReviewFormPanel } from './review-form-panel'
import type { ReviewDetail } from '@glimmora/types'

interface ReviewLayoutProps {
  review: ReviewDetail
}

export function ReviewLayout({ review }: ReviewLayoutProps) {
  return (
    <>
      {/* Desktop: 3-panel resizable */}
      <div className="hidden lg:flex h-[calc(100vh-4rem)]">
        <ResizablePanelGroup orientation="horizontal" autoSaveId="mentor-review-layout">
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <TaskContextPanel review={review} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={45} minSize={30}>
            <EvidenceCenterPanel evidences={review.evidences} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
            <ReviewFormPanel reviewId={review.id} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile/Tablet: stacked panels */}
      <div className="lg:hidden flex flex-col gap-4 p-4">
        <TaskContextPanel review={review} />
        <EvidenceCenterPanel evidences={review.evidences} />
        <ReviewFormPanel reviewId={review.id} />
      </div>
    </>
  )
}
