import { randomId, isoPast } from './common'
import type { PlatformAuditEntry, AuditActionCategory } from '@glimmora/types'

const ACTORS = [
  { id: 'admin-001', name: 'Sarah Chen' },
  { id: 'admin-002', name: 'Raj Patel' },
  { id: 'admin-003', name: 'Maria Santos' },
  { id: 'system', name: 'System (APG)' },
]

const ACTIONS: {
  category: AuditActionCategory
  actionType: string
  entityType: 'user' | 'project' | 'dispute' | 'config' | 'content'
  reason: string
}[] = [
  { category: 'user_management', actionType: 'User suspended', entityType: 'user', reason: 'Multiple policy violations reported by enterprise requester' },
  { category: 'user_management', actionType: 'User reactivated', entityType: 'user', reason: 'Appeal reviewed and approved after 30-day suspension period' },
  { category: 'user_management', actionType: 'Verification approved', entityType: 'user', reason: 'Identity documents verified successfully' },
  { category: 'user_management', actionType: 'Verification rejected', entityType: 'user', reason: 'Submitted documents do not match registration information' },
  { category: 'user_management', actionType: 'Tier modified', entityType: 'user', reason: 'Promoted to expert tier based on consistent delivery quality' },
  { category: 'project_intervention', actionType: 'Project frozen', entityType: 'project', reason: 'Investigation initiated for potential quality concerns' },
  { category: 'project_intervention', actionType: 'Project unfrozen', entityType: 'project', reason: 'Investigation complete, no issues found' },
  { category: 'project_intervention', actionType: 'Payment held', entityType: 'project', reason: 'Dispute filed regarding milestone deliverable quality' },
  { category: 'project_intervention', actionType: 'Payment released', entityType: 'project', reason: 'Dispute resolved in contributor favor' },
  { category: 'project_intervention', actionType: 'Contributor reassigned', entityType: 'project', reason: 'Original contributor unresponsive for 7 days' },
  { category: 'dispute_resolution', actionType: 'Dispute resolved (requester)', entityType: 'dispute', reason: 'Evidence shows deliverable does not meet SOW specifications' },
  { category: 'dispute_resolution', actionType: 'Dispute resolved (contributor)', entityType: 'dispute', reason: 'Deliverable meets all specified acceptance criteria' },
  { category: 'dispute_resolution', actionType: 'Dispute escalated', entityType: 'dispute', reason: 'Safety concerns identified requiring immediate review' },
  { category: 'dispute_resolution', actionType: 'Partial resolution', entityType: 'dispute', reason: 'Both parties agree to 50% payment and rework scope' },
  { category: 'content_management', actionType: 'Skill added', entityType: 'content', reason: 'New skill category requested by multiple enterprise clients' },
  { category: 'content_management', actionType: 'Skills merged', entityType: 'content', reason: 'Duplicate skill tags consolidated' },
  { category: 'content_management', actionType: 'Announcement published', entityType: 'content', reason: 'Platform maintenance scheduled for next week' },
  { category: 'content_management', actionType: 'Resource added', entityType: 'content', reason: 'New contributor onboarding guide published' },
  { category: 'apg_configuration', actionType: 'Threshold updated', entityType: 'config', reason: 'Auto-approval threshold increased based on quality data' },
  { category: 'apg_configuration', actionType: 'Auto-approval rule modified', entityType: 'config', reason: 'Disabled auto-approval for safety-tagged projects' },
  { category: 'apg_configuration', actionType: 'Escalation trigger added', entityType: 'config', reason: 'New escalation trigger for payment disputes over $5000' },
  { category: 'system', actionType: 'System backup completed', entityType: 'config', reason: 'Scheduled daily backup executed successfully' },
  { category: 'system', actionType: 'Rate limit adjusted', entityType: 'config', reason: 'Increased API rate limit for enterprise tier' },
  { category: 'system', actionType: 'Cache purged', entityType: 'config', reason: 'Manual cache purge after taxonomy update' },
  { category: 'system', actionType: 'Health check alert', entityType: 'config', reason: 'Database response time exceeded 500ms threshold' },
  { category: 'user_management', actionType: 'Force password reset', entityType: 'user', reason: 'Potential account compromise detected' },
  { category: 'project_intervention', actionType: 'Milestone override', entityType: 'project', reason: 'Client requested deadline extension approved by admin' },
  { category: 'dispute_resolution', actionType: 'Dispute dismissed', entityType: 'dispute', reason: 'Insufficient evidence to support claim' },
]

export function createMockAuditEntries(): PlatformAuditEntry[] {
  return ACTIONS.map((action, idx) => {
    const actor = ACTORS[idx % ACTORS.length]
    return {
      id: randomId('audit'),
      timestamp: isoPast(Math.floor(Math.random() * 30) + 1),
      actorId: actor.id,
      actorName: actor.name,
      actionCategory: action.category,
      actionType: action.actionType,
      affectedEntityType: action.entityType,
      affectedEntityId: randomId(action.entityType),
      reason: action.reason,
      isImmutable: true,
    }
  })
}
