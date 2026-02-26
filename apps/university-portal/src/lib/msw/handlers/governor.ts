import { http, HttpResponse } from 'msw'
import { createMockGovernorMetrics, createMockCohortTrends, createMockTaskCategories } from '../factories/governor'

const categories = createMockTaskCategories()

export const governorHandlers = [
  http.get('/api/governor/metrics', () => {
    return HttpResponse.json({ data: createMockGovernorMetrics() })
  }),

  http.get('/api/governor/cohorts', () => {
    return HttpResponse.json({ data: createMockCohortTrends() })
  }),

  http.get('/api/governor/categories', () => {
    return HttpResponse.json({ data: categories })
  }),

  http.put('/api/governor/categories/:categoryId', async ({ params, request }) => {
    const body = await request.json() as Partial<{ isEnabled: boolean }>
    const cat = categories.find(c => c.id === params.categoryId)
    if (cat && body.isEnabled !== undefined) {
      cat.isEnabled = body.isEnabled
    }
    return HttpResponse.json({ data: cat })
  }),
]
