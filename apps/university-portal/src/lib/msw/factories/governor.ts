import type { GovernorMetrics, CohortTrend, TaskCategory } from '@glimmora/types'

export function createMockGovernorMetrics(): GovernorMetrics {
  return {
    institutionId: 'inst-001',
    institutionName: 'Indian Institute of Technology, Bangalore',
    totalActiveStudents: 142,
    totalTasksCompleted: 847,
    totalPoDLsIssued: 523,
    totalEarningsDistributed: 186400,
    currency: 'USD',
    reportPeriod: 'Sep 2025 - Feb 2026',
  }
}

export function createMockCohortTrends(): CohortTrend[] {
  return [
    { cohortLabel: '2024 Batch', completionRate: 76, averageTasksPerStudent: 5.2, podlIssuanceRate: 68, reportPeriod: 'Sep 2025 - Feb 2026' },
    { cohortLabel: '2023 Batch', completionRate: 84, averageTasksPerStudent: 7.1, podlIssuanceRate: 79, reportPeriod: 'Sep 2025 - Feb 2026' },
    { cohortLabel: '2025 Batch', completionRate: 62, averageTasksPerStudent: 3.4, podlIssuanceRate: 55, reportPeriod: 'Sep 2025 - Feb 2026' },
    { cohortLabel: '2022 Batch (Alumni)', completionRate: 90, averageTasksPerStudent: 9.8, podlIssuanceRate: 88, reportPeriod: 'Sep 2025 - Feb 2026' },
  ]
}

export function createMockTaskCategories(): TaskCategory[] {
  return [
    { id: 'cat-001', name: 'Frontend Development', description: 'React, Vue, Angular, and web UI tasks', isEnabled: true },
    { id: 'cat-002', name: 'Backend Development', description: 'APIs, databases, server-side logic', isEnabled: true },
    { id: 'cat-003', name: 'Mobile Development', description: 'iOS, Android, React Native tasks', isEnabled: true },
    { id: 'cat-004', name: 'Testing & QA', description: 'Unit testing, integration testing, QA tasks', isEnabled: true },
    { id: 'cat-005', name: 'Technical Writing', description: 'Documentation, API docs, guides', isEnabled: false },
    { id: 'cat-006', name: 'UI/UX Design', description: 'Design tasks, prototyping, user research', isEnabled: true },
    { id: 'cat-007', name: 'DevOps & Infrastructure', description: 'CI/CD, containerization, monitoring', isEnabled: false },
    { id: 'cat-008', name: 'Data Analysis', description: 'Data processing, visualization, reporting', isEnabled: true },
  ]
}
