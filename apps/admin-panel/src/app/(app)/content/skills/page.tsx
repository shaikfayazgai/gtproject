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
import { SkillTaxonomyTree } from '@/components/content'
import type { SkillTaxonomyTag } from '@glimmora/types'

const CATEGORIES = ['Programming', 'Design', 'Data', 'Communication', 'Project Management']

export default function SkillsPage() {
  const queryClient = useQueryClient()
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('')

  const { data: skills, isLoading } = useQuery<SkillTaxonomyTag[]>({
    queryKey: ['admin-skills'],
    queryFn: async () => {
      const res = await fetch('/api/admin/content/skills')
      if (!res.ok) throw new Error('Failed to fetch skills')
      return res.json()
    },
  })

  const addMutation = useMutation({
    mutationFn: async (skill: { name: string; category: string }) => {
      const res = await fetch('/api/admin/content/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill),
      })
      if (!res.ok) throw new Error('Failed to add skill')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] })
      setAddOpen(false)
      setNewName('')
      setNewCategory('')
    },
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader title="Skill Taxonomy" />
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading skills..." />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Skill Taxonomy"
        subtitle="Manage platform skill categories and tags"
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Skill
          </Button>
        }
      />

      <SkillTaxonomyTree skills={skills ?? []} />

      {/* Add Skill Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <TextInput
              label="Skill Name"
              placeholder="e.g. TypeScript"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-text-heading font-body mb-1.5">
                Category
              </label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => addMutation.mutate({ name: newName, category: newCategory })}
              disabled={!newName.trim() || !newCategory || addMutation.isPending}
            >
              {addMutation.isPending ? 'Adding...' : 'Add Skill'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
