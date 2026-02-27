import type { Project, ProjectMilestone } from '@glimmora/types'
import { randomId } from './common'

export function createMockProject(id: string): Project {
  return {
    id,
    sowId: 'sow-001',
    name: getMockProjectName(id),
    description: 'Cloud-native customer engagement platform with real-time analytics and AI-powered personalization.',
    status: 'active',
    health: getMockProjectHealth(id),
    organizationId: 'org-001',
    completionPercentage: getMockCompletion(id),
    totalTasks: getMockTotalTasks(id),
    completedTasks: getMockCompletedTasks(id),
    startDate: '2026-01-15',
    targetEndDate: '2026-06-30',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: new Date().toISOString(),
  }
}

function getMockProjectName(id: string): string {
  const names: Record<string, string> = {
    'proj-001': 'Customer Engagement Platform',
    'proj-002': 'Mobile Banking App',
    'proj-003': 'Data Analytics Dashboard',
    'proj-004': 'E-commerce Migration',
  }
  return names[id] ?? `Project ${id}`
}

function getMockProjectHealth(id: string): Project['health'] {
  const health: Record<string, Project['health']> = {
    'proj-001': 'on-track',
    'proj-002': 'at-risk',
    'proj-003': 'on-track',
    'proj-004': 'delayed',
  }
  return health[id] ?? 'on-track'
}

function getMockCompletion(id: string): number {
  const comp: Record<string, number> = {
    'proj-001': 68,
    'proj-002': 45,
    'proj-003': 82,
    'proj-004': 30,
  }
  return comp[id] ?? 50
}

function getMockTotalTasks(id: string): number {
  const tasks: Record<string, number> = {
    'proj-001': 24,
    'proj-002': 18,
    'proj-003': 15,
    'proj-004': 32,
  }
  return tasks[id] ?? 20
}

function getMockCompletedTasks(id: string): number {
  const tasks: Record<string, number> = {
    'proj-001': 16,
    'proj-002': 8,
    'proj-003': 12,
    'proj-004': 10,
  }
  return tasks[id] ?? 10
}

export function createMockProjectsList(): Project[] {
  return [
    createMockProject('proj-001'),
    createMockProject('proj-002'),
    createMockProject('proj-003'),
    createMockProject('proj-004'),
  ]
}

export function createMockCompletedProjects(): Project[] {
  return [
    {
      id: 'proj-c01',
      sowId: 'sow-c01',
      name: 'Website Redesign',
      description: 'Complete website redesign with modern UI and improved UX.',
      status: 'completed',
      health: 'on-track',
      organizationId: 'org-001',
      completionPercentage: 100,
      totalTasks: 12,
      completedTasks: 12,
      startDate: '2025-09-01',
      targetEndDate: '2025-12-15',
      actualEndDate: '2025-12-10',
      createdAt: '2025-08-28T09:00:00Z',
      updatedAt: '2025-12-10T16:30:00Z',
    },
    {
      id: 'proj-c02',
      sowId: 'sow-c02',
      name: 'API Gateway Implementation',
      description: 'Centralized API gateway with rate limiting, auth, and monitoring.',
      status: 'completed',
      health: 'on-track',
      organizationId: 'org-001',
      completionPercentage: 100,
      totalTasks: 16,
      completedTasks: 16,
      startDate: '2025-10-15',
      targetEndDate: '2026-01-31',
      actualEndDate: '2026-01-28',
      createdAt: '2025-10-10T09:00:00Z',
      updatedAt: '2026-01-28T14:00:00Z',
    },
  ]
}

