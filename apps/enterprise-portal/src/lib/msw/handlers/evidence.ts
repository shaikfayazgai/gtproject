import { http, HttpResponse, delay } from 'msw'
import {
  createMockEvidencePacks,
  createMockEvidencePackDetail,
  createMockReworkRequests,
  createMockEscalations,
} from '../factories/evidence'

export const evidenceHandlers = [
  http.get('/api/enterprise/projects/:id/evidence', async ({ params }) => {
    await delay(400)
    const id = params.id as string
    return HttpResponse.json(createMockEvidencePacks(id))
  }),

  http.get('/api/enterprise/evidence/:packId', async ({ params }) => {
    await delay(300)
    const packId = params.packId as string
    return HttpResponse.json(createMockEvidencePackDetail(packId))
  }),

  http.post('/api/enterprise/evidence/:packId/approve', async () => {
    await delay(500)
    return HttpResponse.json({ status: 'approved', paymentTriggered: true })
  }),

  http.post('/api/enterprise/evidence/:packId/rework', async ({ request }) => {
    await delay(400)
    const body = (await request.json()) as { reason?: string; itemsToAddress?: string }
    if (!body.reason || !body.itemsToAddress) {
      return HttpResponse.json(
        { error: 'Both reason and itemsToAddress are required' },
        { status: 400 }
      )
    }
    return HttpResponse.json({ status: 'rework-required' })
  }),

  http.post('/api/enterprise/evidence/:packId/escalate', async ({ request }) => {
    await delay(400)
    const body = (await request.json()) as { reason?: string; priority?: string }
    if (!body.reason) {
      return HttpResponse.json(
        { error: 'Reason is required' },
        { status: 400 }
      )
    }
    return HttpResponse.json({ status: 'escalated' })
  }),

  http.get('/api/enterprise/projects/:id/rework', async ({ params }) => {
    await delay(300)
    const id = params.id as string
    return HttpResponse.json(createMockReworkRequests(id))
  }),

  http.get('/api/enterprise/projects/:id/escalations', async ({ params }) => {
    await delay(300)
    const id = params.id as string
    return HttpResponse.json(createMockEscalations(id))
  }),
]
