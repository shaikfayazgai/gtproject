import { http, HttpResponse } from 'msw'
import type { ReviewQueueItem } from '@glimmora/types'

const mockQueueItems: ReviewQueueItem[] = [
  {
    id: 'rev-001',
    taskId: 'task-001',
    taskTitle: 'Build REST API endpoint with authentication',
    submittedAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    slaDeadline: new Date(Date.now() + 22 * 3600_000).toISOString(),
    status: 'pending',
    skillTags: ['Node.js', 'REST API', 'Authentication'],
    submissionCount: 1,
    hasDraft: false,
    hasSLAExtensionPending: false,
  },
  {
    id: 'rev-002',
    taskId: 'task-002',
    taskTitle: 'React component with state management',
    submittedAt: new Date(Date.now() - 18 * 3600_000).toISOString(),
    slaDeadline: new Date(Date.now() + 6 * 3600_000).toISOString(),
    status: 'pending',
    skillTags: ['React', 'TypeScript', 'Zustand'],
    submissionCount: 2,
    hasDraft: false,
    hasSLAExtensionPending: false,
  },
  {
    id: 'rev-003',
    taskId: 'task-003',
    taskTitle: 'Database schema design and migration',
    submittedAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    slaDeadline: new Date(Date.now() + 2 * 3600_000).toISOString(),
    status: 'in_progress',
    skillTags: ['PostgreSQL', 'Migrations'],
    submissionCount: 1,
    hasDraft: true,
    hasSLAExtensionPending: false,
  },
  {
    id: 'rev-004',
    taskId: 'task-004',
    taskTitle: 'API integration testing suite',
    submittedAt: new Date(Date.now() - 48 * 3600_000).toISOString(),
    slaDeadline: new Date(Date.now() - 2 * 3600_000).toISOString(),
    status: 'in_progress',
    skillTags: ['Testing', 'Jest', 'API'],
    submissionCount: 3,
    hasDraft: true,
    hasSLAExtensionPending: true,
  },
  {
    id: 'rev-005',
    taskId: 'task-005',
    taskTitle: 'UI component library implementation',
    submittedAt: new Date(Date.now() - 72 * 3600_000).toISOString(),
    slaDeadline: new Date(Date.now() - 24 * 3600_000).toISOString(),
    status: 'completed',
    skillTags: ['React', 'Design System'],
    submissionCount: 1,
    hasDraft: false,
    hasSLAExtensionPending: false,
  },
]

const extensionRequests: Set<string> = new Set()

export const reviewHandlers = [
  http.get('/api/mentor/queue', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status') || 'pending'
    const items = mockQueueItems.filter((item) => item.status === status)
    return HttpResponse.json({ data: items })
  }),

  http.get('/api/mentor/reviews/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      task: {
        title: 'Build REST API endpoint',
        brief: 'Create a REST API...',
        deliverables: ['endpoint.ts', 'auth.middleware.ts'],
        skillTags: ['Node.js', 'REST API'],
      },
      evidences: [
        {
          id: 'ev-001',
          type: 'code',
          content: 'const express = require("express")...',
          submittedAt: new Date().toISOString(),
        },
        {
          id: 'ev-002',
          type: 'url',
          content: 'https://github.com/example/api-endpoint',
          submittedAt: new Date().toISOString(),
        },
      ],
    })
  }),

  http.post('/api/mentor/reviews/:id/decision', async () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/mentor/reviews/:id/skip', async () => {
    return HttpResponse.json({
      success: true,
      message: 'Review reassigned to next available mentor',
    })
  }),

  http.post('/api/mentor/reviews/:id/sla-extension', async ({ params }) => {
    extensionRequests.add(params.id as string)
    return HttpResponse.json({
      status: 'pending_admin_approval',
      message: 'Extension request submitted. Admin review required within 24 hours.',
    })
  }),

  http.get('/api/mentor/profile', () => {
    return HttpResponse.json({
      pendingReviews: mockQueueItems.filter((i) => i.status === 'pending').length,
      completedThisWeek: 5,
      avgSLADaysRemaining: 1.4,
    })
  }),

  http.get('/api/apg/activities', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'apg-1',
          type: 'review_requested',
          message: 'New review assigned to your queue',
          timestamp: new Date().toISOString(),
        },
        {
          id: 'apg-2',
          type: 'milestone_completed',
          message: 'SLA target met for rev-005',
          timestamp: new Date(Date.now() - 3600_000).toISOString(),
        },
      ],
    })
  }),
]
