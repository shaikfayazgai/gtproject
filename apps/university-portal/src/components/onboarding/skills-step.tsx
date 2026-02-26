'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button, Heading, Tag, TextInput } from '@glimmora/ui'

const STUDENT_SKILLS = [
  'React',
  'TypeScript',
  'Python',
  'Java',
  'Node.js',
  'SQL',
  'Machine Learning',
  'UI/UX Design',
  'Technical Writing',
  'Data Analysis',
]

export function SkillsStep() {
  const t = useTranslations('onboarding')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [customSkill, setCustomSkill] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  function addCustomSkill() {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills((prev) => [...prev, customSkill.trim()])
      setCustomSkill('')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    await fetch('/api/onboarding/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills: selectedSkills }),
    })
    setIsLoading(false)
    router.push('/onboarding/activation')
  }

  return (
    <div className="min-h-screen bg-bg-app px-6 py-10">
      <div className="max-w-sm mx-auto space-y-6">
        <div>
          <p className="text-text-caption text-xs uppercase tracking-wide font-body">
            {t('stepOf', { current: 3, total: 4 })}
          </p>
          <Heading level="h2" className="text-text-heading mt-1">
            {t('skills.title')}
          </Heading>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-text-caption text-sm">{t('skills.instruction')}</p>
          <div className="flex flex-wrap gap-2">
            {STUDENT_SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-bg-card text-text-body border-border hover:border-brand-primary'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <TextInput
              placeholder={t('skills.addSkill')}
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomSkill()
                }
              }}
              className="flex-1"
            />
            <Button type="button" variant="secondary" onClick={addCustomSkill}>
              +
            </Button>
          </div>
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedSkills.map((skill) => (
                <Tag
                  key={skill}
                  variant="skill"
                  dismissible
                  onDismiss={() => toggleSkill(skill)}
                >
                  {skill}
                </Tag>
              ))}
            </div>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading || selectedSkills.length === 0}
          >
            {isLoading ? 'Saving...' : tCommon('continue')}
          </Button>
        </form>
      </div>
    </div>
  )
}
