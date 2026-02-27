import { randomId, isoPast } from './common'
import type { APGConfigEntry, APGConfigDomain } from '@glimmora/types'

interface ConfigTemplate {
  domain: APGConfigDomain
  key: string
  label: string
  value: string | number | boolean
  description: string
}

const CONFIG_TEMPLATES: ConfigTemplate[] = [
  // Thresholds
  {
    domain: 'thresholds',
    key: 'quality_score_minimum',
    label: 'Minimum Quality Score',
    value: 3.5,
    description: 'Minimum quality score required for automatic acceptance of deliverables',
  },
  {
    domain: 'thresholds',
    key: 'payment_auto_release_limit',
    label: 'Auto-Release Payment Limit',
    value: 5000,
    description: 'Maximum payment amount (USD) for automatic release without manual review',
  },
  {
    domain: 'thresholds',
    key: 'sla_warning_hours',
    label: 'SLA Warning Threshold (Hours)',
    value: 12,
    description: 'Hours before SLA expiry to trigger warning notification to assigned reviewer',
  },
  {
    domain: 'thresholds',
    key: 'max_concurrent_projects',
    label: 'Max Concurrent Projects per Contributor',
    value: 3,
    description: 'Maximum number of active projects a single contributor can participate in',
  },

  // Auto-Approval Rules
  {
    domain: 'auto_approval_rules',
    key: 'auto_approve_verified_contributors',
    label: 'Auto-Approve Verified Contributors',
    value: true,
    description: 'Automatically approve deliverables from contributors with verified status and quality score above threshold',
  },
  {
    domain: 'auto_approval_rules',
    key: 'auto_approve_small_payments',
    label: 'Auto-Approve Small Payments',
    value: true,
    description: 'Automatically release payments below the auto-release limit when deliverable is accepted',
  },
  {
    domain: 'auto_approval_rules',
    key: 'auto_approve_rework',
    label: 'Auto-Approve Rework Submissions',
    value: false,
    description: 'Automatically accept rework submissions if they pass quality threshold (safety-tagged projects excluded)',
  },
  {
    domain: 'auto_approval_rules',
    key: 'auto_approve_team_formation',
    label: 'Auto-Approve Team Formation',
    value: true,
    description: 'Allow APG to automatically form teams based on skill matching without manual admin review',
  },

  // Escalation Triggers
  {
    domain: 'escalation_triggers',
    key: 'dispute_auto_escalation_hours',
    label: 'Dispute Auto-Escalation (Hours)',
    value: 48,
    description: 'Hours after which unresolved disputes are automatically escalated to senior admin',
  },
  {
    domain: 'escalation_triggers',
    key: 'payment_dispute_threshold',
    label: 'Payment Dispute Escalation ($)',
    value: 10000,
    description: 'Payment disputes above this amount are immediately escalated to Super Admin',
  },
  {
    domain: 'escalation_triggers',
    key: 'safety_auto_escalation',
    label: 'Auto-Escalate Safety Cases',
    value: true,
    description: 'Immediately escalate any dispute flagged as safety-related to Super Admin with evidence preservation',
  },
  {
    domain: 'escalation_triggers',
    key: 'consecutive_rejection_limit',
    label: 'Consecutive Rejection Escalation',
    value: 3,
    description: 'Number of consecutive deliverable rejections before triggering admin review of the project',
  },
]

export function createMockAPGConfig(): APGConfigEntry[] {
  return CONFIG_TEMPLATES.map((template) => ({
    id: randomId('apg-cfg'),
    domain: template.domain,
    key: template.key,
    label: template.label,
    value: template.value,
    description: template.description,
    updatedBy: 'Sarah Chen',
    updatedAt: isoPast(Math.floor(Math.random() * 14) + 1),
  }))
}
