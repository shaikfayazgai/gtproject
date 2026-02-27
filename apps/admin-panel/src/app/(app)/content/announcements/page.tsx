'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  PageHeader,
  Spinner,
  Button,
  Badge,
  DataTable,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@glimmora/ui'
import { Plus, Pencil, Send, Archive } from 'lucide-react'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import type { PlatformAnnouncement, AnnouncementAudience, AnnouncementStatus } from '@glimmora/types'
import { AnnouncementsForm } from '@/components/content'

const STATUS_MAP: Record<AnnouncementStatus, 'normal' | 'done' | 'inprogress'> = {
  draft: 'normal',
  published: 'done',
  archived: 'inprogress',
}

const AUDIENCE_LABELS: Record<AnnouncementAudience, string> = {
  all: 'All Users',
  contributors: 'Contributors',
  enterprise: 'Enterprise',
  mentors: 'Mentors',
  admins: 'Admins',
}

export default function AnnouncementsPage() {
  const queryClient = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<PlatformAnnouncement | null>(null)

  const { data: announcements, isLoading } = useQuery<PlatformAnnouncement[]>({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const res = await fetch('/api/admin/content/announcements')
      if (!res.ok) throw new Error('Failed to fetch announcements')
      return res.json()
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; audience: AnnouncementAudience; status: 'draft' | 'published' }) => {
      const url = editing
        ? `/api/admin/content/announcements/${editing.id}`
        : '/api/admin/content/announcements'
      const method = editing ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to save announcement')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] })
      setFormOpen(false)
      setEditing(null)
    },
  })

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/content/announcements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      })
      if (!res.ok) throw new Error('Failed to archive')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-announcements'] }),
  })

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/content/announcements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      })
      if (!res.ok) throw new Error('Failed to publish')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-announcements'] }),
  })

  const columns: ColumnDef<PlatformAnnouncement, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ getValue }) => (
          <span className="font-medium text-text-heading">{String(getValue())}</span>
        ),
      },
      {
        accessorKey: 'audience',
        header: 'Audience',
        cell: ({ getValue }) => (
          <Badge status="normal">
            {AUDIENCE_LABELS[getValue() as AnnouncementAudience] ?? String(getValue())}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue() as AnnouncementStatus
          return <Badge status={STATUS_MAP[status]}>{status}</Badge>
        },
      },
      {
        accessorKey: 'publishedAt',
        header: 'Published',
        cell: ({ getValue }) => {
          const val = getValue() as string | undefined
          return val ? format(new Date(val), 'MMM d, yyyy') : '--'
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const ann = row.original
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setEditing(ann); setFormOpen(true) }}
                className="p-1.5 rounded-inner hover:bg-hover text-text-caption hover:text-text-body transition-colors"
                aria-label="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              {ann.status === 'draft' && (
                <button
                  onClick={() => publishMutation.mutate(ann.id)}
                  className="p-1.5 rounded-inner hover:bg-hover text-text-caption hover:text-text-body transition-colors"
                  aria-label="Publish"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              )}
              {ann.status !== 'archived' && (
                <button
                  onClick={() => archiveMutation.mutate(ann.id)}
                  className="p-1.5 rounded-inner hover:bg-hover text-text-caption hover:text-text-body transition-colors"
                  aria-label="Archive"
                >
                  <Archive className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )
        },
        enableSorting: false,
      },
    ],
    [archiveMutation, publishMutation]
  )

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader title="Platform Announcements" />
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading announcements..." />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Platform Announcements"
        subtitle="Create and publish announcements with audience targeting"
        actions={
          <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Announcement
          </Button>
        }
      />

      <DataTable<PlatformAnnouncement>
        columns={columns}
        data={announcements ?? []}
        pageSize={10}
      />

      <Dialog open={formOpen} onOpenChange={(open) => { if (!open) { setFormOpen(false); setEditing(null) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Announcement' : 'New Announcement'}
            </DialogTitle>
          </DialogHeader>
          <AnnouncementsForm
            announcement={editing}
            onSave={async (data) => { await saveMutation.mutateAsync(data) }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
