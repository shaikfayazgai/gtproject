import { http, HttpResponse } from 'msw'
import type { SkillTagVerificationRequest } from '@glimmora/types'
import { isoPast } from '../factories/common'

const mockVerifications: SkillTagVerificationRequest[] = [
  {
    id: 'sv-001',
    contributorSeed: 'alpha-2f3a',
    skillTag: 'React',
    evidenceIds: ['ev-101', 'ev-102', 'ev-103'],
    status: 'pending',
    submittedAt: isoPast(24),
  },
  {
    id: 'sv-002',
    contributorSeed: 'beta-9c1d',
    skillTag: 'PostgreSQL',
    evidenceIds: ['ev-201', 'ev-202'],
    status: 'pending',
    submittedAt: isoPast(48),
  },
  {
    id: 'sv-003',
    contributorSeed: 'gamma-7e5b',
    skillTag: 'TypeScript',
    evidenceIds: ['ev-301', 'ev-302', 'ev-303', 'ev-304'],
    status: 'verified',
    submittedAt: isoPast(96),
  },
  {
    id: 'sv-004',
    contributorSeed: 'delta-4a8f',
    skillTag: 'Node.js',
    evidenceIds: ['ev-401'],
    status: 'disputed',
    submittedAt: isoPast(120),
  },
  {
    id: 'sv-005',
    contributorSeed: 'epsilon-3d2c',
    skillTag: 'Docker',
    evidenceIds: ['ev-501', 'ev-502'],
    status: 'pending',
    submittedAt: isoPast(8),
  },
]

export const skillVerificationHandlers = [
  http.get('/api/mentor/skill-verification', () => {
    return HttpResponse.json({ data: mockVerifications })
  }),

  http.post('/api/mentor/skill-verification/:id/verify', ({ params }) => {
    const item = mockVerifications.find(v => v.id === params.id)
    if (item) item.status = 'verified'
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/mentor/skill-verification/:id/dispute', async ({ params }) => {
    const item = mockVerifications.find(v => v.id === params.id)
    if (item) item.status = 'disputed'
    return HttpResponse.json({ success: true })
  }),
]
