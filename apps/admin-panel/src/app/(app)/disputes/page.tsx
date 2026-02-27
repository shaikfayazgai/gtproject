'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import {
  PageHeader,
  Spinner,
  Badge,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@glimmora/ui'
import { Shield } from 'lucide-react'
import type { Dispute, DisputeType, DisputeSeverity, DisputeStatus } from '@glimmora/types'
import { DisputeQueueTable } from '@/components/disputes'

type TypeFilter = 'all' | DisputeType
type SeverityFilter = 'all' | DisputeSeverity
type StatusFilter = 'all' | DisputeStatus

export default function DisputesPage() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const { data: disputes, isLoading, error } = useQuery<Dispute[]>({
    queryKey: ['disputes'],
    queryFn: async () => {
      const res = await fetch('/api/admin/disputes')
      if (!res.ok) throw new Error('Failed to fetch disputes')
      return res.json()
    },
  })

  const { data: safetyCases } = useQuery<Dispute[]>({
    queryKey: ['safety-cases'],
    queryFn: async () => {
      const res = await fetch('/api/admin/disputes/safety')
      if (!res.ok) throw new Error('Failed to fetch safety cases')
      return res.json()
    },
  })

  const filtered = useMemo(() => {
    if (!disputes) return []
    let result = disputes
    if (typeFilter !== 'all') result = result.filter((d) => d.type === typeFilter)
    if (severityFilter !== 'all') result = result.filter((d) => d.severity === severityFilter)
    if (statusFilter !== 'all') result = result.filter((d) => d.status === statusFilter)
    return result
  }, [disputes, typeFilter, severityFilter, statusFilter])

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader title="Dispute Resolution" />
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading disputes..." />
        </div>
      </div>
    )
  }

  if (error || !disputes) {
    return (
      <div className="p-6">
        <PageHeader title="Dispute Resolution" />
        <div className="p-4 text-status-urgent text-sm">
          Failed to load disputes. Please try again.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Dispute Resolution"
        actions={
          <Link
            href="/disputes/safety"
            className="inline-flex items-center gap-2 rounded-inner border border-status-urgent/30 bg-status-urgent/5 px-4 py-2 text-sm font-body font-medium text-status-urgent hover:bg-status-urgent/10 transition-colors"
          >
            <Shield className="h-4 w-4" />
            Safety Cases
            {safetyCases && safetyCases.length > 0 && (
              <Badge status="urgent">{safetyCases.length}</Badge>
            )}
          </Link>
        }
      />

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="w-48">
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
              <SelectItem value="conduct">Conduct</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as SeverityFilter)}>
            <SelectTrigger>
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="awaiting_evidence">Awaiting Evidence</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dispute Table */}
      <DisputeQueueTable disputes={filtered} />
    </div>
  )
}
