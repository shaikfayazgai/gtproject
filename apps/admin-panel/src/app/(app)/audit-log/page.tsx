'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  PageHeader,
  Spinner,
  TextInput,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  DatePicker,
} from '@glimmora/ui'
import { AuditLogTable } from '@/components/audit-log'
import type { PlatformAuditEntry, AuditActionCategory } from '@glimmora/types'

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'user_management', label: 'User Management' },
  { value: 'project_intervention', label: 'Project Intervention' },
  { value: 'dispute_resolution', label: 'Dispute Resolution' },
  { value: 'content_management', label: 'Content Management' },
  { value: 'apg_configuration', label: 'APG Configuration' },
  { value: 'system', label: 'System' },
]

export default function AuditLogPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)

  const { data: entries, isLoading } = useQuery<PlatformAuditEntry[]>({
    queryKey: ['admin-audit-log'],
    queryFn: async () => {
      const res = await fetch('/api/admin/audit-log')
      if (!res.ok) throw new Error('Failed to fetch audit log')
      return res.json()
    },
  })

  const filteredEntries = useMemo(() => {
    if (!entries) return []
    let filtered = entries

    if (search.trim()) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.actorName.toLowerCase().includes(q) ||
          e.actionType.toLowerCase().includes(q) ||
          e.reason.toLowerCase().includes(q) ||
          e.affectedEntityId.toLowerCase().includes(q)
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (e) => e.actionCategory === (categoryFilter as AuditActionCategory)
      )
    }

    if (fromDate) {
      const from = fromDate.getTime()
      filtered = filtered.filter((e) => new Date(e.timestamp).getTime() >= from)
    }

    if (toDate) {
      const to = toDate.getTime() + 24 * 60 * 60 * 1000 // end of day
      filtered = filtered.filter((e) => new Date(e.timestamp).getTime() <= to)
    }

    return filtered
  }, [entries, search, categoryFilter, fromDate, toDate])

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader title="Platform Audit Log" />
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading audit log..." />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Platform Audit Log"
        subtitle="Immutable record of all administrative actions"
      />

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <TextInput
          placeholder="Search by actor, action, or entity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="border border-border rounded-inner bg-bg-card">
          <DatePicker selected={fromDate} onSelect={setFromDate} />
        </div>
        <div className="border border-border rounded-inner bg-bg-card">
          <DatePicker selected={toDate} onSelect={setToDate} />
        </div>
      </div>

      <AuditLogTable entries={filteredEntries} />
    </div>
  )
}
