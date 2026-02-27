import { http, HttpResponse } from 'msw'
import { createMockAPGConfig } from '../factories/apg-config'
import { isoNow } from '../factories/common'

const mockConfig = createMockAPGConfig()

export const apgConfigHandlers = [
  http.get('/api/admin/apg-config', () => {
    return HttpResponse.json(mockConfig)
  }),

  http.patch('/api/admin/apg-config/:id', async ({ params, request }) => {
    const body = (await request.json()) as { value: string | number | boolean }
    const entry = mockConfig.find((e) => e.id === params.id)
    if (!entry) return new HttpResponse(null, { status: 404 })
    entry.value = body.value
    entry.updatedAt = isoNow()
    entry.updatedBy = 'Current Admin'
    return HttpResponse.json(entry)
  }),
]
