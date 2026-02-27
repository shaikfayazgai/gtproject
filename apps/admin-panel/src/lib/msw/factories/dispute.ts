import { randomId, isoPast, isoNow, isoFuture } from './common'
import type {
  Dispute,
  DisputeEvidence,
  DisputeMessage,
  SafetyCase,
} from '@glimmora/types'

// ---- Dispute List ----

export function createMockDisputeList(): Dispute[] {
  return [
    {
      id: randomId('disp'),
      type: 'payment',
      severity: 'high',
      status: 'open',
      title: 'Payment not released after milestone approval',
      description: 'Milestone MS-03 was approved 14 days ago but payment has not been released to contributor.',
      projectId: 'proj-001',
      projectName: 'E-Commerce Platform Redesign',
      requesterId: 'req-001',
      requesterName: 'TechCorp Solutions',
      contributorSeed: 'seed-7f3a',
      createdAt: isoPast(5),
      updatedAt: isoPast(1),
      assignedAdminId: 'admin-001',
      isSafetyCase: false,
    },
    {
      id: randomId('disp'),
      type: 'quality',
      severity: 'medium',
      status: 'under_review',
      title: 'Delivered code does not meet acceptance criteria',
      description: 'The API endpoints do not match the specifications outlined in the SOW.',
      projectId: 'proj-002',
      projectName: 'Mobile Banking App',
      requesterId: 'req-002',
      requesterName: 'FinServ Global',
      contributorSeed: 'seed-a2c9',
      createdAt: isoPast(8),
      updatedAt: isoPast(2),
      assignedAdminId: 'admin-002',
      isSafetyCase: false,
    },
    {
      id: randomId('disp'),
      type: 'conduct',
      severity: 'high',
      status: 'awaiting_evidence',
      title: 'Unprofessional communication in project channel',
      description: 'Multiple reports of aggressive messaging from a team member.',
      projectId: 'proj-003',
      projectName: 'Healthcare Dashboard',
      requesterId: 'req-003',
      requesterName: 'MedTech Inc',
      contributorSeed: 'seed-b4d1',
      createdAt: isoPast(3),
      updatedAt: isoPast(1),
      isSafetyCase: false,
    },
    {
      id: randomId('disp'),
      type: 'technical',
      severity: 'low',
      status: 'resolved',
      title: 'Build environment configuration mismatch',
      description: 'Contributor reports that the project build instructions are outdated.',
      projectId: 'proj-004',
      projectName: 'Data Analytics Pipeline',
      requesterId: 'req-004',
      requesterName: 'DataFlow Systems',
      contributorSeed: 'seed-e5f2',
      createdAt: isoPast(15),
      updatedAt: isoPast(10),
      assignedAdminId: 'admin-001',
      isSafetyCase: false,
    },
    {
      id: randomId('disp'),
      type: 'safety',
      severity: 'critical',
      status: 'escalated',
      title: 'Contributor identity exposure incident',
      description: 'A contributor\'s real identity was inadvertently exposed through project metadata.',
      projectId: 'proj-005',
      projectName: 'Government Portal',
      requesterId: 'req-005',
      requesterName: 'GovTech Agency',
      contributorSeed: 'seed-c8a3',
      createdAt: isoPast(2),
      updatedAt: isoPast(0),
      assignedAdminId: 'admin-001',
      isSafetyCase: true,
    },
    {
      id: randomId('disp'),
      type: 'payment',
      severity: 'medium',
      status: 'open',
      title: 'Disputed refund amount for partial delivery',
      description: 'Requester claims only 40% of deliverables were completed but contributor claims 75%.',
      projectId: 'proj-006',
      projectName: 'Inventory Management System',
      requesterId: 'req-006',
      requesterName: 'RetailMax',
      contributorSeed: 'seed-d9b4',
      createdAt: isoPast(4),
      updatedAt: isoPast(2),
      isSafetyCase: false,
    },
    {
      id: randomId('disp'),
      type: 'quality',
      severity: 'high',
      status: 'open',
      title: 'Accessibility standards not met in delivered UI',
      description: 'WCAG 2.1 AA compliance was required but delivered components fail contrast and keyboard navigation checks.',
      projectId: 'proj-007',
      projectName: 'Public Services Portal',
      requesterId: 'req-007',
      requesterName: 'CityGov Digital',
      contributorSeed: 'seed-f1e6',
      createdAt: isoPast(6),
      updatedAt: isoPast(3),
      assignedAdminId: 'admin-002',
      isSafetyCase: false,
    },
    {
      id: randomId('disp'),
      type: 'conduct',
      severity: 'medium',
      status: 'resolved',
      title: 'Repeated missed deadlines without communication',
      description: 'Contributor missed 3 consecutive milestone deadlines without advance notice.',
      projectId: 'proj-008',
      projectName: 'CRM Integration',
      requesterId: 'req-008',
      requesterName: 'SalesForce Partners',
      contributorSeed: 'seed-a7c2',
      createdAt: isoPast(20),
      updatedAt: isoPast(12),
      assignedAdminId: 'admin-001',
      isSafetyCase: false,
    },
    {
      id: randomId('disp'),
      type: 'technical',
      severity: 'medium',
      status: 'under_review',
      title: 'API rate limiting causing integration failures',
      description: 'Third-party API rate limits are causing intermittent failures in the delivery pipeline.',
      projectId: 'proj-009',
      projectName: 'Payment Gateway Integration',
      requesterId: 'req-009',
      requesterName: 'PaySecure Ltd',
      contributorSeed: 'seed-b3d5',
      createdAt: isoPast(7),
      updatedAt: isoPast(4),
      isSafetyCase: false,
    },
    {
      id: randomId('disp'),
      type: 'payment',
      severity: 'high',
      status: 'under_review',
      title: 'Double payment processed for same milestone',
      description: 'Automatic payment system processed payment twice for MS-02.',
      projectId: 'proj-010',
      projectName: 'Supply Chain Tracker',
      requesterId: 'req-010',
      requesterName: 'LogiFlow Inc',
      contributorSeed: 'seed-e4f8',
      createdAt: isoPast(3),
      updatedAt: isoPast(1),
      assignedAdminId: 'admin-002',
      isSafetyCase: false,
    },
    {
      id: randomId('disp'),
      type: 'safety',
      severity: 'critical',
      status: 'open',
      title: 'Harassment report from contributor',
      description: 'A contributor has reported sustained harassment from a project stakeholder.',
      projectId: 'proj-011',
      projectName: 'EdTech Learning Platform',
      requesterId: 'req-011',
      requesterName: 'EduGlobal Corp',
      contributorSeed: 'seed-c2a7',
      createdAt: isoPast(1),
      updatedAt: isoPast(0),
      assignedAdminId: 'admin-001',
      isSafetyCase: true,
    },
    {
      id: randomId('disp'),
      type: 'quality',
      severity: 'low',
      status: 'resolved',
      title: 'Minor documentation inconsistencies',
      description: 'API documentation has some inconsistencies with actual endpoint behavior.',
      projectId: 'proj-012',
      projectName: 'API Documentation Hub',
      requesterId: 'req-012',
      requesterName: 'DevDocs Inc',
      contributorSeed: 'seed-d6b9',
      createdAt: isoPast(25),
      updatedAt: isoPast(18),
      assignedAdminId: 'admin-001',
      isSafetyCase: false,
    },
    {
      id: randomId('disp'),
      type: 'technical',
      severity: 'high',
      status: 'awaiting_evidence',
      title: 'Database migration script causes data loss',
      description: 'Running the migration script on staging resulted in loss of user preference data.',
      projectId: 'proj-002',
      projectName: 'Mobile Banking App',
      requesterId: 'req-002',
      requesterName: 'FinServ Global',
      contributorSeed: 'seed-f3e1',
      createdAt: isoPast(2),
      updatedAt: isoPast(0),
      assignedAdminId: 'admin-002',
      isSafetyCase: false,
    },
  ]
}

