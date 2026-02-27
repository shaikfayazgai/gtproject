'use client'

import { useState, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  Tag,
  Switch,
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
  Caption,
} from '@glimmora/ui'
import { Pencil, Merge } from 'lucide-react'
import type { SkillTaxonomyTag } from '@glimmora/types'

interface SkillTaxonomyTreeProps {
  skills: SkillTaxonomyTag[]
}

const CATEGORIES = ['Programming', 'Design', 'Data', 'Communication', 'Project Management']

export function SkillTaxonomyTree({ skills }: SkillTaxonomyTreeProps) {
  const queryClient = useQueryClient()
  const [editSkill, setEditSkill] = useState<SkillTaxonomyTag | null>(null)
  const [editName, setEditName] = useState('')
  const [mergeSkill, setMergeSkill] = useState<SkillTaxonomyTag | null>(null)
  const [mergeTarget, setMergeTarget] = useState('')

  const groupedSkills = useMemo(() => {
    const grouped: Record<string, SkillTaxonomyTag[]> = {}
    for (const cat of CATEGORIES) {
      grouped[cat] = skills.filter((s) => s.category === cat)
    }
    return grouped
  }, [skills])

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/admin/content/skills/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      })
      if (!res.ok) throw new Error('Failed to update skill')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-skills'] }),
  })

  const renameMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await fetch(`/api/admin/content/skills/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error('Failed to rename skill')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] })
      setEditSkill(null)
    },
  })

  const mergeMutation = useMutation({
    mutationFn: async ({ id, targetId }: { id: string; targetId: string }) => {
      const res = await fetch(`/api/admin/content/skills/${id}/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId }),
      })
      if (!res.ok) throw new Error('Failed to merge skill')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] })
      setMergeSkill(null)
    },
  })

  function openEdit(skill: SkillTaxonomyTag) {
    setEditName(skill.name)
    setEditSkill(skill)
  }

  function openMerge(skill: SkillTaxonomyTag) {
    setMergeTarget('')
    setMergeSkill(skill)
  }

  return (
    <div className="space-y-6">
      {CATEGORIES.map((category) => {
        const categorySkills = groupedSkills[category] ?? []
        if (categorySkills.length === 0) return null

        return (
          <Card key={category}>
            <CardContent className="p-5">
              <h3 className="text-sm font-display font-semibold text-text-heading mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Tag variant="skill">{skill.name}</Tag>
                      <Caption>{skill.usageCount} uses</Caption>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Switch
                        id={`skill-toggle-${skill.id}`}
                        checked={skill.isActive}
                        onCheckedChange={(checked) =>
                          toggleMutation.mutate({ id: skill.id, isActive: !!checked })
                        }
                      />
                      <button
                        onClick={() => openEdit(skill)}
                        className="p-1.5 rounded-inner hover:bg-hover text-text-caption hover:text-text-body transition-colors"
                        aria-label={`Edit ${skill.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => openMerge(skill)}
                        className="p-1.5 rounded-inner hover:bg-hover text-text-caption hover:text-text-body transition-colors"
                        aria-label={`Merge ${skill.name}`}
                      >
                        <Merge className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Edit Dialog */}
      <Dialog
        open={!!editSkill}
        onOpenChange={(open) => { if (!open) setEditSkill(null) }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Skill</DialogTitle>
          </DialogHeader>
          <TextInput
            label="Skill Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => editSkill && renameMutation.mutate({ id: editSkill.id, name: editName })}
              disabled={!editName.trim() || renameMutation.isPending}
            >
              {renameMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge Dialog */}
      <Dialog
        open={!!mergeSkill}
        onOpenChange={(open) => { if (!open) setMergeSkill(null) }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Skill</DialogTitle>
          </DialogHeader>
          <p className="text-sm font-body text-text-body">
            Merge <strong>{mergeSkill?.name}</strong> into another skill.
            All usage will be transferred to the target skill.
          </p>
          <Select value={mergeTarget} onValueChange={setMergeTarget}>
            <SelectTrigger>
              <SelectValue placeholder="Select target skill" />
            </SelectTrigger>
            <SelectContent>
              {skills
                .filter((s) => s.id !== mergeSkill?.id)
                .map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => mergeSkill && mergeTarget && mergeMutation.mutate({ id: mergeSkill.id, targetId: mergeTarget })}
              disabled={!mergeTarget || mergeMutation.isPending}
            >
              {mergeMutation.isPending ? 'Merging...' : 'Merge'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