export function createMockProjectMilestones(projectId: string): ProjectMilestone[] {
  return [
    {
      id: `${projectId}-ms-001`,
      projectId,
      name: 'Project Kickoff & Architecture',
      description: 'Initial architecture review, tech stack finalization, and team onboarding.',
      targetDate: '2026-02-01',
      completedDate: '2026-01-30',
      status: 'completed',
      taskIds: ['task-001', 'task-002', 'task-003'],
    },
    {
      id: `${projectId}-ms-002`,
      projectId,
      name: 'Core Platform MVP',
      description: 'Authentication, user management, and core API endpoints.',
      targetDate: '2026-03-15',
      completedDate: '2026-03-12',
      status: 'completed',
      taskIds: ['task-004', 'task-005', 'task-006', 'task-007'],
    },
    {
      id: `${projectId}-ms-003`,
      projectId,
      name: 'Analytics & Personalization',
      description: 'Real-time analytics dashboard and AI-powered recommendation engine.',
      targetDate: '2026-04-30',
      status: 'in-progress',
      taskIds: ['task-008', 'task-009', 'task-010', 'task-011'],
    },
    {
      id: `${projectId}-ms-004`,
      projectId,
      name: 'Multi-channel Communication',
      description: 'Email, SMS, and push notification integration with templating engine.',
      targetDate: '2026-05-31',
      status: 'pending',
      taskIds: ['task-012', 'task-013', 'task-014'],
    },
    {
      id: `${projectId}-ms-005`,
      projectId,
      name: 'UAT & Launch',
      description: 'User acceptance testing, performance testing, and production deployment.',
      targetDate: '2026-06-30',
      status: 'pending',
      taskIds: ['task-015', 'task-016'],
    },
  ]
}

interface MockTeamMember {
  seed: string
  role: string
  skills: string[]
  tier: 'emerging' | 'developing' | 'proficient' | 'expert'
  tasksAssigned: number
}

export function createMockTeamMembers(): MockTeamMember[] {
  return [
    {
      seed: 'contributor-alpha-7291',
      role: 'Frontend Developer',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'GraphQL'],
      tier: 'proficient',
      tasksAssigned: 6,
    },
    {
      seed: 'contributor-beta-3847',
      role: 'Backend Developer',
      skills: ['Node.js', 'PostgreSQL', 'NestJS', 'Redis'],
      tier: 'expert',
      tasksAssigned: 8,
    },
    {
      seed: 'contributor-gamma-5012',
      role: 'UI/UX Designer',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'A11y', 'Animation'],
      tier: 'developing',
      tasksAssigned: 4,
    },
    {
      seed: 'contributor-delta-8934',
      role: 'Data Engineer',
      skills: ['Python', 'Apache Spark', 'PostgreSQL', 'ETL'],
      tier: 'proficient',
      tasksAssigned: 5,
    },
    {
      seed: 'contributor-epsilon-2156',
      role: 'QA Analyst',
      skills: ['Cypress', 'Jest', 'Load Testing'],
      tier: 'emerging',
      tasksAssigned: 3,
    },
    {
      seed: 'contributor-zeta-6473',
      role: 'DevOps Engineer',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
      tier: 'proficient',
      tasksAssigned: 4,
    },
  ]
}

interface MockAPGActivityItem {
  id: string
  type: 'task_assigned' | 'review_requested' | 'milestone_completed' | 'risk_detected' | 'team_formed' | 'payment_triggered'
  title: string
  description: string
  timestamp: string
  detail?: string
}

export function createMockAPGActivity(projectId: string): MockAPGActivityItem[] {
  return [
    {
      id: randomId('apg'),
      type: 'milestone_completed',
      title: 'Milestone Completed',
      description: 'Core Platform MVP milestone marked complete with all evidence accepted.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      detail: `All 4 tasks in milestone verified. Evidence packs reviewed and approved by mentor panel. Project ${projectId} on track.`,
    },
    {
      id: randomId('apg'),
      type: 'task_assigned',
      title: 'Task Auto-assigned',
      description: 'Analytics dashboard task assigned to matched contributor based on skill genome.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      detail: 'Skill match score: 96%. Contributor has proficient-tier React and data visualization skills.',
    },
    {
      id: randomId('apg'),
      type: 'review_requested',
      title: 'Evidence Pack Submitted',
      description: 'API endpoint implementation evidence submitted for review.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      id: randomId('apg'),
      type: 'payment_triggered',
      title: 'Payment Released',
      description: '$28,000 released for completed Architecture milestone.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      detail: 'Released via manual approval. Transaction ID: TXN-2026-0812.',
    },
    {
      id: randomId('apg'),
      type: 'risk_detected',
      title: 'Risk Detected',
      description: 'Dependency delay identified in notification service integration.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      detail: 'Third-party SMS provider API change requires adapter update. APG recommends 3-day buffer addition to milestone 4.',
    },
    {
      id: randomId('apg'),
      type: 'team_formed',
      title: 'Team Assembled',
      description: '6 contributors matched and onboarded for project delivery.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      detail: 'Matching criteria: skill genome alignment, capacity availability, tier requirements. Average match score: 93%.',
    },
  ]
}