// ---- Dispute Detail ----

export function createMockDisputeDetail(id: string): Dispute & {
  assignedAdminName?: string
  slaDeadline: string
  relatedEvidencePackId?: string
  relatedPaymentId?: string
  decision?: {
    decisionType: string
    summary: string
    detailedReasoning: string
    adminId: string
    decidedAt: string
  }
} {
  return {
    id,
    type: 'payment',
    severity: 'high',
    status: 'under_review',
    title: 'Payment not released after milestone approval',
    description:
      'Milestone MS-03 was approved 14 days ago but payment has not been released to contributor. The contributor has provided evidence of task completion and mentor approval.',
    projectId: 'proj-001',
    projectName: 'E-Commerce Platform Redesign',
    requesterId: 'req-001',
    requesterName: 'TechCorp Solutions',
    contributorSeed: 'seed-7f3a',
    createdAt: isoPast(5),
    updatedAt: isoPast(1),
    assignedAdminId: 'admin-001',
    assignedAdminName: 'Admin User',
    isSafetyCase: false,
    slaDeadline: isoFuture(2),
    relatedEvidencePackId: 'evpack-001',
    relatedPaymentId: 'pay-001',
  }
}

// ---- Safety Case List ----

export function createMockSafetyCaseList(): SafetyCase[] {
  return [
    {
      id: randomId('safety'),
      type: 'safety',
      severity: 'critical',
      status: 'escalated',
      title: 'Contributor identity exposure incident',
      description:
        'A contributor\'s real identity was inadvertently exposed through project metadata. Immediate containment required.',
      projectId: 'proj-005',
      projectName: 'Government Portal',
      requesterId: 'req-005',
      requesterName: 'GovTech Agency',
      contributorSeed: 'seed-c8a3',
      createdAt: isoPast(2),
      updatedAt: isoPast(0),
      assignedAdminId: 'admin-001',
      isSafetyCase: true,
      privacyRestricted: true,
      evidencePreserved: true,
      accessRestrictions: [
        'Super Admin only',
        'No export permitted',
        'All access logged',
      ],
    },
    {
      id: randomId('safety'),
      type: 'safety',
      severity: 'critical',
      status: 'open',
      title: 'Harassment report from contributor',
      description:
        'A contributor has reported sustained harassment from a project stakeholder. Evidence preserved for investigation.',
      projectId: 'proj-011',
      projectName: 'EdTech Learning Platform',
      requesterId: 'req-011',
      requesterName: 'EduGlobal Corp',
      contributorSeed: 'seed-c2a7',
      createdAt: isoPast(1),
      updatedAt: isoPast(0),
      assignedAdminId: 'admin-001',
      isSafetyCase: true,
      privacyRestricted: true,
      evidencePreserved: true,
      accessRestrictions: [
        'Super Admin only',
        'All access logged',
        'Contributor identity protected',
      ],
    },
    {
      id: randomId('safety'),
      type: 'safety',
      severity: 'critical',
      status: 'under_review',
      title: 'Potential data exfiltration attempt',
      description:
        'Anomalous data access patterns detected from a contributor account. Investigation underway.',
      projectId: 'proj-003',
      projectName: 'Healthcare Dashboard',
      requesterId: 'req-003',
      requesterName: 'MedTech Inc',
      contributorSeed: 'seed-b4d1',
      createdAt: isoPast(3),
      updatedAt: isoPast(1),
      assignedAdminId: 'admin-002',
      isSafetyCase: true,
      privacyRestricted: true,
      evidencePreserved: true,
      accessRestrictions: [
        'Super Admin only',
        'No export permitted',
        'All access logged',
        'Legal hold applied',
      ],
    },
  ]
}

