import type { Task } from '@glimmora/types'
import { randomId, isoNow } from './common'

let taskCounter = 1

export function createMockTask(overrides: Partial<Task> = {}): Task {
  const id = overrides.id ?? `task-${String(taskCounter++).padStart(3, '0')}`
  return {
    id,
    projectId: 'proj-001',
    title: `UI Component Implementation: ${id}`,
    description:
      'Implement the specified UI component following the design system guidelines and accessibility requirements.',
    type: 'development',
    status: 'open',
    priority: 'medium',
    skillRequirements: ['React', 'TypeScript', 'Tailwind CSS'],
    estimatedHours: 8,
    dueDate: '2026-04-01T00:00:00Z',
    apgGuidance:
      'Focus on accessibility and responsive behavior. Use existing design system components where possible.',
    createdAt: isoNow(),
    updatedAt: isoNow(),
    ...overrides,
  }
}

export function createMockTaskList(): Task[] {
  return [
    createMockTask({
      title: 'Build User Profile Card Component',
      status: 'in-progress',
      priority: 'high',
      skillRequirements: ['React', 'TypeScript', 'CSS'],
    }),
    createMockTask({
      title: 'Implement Search Filters API',
      status: 'evidence-submitted',
      priority: 'medium',
      skillRequirements: ['Node.js', 'TypeScript', 'SQL'],
    }),
    createMockTask({
      title: 'Create Mobile Navigation Menu',
      status: 'open',
      priority: 'medium',
      skillRequirements: ['React', 'CSS', 'Accessibility'],
    }),
    createMockTask({
      title: 'Write Unit Tests for Auth Module',
      status: 'under-review',
      priority: 'high',
      skillRequirements: ['Testing', 'TypeScript', 'Jest'],
    }),
    createMockTask({
      title: 'Design Data Export Feature',
      status: 'rework-required',
      priority: 'low',
      skillRequirements: ['TypeScript', 'CSV', 'React'],
      apgGuidance:
        'The export format needs to match the enterprise requirements. Ensure CSV headers match the SOW specification. Add data validation before export.',
    }),
    createMockTask({
      title: 'Optimize Image Loading Pipeline',
      status: 'approved',
      priority: 'medium',
      skillRequirements: ['Performance', 'React', 'CDN'],
    }),
    createMockTask({
      title: 'Build Notification Center Widget',
      status: 'open',
      priority: 'high',
      skillRequirements: ['React', 'WebSocket', 'TypeScript'],
    }),
    createMockTask({
      title: 'Implement Dark Mode Toggle',
      status: 'completed',
      priority: 'low',
      skillRequirements: ['CSS', 'React', 'Tailwind'],
    }),
  ]
}
