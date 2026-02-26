import { http, HttpResponse } from 'msw'
import { createMockUser } from '../factories/user'

export const authHandlers = [
  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    return HttpResponse.json(
      {
        user: createMockUser({ email: body.email }),
        token: 'mock-jwt-token',
      },
      { status: 201 }
    )
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    return HttpResponse.json({
      user: createMockUser({ email: body.email }),
      token: 'mock-jwt-token',
    })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),
]
