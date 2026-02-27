import { http, HttpResponse, delay } from 'msw'
import { randomId } from '../factories/common'

function createMockDashboard() {
  return {
    tasksCompletePercentage: 72,
    activeProjectCount: 3,
    evidencePacksPending: 8,
    paymentsReleased: 142500,
    paymentsTotal: 250000,
    currency: 'USD',
    timelineHealth: 'on-track' as const,
    milestonesThisWeek: 2,
    activeProjects: [
      {
        id: 'proj-001',
        name: 'Customer Engagement Platform',
        status: 'active' as const,
        health: 'on-track' as const,
        completionPercentage: 68,
        totalTasks: 24,
        completedTasks: 16,
      },
      {
        id: 'proj-002',
        name: 'Mobile Banking App',
        status: 'active' as const,
        health: 'at-risk' as const,
        completionPercentage: 45,
        totalTasks: 18,
        completedTasks: 8,
      },
      {
        id: 'proj-003',
        name: 'Data Analytics Dashboard',
        status: 'active' as const,
        health: 'on-track' as const,
        completionPercentage: 82,
        totalTasks: 15,
        completedTasks: 12,
      },
      {
        id: 'proj-004',
        name: 'E-commerce Migration',
        status: 'active' as const,
        health: 'delayed' as const,
        completionPercentage: 30,
        totalTasks: 32,
        completedTasks: 10,
      },
    ],
    recentActivity: [
      {
        id: randomId('act'),
        type: 'team_formed',
        title: 'Team Formed',
        description: 'APG assembled 5 contributors for Data Analytics Dashboard',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        detail: 'Selected based on skill genome matching: 2 React specialists, 1 data engineer, 1 UI designer, 1 QA analyst. Average skill match score: 94%.',
      },
      {
        id: randomId('act'),
        type: 'milestone_completed',
        title: 'Milestone Reached',
        description: 'Phase 1 MVP delivered for Customer Engagement Platform',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        detail: 'All 8 deliverables accepted. Evidence packs verified by mentor review. Payment of $42,000 triggered.',
      },
      {
        id: randomId('act'),
        type: 'review_requested',
        title: 'Evidence Submitted',
        description: '3 new evidence packs awaiting review for Mobile Banking App',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
      {
        id: randomId('act'),
        type: 'payment_triggered',
        title: 'Payment Triggered',
        description: '$18,500 released for Data Analytics Dashboard milestone 2',
        timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        detail: 'Auto-released per APG silent mode (below $25,000 threshold). Transaction ID: TXN-2026-0847.',
      },
      {
        id: randomId('act'),
        type: 'task_assigned',
        title: 'Task Completed',
        description: 'API integration module delivered for E-commerce Migration',
        timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
      },
      {
        id: randomId('act'),
        type: 'milestone_completed',
        title: 'Risk Mitigated',
        description: 'APG reassigned delayed task in Mobile Banking App to available contributor',
        timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
        detail: 'Original contributor flagged capacity constraint. APG matched replacement within 4 hours based on skill genome.',
      },
    ],
    pendingActions: [
      {
        id: randomId('action'),
        label: '3 evidence packs to review',
        href: '/projects/proj-002#evidence',
        type: 'evidence' as const,
      },
      {
        id: randomId('action'),
        label: '2 payments awaiting release',
        href: '/payments',
        type: 'payment' as const,
      },
      {
        id: randomId('action'),
        label: '1 blueprint awaiting approval',
        href: '/sow/archive',
        type: 'blueprint' as const,
      },
    ],
  }
}

export const dashboardHandlers = [
  http.get('/api/enterprise/dashboard', async () => {
    await delay(400)
    return HttpResponse.json(createMockDashboard())
  }),
]
