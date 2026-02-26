import { http, HttpResponse } from 'msw'
import { createMockStudentProfile } from '../factories/user'

export const authHandlers = [
  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as {
      email: string
      password: string
      studentId: string
      universityName: string
    }
    return HttpResponse.json(
      {
        user: createMockStudentProfile({
          universityEmail: body.email,
          studentId: body.studentId,
          universityName: body.universityName,
        }),
        token: 'mock-jwt-token',
      },
      { status: 201 }
    )
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    return HttpResponse.json({
      user: createMockStudentProfile({ universityEmail: body.email }),
      token: 'mock-jwt-token',
    })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/auth/verify-email', async ({ request }) => {
    const body = (await request.json()) as { action: string; code?: string }
    if (body.action === 'send') {
      return HttpResponse.json({ success: true, message: 'Verification code sent' })
    }
    // Verify action -- accept any 6-digit code in mock
    return HttpResponse.json({ success: true, verified: true })
  }),

  http.post('/api/onboarding/profile', () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/onboarding/skills', () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/onboarding/complete', () => {
    return HttpResponse.json({ success: true })
  }),
]
