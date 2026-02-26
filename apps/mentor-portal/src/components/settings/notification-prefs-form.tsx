'use client'
import { useState, useEffect } from 'react'
import { Switch, Button, PageHeader } from '@glimmora/ui'
import { useQuery, useMutation } from '@tanstack/react-query'
import type { NotificationChannel } from '@glimmora/types'

type MentorNotificationCategory = 'review_assignments' | 'sla_reminders' | 'decision_outcomes' | 'platform_updates'

const categories: { key: MentorNotificationCategory; label: string; description: string }[] = [
  {
    key: 'review_assignments',
    label: 'Review Assignments',
    description: 'New reviews assigned to your queue',
  },
  {
    key: 'sla_reminders',
    label: 'SLA Reminders',
    description: 'Reminders about approaching SLA deadlines',
  },
  {
    key: 'decision_outcomes',
    label: 'Decision Outcomes',
    description: 'Updates on appeal outcomes for your decisions',
  },
  {
    key: 'platform_updates',
    label: 'Platform Updates',
    description: 'Platform announcements and feature updates',
  },
]

const channels: { key: NotificationChannel; label: string }[] = [
  { key: 'in_app', label: 'In-App' },
  { key: 'email', label: 'Email' },
]

interface MentorNotificationPref {
  category: MentorNotificationCategory
  channel: NotificationChannel
  enabled: boolean
}

export function NotificationPrefsForm() {
  const [prefs, setPrefs] = useState<MentorNotificationPref[]>([])

  const { data } = useQuery<{ data: MentorNotificationPref[] }>({
    queryKey: ['mentor', 'notification-preferences'],
    queryFn: () => fetch('/api/mentor/notification-preferences').then(r => r.json()),
  })

  useEffect(() => {
    if (data?.data) setPrefs(data.data)
  }, [data])

  const mutation = useMutation({
    mutationFn: async (notifications: MentorNotificationPref[]) => {
      const res = await fetch('/api/mentor/notification-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifications),
      })
      return res.json()
    },
  })

  const isEnabled = (category: MentorNotificationCategory, channel: NotificationChannel) => {
    return prefs.find(p => p.category === category && p.channel === channel)?.enabled ?? false
  }

  const togglePref = (category: MentorNotificationCategory, channel: NotificationChannel, enabled: boolean) => {
    setPrefs(prev => {
      const existing = prev.find(p => p.category === category && p.channel === channel)
      if (existing) {
        return prev.map(p =>
          p.category === category && p.channel === channel ? { ...p, enabled } : p
        )
      }
      return [...prev, { category, channel, enabled }]
    })
  }

  const handleSave = () => mutation.mutate(prefs)

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Notification Preferences" />

      <div className="max-w-2xl">
        <div className="bg-bg-card rounded-card shadow-card overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border bg-bg-dashboard">
                <th className="text-start px-4 py-3 text-xs font-medium text-text-caption uppercase tracking-wider">
                  Category
                </th>
                {channels.map((channel) => (
                  <th
                    key={channel.key}
                    className="text-center px-4 py-3 text-xs font-medium text-text-caption uppercase tracking-wider"
                  >
                    {channel.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.key} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="text-text-body font-medium">{category.label}</p>
                    <p className="text-xs text-text-caption mt-0.5">{category.description}</p>
                  </td>
                  {channels.map((channel) => (
                    <td key={channel.key} className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <Switch
                          id={`${category.key}-${channel.key}`}
                          checked={isEnabled(category.key, channel.key)}
                          onCheckedChange={(checked: boolean) =>
                            togglePref(category.key, channel.key, checked)
                          }
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-border">
            <Button onClick={handleSave} loading={mutation.isPending}>
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
