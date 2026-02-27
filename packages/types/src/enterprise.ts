export type EnterpriseOnboardingStepId = 'company' | 'billing' | 'team' | 'first-sow'

export interface EnterpriseOnboardingProgress {
  currentStep: EnterpriseOnboardingStepId
  completedSteps: EnterpriseOnboardingStepId[]
  companyVerified: boolean
}

export type TeamMemberRole = 'admin' | 'project-manager' | 'finance-approver' | 'viewer'

export interface TeamMember {
  id: string
  email: string
  name: string
  role: TeamMemberRole
  invitedAt: string
  acceptedAt?: string
  isActive: boolean
}

export interface OrganizationProfile {
  id: string
  name: string
  logoUrl?: string
  industry: string
  size: '1-50' | '51-200' | '201-1000' | '1000+'
  headquarters: string
  website?: string
  primaryContactEmail: string
  taxId: string
  billingCurrency: string
  billingContactEmail: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
}

export type PaymentReleaseMode = 'manual' | 'auto-on-approval' | 'apg-silent'

export interface PaymentPreferences {
  defaultMode: PaymentReleaseMode
  apgSilentThresholdAmount?: number
  autoReleaseDelayDays?: number
}

export interface PaymentRecord {
  id: string
  projectId: string
  milestoneId: string
  evidencePackId: string
  amount: number
  platformFee: number
  netToContributor: number
  currency: string
  status: 'pending' | 'released' | 'held' | 'disputed'
  releaseMode: PaymentReleaseMode
  releasedAt?: string
  transactionId?: string
  holdReason?: string
  holdExpiresAt?: string
}

export interface BlueprintTask {
  id: string
  title: string
  description: string
  skillRequirements: string[]
  estimatedHours: number
  evidenceTypeExpected: string
  acceptanceCriteria: string
  dependsOn: string[]
  clauseIds: string[]
}

export interface BlueprintMilestone {
  id: string
  name: string
  description: string
  successCriteria: string
  taskIds: string[]
  budgetAllocation: number
  targetWeek: number
  paymentTrigger: PaymentReleaseMode
}

export interface BlueprintPhase {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  milestoneIds: string[]
}

export interface Blueprint {
  id: string
  sowId: string
  projectName: string
  phases: BlueprintPhase[]
  milestones: BlueprintMilestone[]
  tasks: BlueprintTask[]
  totalBudget: number
  timeline: { startDate: string; endDate: string }
  completionPercentage: number
  issues: string[]
  status: 'draft' | 'review' | 'approved'
}

export interface SOWClause {
  id: string
  text: string
  type: 'objective' | 'deliverable' | 'timeline' | 'budget' | 'compliance' | 'general'
  confidence: number
  linkedTaskIds: string[]
}

export interface SOWIntelligence {
  sowId: string
  projectObjective: string
  clauses: SOWClause[]
  deliverables: Array<{ text: string; included: boolean }>
  timelineEstimates: Array<{ milestone: string; date: string }>
  budgetRange: { min: number; max: number; currency: string }
  complianceFlags: Array<{ item: string; severity: 'mandatory' | 'preferred' | 'note' }>
  confidenceScore: number
  ambiguities: Array<{ section: string; issue: string }>
}

export interface ESGReportData {
  organizationName: string
  reportPeriod: string
  generatedDate: string
  womenContributorHours: number
  studentContributorHours: number
  totalContributorHours: number
  womenWorkforcePercentage: number
  studentWorkforcePercentage: number
  underrepresentedGroupPercentage: number
  podlCredentialsIssued: number
  skillsDeveloped: string[]
  totalPaymentsReleased: number
  onTimePaymentRate: number
  currency: string
  onTimeDeliveryRate: number
  reworkRate: number
  mentorReviewRate: number
}
