import type { MentorTier } from './user'

export type MentorApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected'
export type ReviewDecisionType = 'approve' | 'rework_required' | 'reject'
export type SLAStatus = 'normal' | 'warning' | 'urgent' | 'overdue'
export type ReviewEvidenceType = 'code' | 'document' | 'link' | 'video' | 'text'

// ReviewEvidence has NO contributor identity -- this IS the blind-review privacy boundary
export interface ReviewEvidence {
  id: string
  type: ReviewEvidenceType
  content: string
  submittedAt: string
  // code
  language?: string
  filename?: string
  // document
  fileSize?: string
  fileType?: string
  downloadUrl?: string
  // link / video
  url?: string
  title?: string
  description?: string
}

export interface ReviewDetail {
  id: string
  taskId: string
  taskTitle: string
  taskBrief: string
  deliverables: string[]
  skillTagsRequired: string[]
  evidences: ReviewEvidence[]
  submittedAt: string
  slaDeadline: string
  submissionCount: number
}

export interface MentorApplication {
  id: string
  expertiseAreas: string[]
  credentials: string
  availability: string
  status: MentorApplicationStatus
  submittedAt: string
  reviewedAt?: string
  rejectionReason?: string
}

export interface MentorOnboardingProfile {
  id: string
  mentorId: string
  displayName: string
  bio: string
  tier: MentorTier
  expertiseSkillIds: string[]
  capacityHoursPerWeek: number
  isPaused: boolean
  joinedAt: string
}

export interface MentorImpactMetrics {
  totalReviews: number
  averageReviewHours: number
  reworkRate: number
  appealsOverturnedRate: number
  pendingReviews: number
}

export interface ReviewQueueItem {
  id: string
  taskId: string
  taskTitle: string
  submittedAt: string
  slaDeadline: string
  status: 'pending' | 'in_progress' | 'completed'
  skillTags: string[]
  submissionCount: number
  hasDraft?: boolean
  hasSLAExtensionPending?: boolean
}

export interface ReviewDecision {
  reviewId: string
  type: ReviewDecisionType
  feedbackComment?: string
  reworkItems?: string
  guidanceNotes?: string
  rejectionReason?: string
  nonComplianceEvidence?: string
}

export interface SkillTagVerificationRequest {
  id: string
  contributorSeed: string
  skillTag: string
  evidenceIds: string[]
  status: 'pending' | 'verified' | 'disputed'
  submittedAt: string
}

export interface MentorConversation {
  id: string
  subject: string
  lastMessage: string
  lastMessageAt: string
  unread: boolean
}
