'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  PageHeader,
  Spinner,
  Button,
  TextInput,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@glimmora/ui'
import { Plus } from 'lucide-react'
import { ResourceLibraryTable } from '@/components/content'
import type { ResourceItem, ResourceItemType } from '@glimmora/types'

export default function ResourcesPage() {
  const queryClient = useQueryClient()
  const [addOpen, setAddOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState<ResourceItemType>('guide')
  const [newFileUrl, setNewFileUrl] = useState('')

  const { data: resources, isLoading } = useQuery<ResourceItem[]>({
    queryKey: ['admin-resources'],
    queryFn: async () => {
      const res = await fetch('/api/admin/content/resources')
      if (!res.ok) throw new Error('Failed to fetch resources')
      return res.json()
    },
  })

  const addMutation = useMutation({
    mutationFn: async (data: { title: string; type: ResourceItemType; fileUrl: string }) => {
      const res = await fetch('/api/admin/content/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to add resource')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] })
      setAddOpen(false)
      setNewTitle('')
      setNewType('guide')
      setNewFileUrl('')
    },
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader title="Resource Library" />
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading resources..." />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Resource Library"
        subtitle="Manage platform guides, policies, and templates"
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Resource
          </Button>
        }
      />

      <ResourceLibraryTable resources={resources ?? []} />

      {/* Add Resource Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <TextInput
              label="Title"
              placeholder="Resource title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-text-heading font-body mb-1.5">
                Type
              </label>
              <Select value={newType} onValueChange={(v) => setNewType(v as ResourceItemType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="template">Template</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TextInput
              label="File URL"
              placeholder="https://..."
              value={newFileUrl}
              onChange={(e) => setNewFileUrl(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => addMutation.mutate({ title: newTitle, type: newType, fileUrl: newFileUrl })}
              disabled={!newTitle.trim() || addMutation.isPending}
            >
              {addMutation.isPending ? 'Adding...' : 'Add Resource'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
