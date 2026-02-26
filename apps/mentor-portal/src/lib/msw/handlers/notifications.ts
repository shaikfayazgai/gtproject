import { http, HttpResponse } from 'msw'
import type { NotificationChannel } from '@glimmora/types'

type MentorNotificationCategory = 'review_assignments' | 'sla_reminders' | 'decision_outcomes' | 'platform_updates'

interface MentorNotificationPref {
  category: MentorNotificationCategory
  channel: NotificationChannel
  enabled: boolean
}

const mockNotificationPrefs: MentorNotificationPref[] = [
  { category: 'review_assignments', channel: 'in_app', enabled: true },
  { category: 'review_assignments', channel: 'email', enabled: true },
  { category: 'sla_reminders', channel: 'in_app', enabled: true },
  { category: 'sla_reminders', channel: 'email', enabled: true },
  { category: 'decision_outcomes', channel: 'in_app', enabled: true },
  { category: 'decision_outcomes', channel: 'email', enabled: false },
  { category: 'platform_updates', channel: 'in_app', enabled: false },
  { category: 'platform_updates', channel: 'email', enabled: false },
]

export const notificationHandlers = [
  http.get('/api/mentor/notification-preferences', () => {
    return HttpResponse.json({ data: mockNotificationPrefs })
  }),

  http.put('/api/mentor/notification-preferences', async () => {
    return HttpResponse.json({ success: true })
  }),
]
