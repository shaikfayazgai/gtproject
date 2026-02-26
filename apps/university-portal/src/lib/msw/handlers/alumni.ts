import { http, HttpResponse } from 'msw'
import { createMockAlumniProfile } from '../factories/alumni'
import { createMockCredentials } from '../factories/podl'

export const alumniHandlers = [
  http.post('/api/alumni/reactivate', async ({ request }) => {
    const body = await request.json() as { email: string; graduationYear: number; currentEmployment?: string }
    const alumni = createMockAlumniProfile({
      graduationYear: body.graduationYear,
      currentEmployment: body.currentEmployment,
    })
    return HttpResponse.json({ data: alumni })
  }),

  http.get('/api/alumni/credentials', () => {
    return HttpResponse.json({ data: createMockCredentials() })
  }),
]
