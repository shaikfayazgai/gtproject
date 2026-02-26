import { http, HttpResponse } from 'msw'
import { createMockProfile, createMockMetrics } from '../factories/mentor'

export const profileHandlers = [
  http.get('/api/mentor/profile', () => {
    const profile = createMockProfile()
    const metrics = createMockMetrics()
    return HttpResponse.json({
      ...profile,
      ...metrics,
      expertiseAreas: ['Frontend', 'Backend', 'TypeScript'],
      skillTags: [
        { tag: 'React', verified: true },
        { tag: 'Node.js', verified: true },
        { tag: 'PostgreSQL', verified: false },
        { tag: 'TypeScript', verified: true },
      ],
    })
  }),

  http.put('/api/mentor/profile', async () => {
    return HttpResponse.json({ success: true })
  }),

  http.put('/api/mentor/capacity', async () => {
    return HttpResponse.json({ success: true })
  }),

  http.put('/api/mentor/skills', async () => {
    return HttpResponse.json({ success: true })
  }),
]