// ---- Safety Case Detail ----

export function createMockSafetyCaseDetail(id: string): SafetyCase & {
  assignedAdminName?: string
  slaDeadline: string
  evidencePreservedAt: string
} {
  return {
    id,
    type: 'safety',
    severity: 'critical',
    status: 'under_review',
    title: 'Contributor identity exposure incident',
    description:
      'A contributor\'s real identity was inadvertently exposed through project metadata. Immediate containment required. All affected records have been sealed.',
    projectId: 'proj-005',
    projectName: 'Government Portal',
    requesterId: 'req-005',
    requesterName: 'GovTech Agency',
    contributorSeed: 'seed-c8a3',
    createdAt: isoPast(2),
    updatedAt: isoPast(0),
    assignedAdminId: 'admin-001',
    assignedAdminName: 'Admin User',
    isSafetyCase: true,
    privacyRestricted: true,
    evidencePreserved: true,
    accessRestrictions: [
      'Super Admin only',
      'No export permitted',
      'All access logged',
      'Legal hold applied',
    ],
    slaDeadline: isoFuture(1),
    evidencePreservedAt: isoPast(2),
  }
}

// ---- Dispute Evidence ----

export function createMockDisputeEvidence(disputeId: string): DisputeEvidence[] {
  return [
    {
      id: randomId('ev'),
      disputeId,
      submittedBy: 'requester',
      type: 'text',
      content:
        'The milestone was marked as approved on Feb 12, but the payment dashboard still shows "pending release". I have contacted support twice with no resolution.',
      submittedAt: isoPast(5),
    },
    {
      id: randomId('ev'),
      disputeId,
      submittedBy: 'system',
      type: 'log',
      content:
        'Payment release event triggered at 2026-02-12T14:30:00Z but failed with error: PAYMENT_GATEWAY_TIMEOUT. Retry scheduled but not executed due to queue backlog.',
      submittedAt: isoPast(5),
    },
    {
      id: randomId('ev'),
      disputeId,
      submittedBy: 'contributor',
      type: 'screenshot',
      content: 'Screenshot showing milestone approval notification received',
      fileUrl: '/mock/evidence/milestone-approval-screenshot.png',
      submittedAt: isoPast(4),
    },
    {
      id: randomId('ev'),
      disputeId,
      submittedBy: 'admin',
      type: 'text',
      content:
        'Investigated payment gateway logs. Confirmed timeout occurred during payment processing. Manual retry initiated.',
      submittedAt: isoPast(2),
    },
    {
      id: randomId('ev'),
      disputeId,
      submittedBy: 'requester',
      type: 'file',
      content: 'Signed SOW with payment terms highlighting the 48-hour release SLA',
      fileUrl: '/mock/evidence/sow-payment-terms.pdf',
      submittedAt: isoPast(3),
    },
  ]
}

