'use client'

import { useState, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DataTable,
  Badge,
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
import { Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import type { ResourceItem, ResourceItemType } from '@glimmora/types'

const TYPE_BADGE_MAP: Record<ResourceItemType, 'normal' | 'inprogress' | 'atrisk'> = {
  guide: 'normal',
  policy: 'inprogress',
  template: 'atrisk',
  training: 'done' as 'normal',
}

interface ResourceLibraryTableProps {
  resources: ResourceItem[]
}

export function ResourceLibraryTable({ resources }: ResourceLibraryTableProps) {
  const queryClient = useQueryClient()
  const [editItem, setEditItem] = useState<ResourceItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<ResourceItem | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editType, setEditType] = useState<ResourceItemType>('guide')
  const [editFileUrl, setEditFileUrl] = useState('')

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; title: string; type: ResourceItemType; fileUrl: string }) => {
      const res = await fetch(`/api/admin/content/resources/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update resource')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] })
      setEditItem(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/content/resources/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete resource')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] })
      setDeleteItem(null)
    },
  })

  function openEdit(item: ResourceItem) {
    setEditTitle(item.title)
    setEditType(item.type)
    setEditFileUrl(item.fileUrl ?? '')
    setEditItem(item)
  }

  const columns: ColumnDef<ResourceItem, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ getValue }) => (
          <span className="font-medium text-text-heading">{String(getValue())}</span>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ getValue }) => {
          const type = getValue() as ResourceItemType
          return <Badge status={TYPE_BADGE_MAP[type] ?? 'normal'}>{type}</Badge>
        },
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated',
        cell: ({ getValue }) => format(new Date(getValue() as string), 'MMM d, yyyy'),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => openEdit(row.original)}
              className="p-1.5 rounded-inner hover:bg-hover text-text-caption hover:text-text-body transition-colors"
              aria-label="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setDeleteItem(row.original)}
              className="p-1.5 rounded-inner hover:bg-hover text-text-caption hover:text-status-urgent transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  )

  return (
    <>
      <DataTable<ResourceItem>
        columns={columns}
        data={resources}
        pageSize={10}
      />

      {/* Edit Dialog */}
      <Dialog
        open={!!editItem}
        onOpenChange={(open) => { if (!open) setEditItem(null) }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <TextInput
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-text-heading font-body mb-1.5">
                Type
              </label>
              <Select value={editType} onValueChange={(v) => setEditType(v as ResourceItemType)}>
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
              value={editFileUrl}
              onChange={(e) => setEditFileUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => editItem && updateMutation.mutate({
                id: editItem.id,
                title: editTitle,
                type: editType,
                fileUrl: editFileUrl,
              })}
              disabled={!editTitle.trim() || updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteItem}
        onOpenChange={(open) => { if (!open) setDeleteItem(null) }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
          </DialogHeader>
          <p className="text-sm font-body text-text-body">
            Are you sure you want to delete <strong>{deleteItem?.title}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
