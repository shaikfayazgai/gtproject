'use client'

import { useState, useEffect } from 'react'
import {
  Button,
  TextInput,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  DialogFooter,
  DialogClose,
} from '@glimmora/ui'
import type { PlatformAnnouncement, AnnouncementAudience } from '@glimmora/types'

const AUDIENCE_OPTIONS: { value: AnnouncementAudience; label: string }[] = [
  { value: 'all', label: 'All Users' },
  { value: 'contributors', label: 'Contributors' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'mentors', label: 'Mentors' },
  { value: 'admins', label: 'Admins' },
]

interface AnnouncementsFormProps {
  announcement?: PlatformAnnouncement | null
  onSave: (data: { title: string; content: string; audience: AnnouncementAudience; status: 'draft' | 'published' }) => Promise<void>
}

export function AnnouncementsForm({ announcement, onSave }: AnnouncementsFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [audience, setAudience] = useState<AnnouncementAudience>('all')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title)
      setContent(announcement.content)
      setAudience(announcement.audience)
    }
  }, [announcement])

  async function handleSubmit(status: 'draft' | 'published') {
    if (!title.trim() || !content.trim()) return
    setSaving(true)
    try {
      await onSave({ title: title.trim(), content: content.trim(), audience, status })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <TextInput
        label="Title"
        placeholder="Announcement title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        label="Content"
        placeholder="Write your announcement..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
      />
      <div>
        <label className="block text-sm font-medium text-text-heading font-body mb-1.5">
          Target Audience
        </label>
        <Select value={audience} onValueChange={(v) => setAudience(v as AnnouncementAudience)}>
          <SelectTrigger>
            <SelectValue placeholder="Select audience" />
          </SelectTrigger>
          <SelectContent>
            {AUDIENCE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" disabled={saving}>Cancel</Button>
        </DialogClose>
        <Button
          variant="secondary"
          onClick={() => handleSubmit('draft')}
          disabled={!title.trim() || !content.trim() || saving}
        >
          Save Draft
        </Button>
        <Button
          onClick={() => handleSubmit('published')}
          disabled={!title.trim() || !content.trim() || saving}
        >
          {saving ? 'Saving...' : 'Publish'}
        </Button>
      </DialogFooter>
    </div>
  )
}
