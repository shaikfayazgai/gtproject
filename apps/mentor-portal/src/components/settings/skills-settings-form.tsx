'use client'
import { useState, useEffect } from 'react'
import { Button, PageHeader, Tag, Skeleton } from '@glimmora/ui'
import { useQuery, useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'

const EXPERTISE_AREAS = [
  'Frontend',
  'Backend',
  'Data Science',
  'UI/UX',
  'DevOps',
  'QA',
  'Technical Writing',
  'Mobile',
]

interface SkillsData {
  expertiseAreas: string[]
  skillTags: string[]
}

export function SkillsSettingsForm() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [skillTags, setSkillTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const { data, isLoading } = useQuery<SkillsData>({
    queryKey: ['mentor', 'skills'],
    queryFn: () => fetch('/api/mentor/profile').then(r => r.json()).then(d => ({
      expertiseAreas: d.expertiseAreas ?? [],
      skillTags: (d.skillTags ?? []).map((t: { tag: string } | string) =>
        typeof t === 'string' ? t : t.tag
      ),
    })),
  })

  useEffect(() => {
    if (data) {
      setSelectedAreas(data.expertiseAreas)
      setSkillTags(data.skillTags)
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: async (payload: SkillsData) => {
      const res = await fetch('/api/mentor/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      return res.json()
    },
  })

  const toggleArea = (area: string) => {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    )
  }

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !skillTags.includes(trimmed)) {
      setSkillTags(prev => [...prev, trimmed])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setSkillTags(prev => prev.filter(t => t !== tag))
  }

  const handleSave = () => mutation.mutate({ expertiseAreas: selectedAreas, skillTags })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48 rounded-inner" />
        <Skeleton className="h-64 rounded-card" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Expertise & Skills" />

      <div className="max-w-lg space-y-6">
        <div className="bg-bg-card rounded-card shadow-card p-5 space-y-6">
          {/* Expertise Areas */}
          <div>
            <p className="text-sm font-body font-medium text-text-body mb-3">Expertise Areas</p>
            <div className="grid grid-cols-2 gap-2">
              {EXPERTISE_AREAS.map((area) => {
                const checked = selectedAreas.includes(area)
                return (
                  <label
                    key={area}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded-inner hover:bg-hover transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArea(area)}
                      className="h-4 w-4 rounded text-brand-primary focus:ring-brand-primary focus:ring-offset-1 border-border"
                    />
                    <span className="text-sm font-body text-text-body">{area}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Skill Tags */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm font-body font-medium text-text-body mb-3">Skill Tags</p>
            {skillTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {skillTags.map((tag) => (
                  <div key={tag} className="flex items-center gap-1">
                    <Tag variant="skill">{tag}</Tag>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-text-caption hover:text-text-body transition-colors"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a skill tag..."
                className="flex-1 border border-border bg-bg-card text-text-body rounded-inner px-3 py-2 text-sm font-body placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1"
              />
              <Button
                variant="secondary"
                onClick={addTag}
                disabled={!tagInput.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} loading={mutation.isPending}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
