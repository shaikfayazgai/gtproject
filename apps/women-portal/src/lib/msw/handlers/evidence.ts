import { http, HttpResponse } from 'msw'
import {
  createMockEvidencePack,
  createMockReworkEvidencePack,
} from '../factories/evidence'

const evidencePacks = new Map<
  string,
  ReturnType<typeof createMockEvidencePack>
>()

// Pre-seed the rework task with rework evidence
evidencePacks.set('task-005', createMockReworkEvidencePack('task-005'))

export const evidenceHandlers = [
  http.post('/api/tasks/:taskId/evidence', async ({ params }) => {
    const pack = createMockEvidencePack(params.taskId as string)
    evidencePacks.set(params.taskId as string, pack)
    return HttpResponse.json({ data: pack }, { status: 201 })
  }),

  http.get('/api/tasks/:taskId/evidence', ({ params }) => {
    const taskId = params.taskId as string
    const pack =
      evidencePacks.get(taskId) ||
      createMockEvidencePack(taskId, 'under-review')
    return HttpResponse.json({ data: pack })
  }),
]
