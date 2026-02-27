'use client'
import { useMemo } from 'react'
import { AnonymizedTeamCard, Badge, Tag } from '@glimmora/ui'
import type { Blueprint } from '@glimmora/types'
import { useEditorStore } from '@/store/editor-store'

interface TeamPoolPanelProps {
  blueprint: Blueprint
}

interface MockTeamMember {
  seed: string
  role: string
  skills: string[]
}

const MOCK_TEAM_POOL: MockTeamMember[] = [
  { seed: 'tm-alpha', role: 'Full-Stack Engineer', skills: ['react', 'typescript', 'node.js', 'postgresql', 'system-design'] },
  { seed: 'tm-beta', role: 'Mobile Developer', skills: ['swift', 'ios', 'kotlin', 'android', 'mobile-development'] },
  { seed: 'tm-gamma', role: 'Security Engineer', skills: ['security', 'compliance', 'encryption', 'devops'] },
  { seed: 'tm-delta', role: 'Data Engineer', skills: ['data-engineering', 'apache-kafka', 'postgresql', 'data-visualization'] },
  { seed: 'tm-epsilon', role: 'UI/UX Developer', skills: ['react', 'typescript', 'ui-design', 'accessibility', 'css'] },
  { seed: 'tm-zeta', role: 'DevOps Engineer', skills: ['devops', 'cloud-deployment', 'testing', 'cloud-architecture'] },
  { seed: 'tm-eta', role: 'Backend Developer', skills: ['node.js', 'typescript', 'api-design', 'api-integration', 'microservices'] },
  { seed: 'tm-theta', role: 'QA Engineer', skills: ['testing', 'accessibility', 'mobile-development', 'api-integration'] },
]

export function TeamPoolPanel({ blueprint }: TeamPoolPanelProps) {
  const selectedClauseId = useEditorStore((s) => s.selectedClauseId)

  const { requiredSkills, matchedMembers } = useMemo(() => {
    if (!selectedClauseId) {
      return { requiredSkills: [] as string[], matchedMembers: [] as Array<MockTeamMember & { isFullMatch: boolean }> }
    }

    // Find tasks linked to the selected clause
    const linkedTasks = blueprint.tasks.filter((t) =>
      t.clauseIds.includes(selectedClauseId)
    )

    // Collect unique skill requirements from linked tasks
    const skillSet = new Set<string>()
    for (const task of linkedTasks) {
      for (const skill of task.skillRequirements) {
        skillSet.add(skill)
      }
    }
    const skills = Array.from(skillSet)

    // Match team members: full match = all required skills present, partial = at least one
    const members = MOCK_TEAM_POOL
      .map((member) => {
        const matchCount = skills.filter((s) => member.skills.includes(s)).length
        return { ...member, matchCount, isFullMatch: matchCount === skills.length }
      })
      .filter((m) => m.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)

    return { requiredSkills: skills, matchedMembers: members }
  }, [selectedClauseId, blueprint.tasks])

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="text-sm font-heading font-semibold text-text-heading mb-4">
        Team Pool
      </h2>

      {!selectedClauseId ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm font-body text-text-caption">
            Select a SOW clause to see matched contributors
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Skill filter tags */}
          {requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {requiredSkills.map((skill) => (
                <Tag key={skill} variant="skill">
                  {skill}
                </Tag>
              ))}
            </div>
          )}

          {/* Team member cards */}
          <div className="space-y-3">
            {matchedMembers.map((member) => (
              <div key={member.seed} className="relative">
                <AnonymizedTeamCard
                  seed={member.seed}
                  role={member.role}
                  skills={member.skills}
                />
                <div className="absolute top-2 right-2">
                  <Badge status={member.isFullMatch ? 'done' : 'normal'}>
                    {member.isFullMatch ? 'Matched' : 'Partial Match'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {matchedMembers.length === 0 && (
            <p className="text-sm font-body text-text-caption text-center py-4">
              No matching contributors found for the required skills.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
