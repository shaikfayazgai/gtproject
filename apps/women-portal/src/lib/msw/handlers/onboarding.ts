import { http, HttpResponse } from 'msw'
import type { OnboardingProgress } from '@glimmora/types'

const mockProgress: OnboardingProgress = {
  currentStep: 'profile',
  completedSteps: [],
  steps: [
    { id: 'profile', title: 'Your Profile', status: 'not_started' },
    { id: 'devices', title: 'Device & Connectivity', status: 'not_started' },
    { id: 'skills', title: 'Your Skills', status: 'not_started' },
    { id: 'activation', title: 'Activation', status: 'not_started' },
  ],
}

export const onboardingHandlers = [
  http.get('/api/onboarding/progress', () => {
    return HttpResponse.json(mockProgress)
  }),

  http.post('/api/onboarding/profile', async () => {
    return HttpResponse.json({ success: true, nextStep: 'devices' })
  }),

  http.post('/api/onboarding/devices', async () => {
    return HttpResponse.json({ success: true, nextStep: 'skills' })
  }),

  http.post('/api/onboarding/skills', async () => {
    return HttpResponse.json({ success: true, nextStep: 'activation' })
  }),

  http.post('/api/onboarding/complete', async () => {
    return HttpResponse.json({ success: true, redirectTo: '/dashboard' })
  }),
]
