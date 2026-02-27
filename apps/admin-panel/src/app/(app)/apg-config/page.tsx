'use client'

import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PageHeader, Spinner, Heading } from '@glimmora/ui'
import { SuperAdminGate } from '@/components/apg-config/super-admin-gate'
import { ConfigCard } from '@/components/apg-config/config-card'
import type { APGConfigEntry, APGConfigDomain } from '@glimmora/types'

const DOMAIN_LABELS: Record<APGConfigDomain, string> = {
  thresholds: 'Thresholds',
  auto_approval_rules: 'Auto-Approval Rules',
  escalation_triggers: 'Escalation Triggers',
}

const DOMAIN_ORDER: APGConfigDomain[] = [
  'thresholds',
  'auto_approval_rules',
  'escalation_triggers',
]

export default function APGConfigPage() {
  const queryClient = useQueryClient()

  const { data: entries, isLoading } = useQuery<APGConfigEntry[]>({
    queryKey: ['apg-config'],
    queryFn: async () => {
      const res = await fetch('/api/admin/apg-config')
      if (!res.ok) throw new Error('Failed to fetch APG config')
      return res.json()
    },
  })

  const saveMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string | number | boolean }) => {
      const res = await fetch(`/api/admin/apg-config/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })
      if (!res.ok) throw new Error('Failed to save config')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apg-config'] }),
  })

  const grouped = useMemo(() => {
    if (!entries) return {}
    const result: Record<string, APGConfigEntry[]> = {}
    for (const domain of DOMAIN_ORDER) {
      result[domain] = entries.filter((e) => e.domain === domain)
    }
    return result
  }, [entries])

  async function handleSave(id: string, value: string | number | boolean) {
    await saveMutation.mutateAsync({ id, value })
  }

  return (
    <div className="p-6">
      <PageHeader
        title="APG Configuration"
        subtitle="Changes affect platform-wide AI governance behavior"
      />

      <SuperAdminGate>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner label="Loading configuration..." />
          </div>
        ) : (
          <div className="space-y-8">
            {DOMAIN_ORDER.map((domain) => {
              const domainEntries = grouped[domain] ?? []
              if (domainEntries.length === 0) return null
              return (
                <section key={domain}>
                  <Heading level="h4" className="mb-3">
                    {DOMAIN_LABELS[domain]}
                  </Heading>
                  {domainEntries.map((entry) => (
                    <ConfigCard key={entry.id} entry={entry} onSave={handleSave} />
                  ))}
                </section>
              )
            })}
          </div>
        )}
      </SuperAdminGate>
    </div>
  )
}