// ---- Dispute Messages ----

export function createMockDisputeMessages(disputeId: string): DisputeMessage[] {
  return [
    {
      id: randomId('msg'),
      disputeId,
      senderRole: 'requester',
      content:
        'Hi, I filed this dispute because the payment for MS-03 has been pending for over 2 weeks now. Our agreement states a 48-hour release window.',
      sentAt: isoPast(5),
    },
    {
      id: randomId('msg'),
      disputeId,
      senderRole: 'admin',
      content:
        'Thank you for reporting this. I can see the payment was attempted but failed due to a gateway timeout. I am investigating the root cause now.',
      sentAt: isoPast(4),
    },
    {
      id: randomId('msg'),
      disputeId,
      senderRole: 'contributor',
      content:
        'I can confirm the milestone was approved by the mentor on Feb 12. I have been waiting for the payment since then.',
      sentAt: isoPast(4),
    },
    {
      id: randomId('msg'),
      disputeId,
      senderRole: 'admin',
      content:
        'I have identified the issue. The payment gateway experienced a timeout and the retry mechanism did not trigger. I am initiating a manual retry now.',
      sentAt: isoPast(3),
    },
    {
      id: randomId('msg'),
      disputeId,
      senderRole: 'requester',
      content:
        'Thank you for looking into this. How long will the manual retry take?',
      sentAt: isoPast(2),
    },
    {
      id: randomId('msg'),
      disputeId,
      senderRole: 'admin',
      content:
        'The manual payment has been queued and should process within 24 hours. I will update you once confirmed.',
      sentAt: isoPast(1),
    },
  ]
}

// ---- Dispute Audit ----

export interface DisputeAuditEntry {
  id: string
  disputeId: string
  timestamp: string
  actorName: string
  action: string
  details: string
}

export function createMockDisputeAudit(disputeId: string): DisputeAuditEntry[] {
  return [
    {
      id: randomId('audit'),
      disputeId,
      timestamp: isoPast(5),
      actorName: 'System',
      action: 'created',
      details: 'Dispute filed by requester: TechCorp Solutions',
    },
    {
      id: randomId('audit'),
      disputeId,
      timestamp: isoPast(5),
      actorName: 'System',
      action: 'evidence_submitted',
      details: 'Initial evidence submitted by requester (text description)',
    },
    {
      id: randomId('audit'),
      disputeId,
      timestamp: isoPast(4),
      actorName: 'Admin User',
      action: 'assigned',
      details: 'Case assigned to Admin User (admin-001)',
    },
    {
      id: randomId('audit'),
      disputeId,
      timestamp: isoPast(4),
      actorName: 'System',
      action: 'evidence_submitted',
      details: 'System log evidence auto-attached from payment gateway',
    },
    {
      id: randomId('audit'),
      disputeId,
      timestamp: isoPast(4),
      actorName: 'Contributor (seed-7f3a)',
      action: 'evidence_submitted',
      details: 'Screenshot evidence submitted by contributor',
    },
    {
      id: randomId('audit'),
      disputeId,
      timestamp: isoPast(3),
      actorName: 'Requester',
      action: 'evidence_submitted',
      details: 'SOW document submitted as evidence by requester',
    },
    {
      id: randomId('audit'),
      disputeId,
      timestamp: isoPast(3),
      actorName: 'Admin User',
      action: 'message_sent',
      details: 'Admin sent message to dispute channel',
    },
    {
      id: randomId('audit'),
      disputeId,
      timestamp: isoPast(2),
      actorName: 'Admin User',
      action: 'evidence_submitted',
      details: 'Admin submitted investigation findings (text)',
    },
    {
      id: randomId('audit'),
      disputeId,
      timestamp: isoPast(1),
      actorName: 'Admin User',
      action: 'message_sent',
      details: 'Manual payment retry initiated and communicated',
    },
    {
      id: randomId('audit'),
      disputeId,
      timestamp: isoNow(),
      actorName: 'System',
      action: 'status_changed',
      details: 'Status changed from open to under_review',
    },
  ]
}
