import { http, HttpResponse } from 'msw'
import {
  createMockDisputeList,
  createMockDisputeDetail,
  createMockSafetyCaseList,
  createMockSafetyCaseDetail,
  createMockDisputeEvidence,
  createMockDisputeMessages,
  createMockDisputeAudit,
} from '../factories/dispute'

const mockDisputes = createMockDisputeList()
const mockSafetyCases = createMockSafetyCaseList()

export const disputeHandlers = [
  // ---- Safety routes MUST come BEFORE /disputes/:id to prevent path shadowing ----

  http.get('/api/admin/disputes/safety', () => {
    return HttpResponse.json(mockSafetyCases)
  }),

  http.get('/api/admin/disputes/safety/:id', ({ params }) => {
    const detail = createMockSafetyCaseDetail(params.id as string)
    return HttpResponse.json(detail)
  }),

  // ---- Dispute list ----

  http.get('/api/admin/disputes', () => {
    return HttpResponse.json(mockDisputes)
  }),

  // ---- Dispute detail ----

  http.get('/api/admin/disputes/:id', ({ params }) => {
    const detail = createMockDisputeDetail(params.id as string)
    return HttpResponse.json(detail)
  }),

  // ---- Dispute evidence ----

  http.get('/api/admin/disputes/:id/evidence', ({ params }) => {
    return HttpResponse.json(createMockDisputeEvidence(params.id as string))
  }),

  // ---- Dispute messages ----

  http.get('/api/admin/disputes/:id/messages', ({ params }) => {
    return HttpResponse.json(createMockDisputeMessages(params.id as string))
  }),

  http.post('/api/admin/disputes/:id/messages', async ({ params, request }) => {
    const body = (await request.json()) as { content: string }
    return HttpResponse.json(
      {
        id: `msg-${Date.now()}`,
        disputeId: params.id,
        senderRole: 'admin',
        content: body.content,
        sentAt: new Date().toISOString(),
      },
      { status: 201 }
    )
  }),

  // ---- Dispute decision ----

  http.post('/api/admin/disputes/:id/decision', async ({ params, request }) => {
    const body = await request.json()
    return HttpResponse.json({
      success: true,
      disputeId: params.id,
      decision: body,
      decidedAt: new Date().toISOString(),
    })
  }),

  // ---- Dispute audit trail ----

  http.get('/api/admin/disputes/:id/audit', ({ params }) => {
    return HttpResponse.json(createMockDisputeAudit(params.id as string))
  }),
]
