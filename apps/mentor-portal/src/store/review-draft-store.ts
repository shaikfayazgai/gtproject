'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface ReviewDraft {
  decision?: 'approve' | 'rework_required' | 'reject'
  feedbackComment?: string
  reworkItems?: string
  guidanceNotes?: string
  rejectionReason?: string
  nonComplianceEvidence?: string
}

interface ReviewDraftStore {
  drafts: Record<string, ReviewDraft>
  saveDraft: (reviewId: string, draft: ReviewDraft) => void
  getDraft: (reviewId: string) => ReviewDraft | undefined
  clearDraft: (reviewId: string) => void
}

export const useReviewDraftStore = create<ReviewDraftStore>()(
  persist(
    (set, get) => ({
      drafts: {},
      saveDraft: (reviewId, draft) =>
        set((state) => ({ drafts: { ...state.drafts, [reviewId]: draft } })),
      getDraft: (reviewId) => get().drafts[reviewId],
      clearDraft: (reviewId) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [reviewId]: _removed, ...rest } = state.drafts
          return { drafts: rest }
        }),
    }),
    { name: 'mentor-review-drafts', storage: createJSONStorage(() => localStorage) }
  )
)
