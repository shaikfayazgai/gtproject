'use client'
import { useQuery } from '@tanstack/react-query'
import { AnonymizedTeamCard, Spinner, Badge } from '@glimmora/ui'
import { Users } from 'lucide-react'

interface TeamMember {
  seed: string
  role: string
  skills: string[]
  tier: 'emerging' | 'developing' | 'proficient' | 'expert'
  tasksAssigned: number
}

const tierBadgeStatus: Record<string, 'normal' | 'inprogress' | 'done' | 'atrisk'> = {
  'emerging': 'normal',
  'developing': 'inprogress',
  'proficient': 'done',
  'expert': 'atrisk',
}

interface TeamSummaryGridProps {
  projectId: string
}

export function TeamSummaryGrid({ projectId }: TeamSummaryGridProps) {
  const { data: members, isLoading, error } = useQuery<TeamMember[]>({
    queryKey: ['project-team', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/enterprise/projects/${projectId}/team`)
      if (!res.ok) throw new Error('Failed to fetch team')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner label="Loading team..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-status-urgent text-sm">
        Failed to load team members. Please try again.
      </div>
    )
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-text-disabled mx-auto mb-3" />
        <p className="text-sm font-body text-text-caption">No team members assigned yet.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-text-caption" />
        <h3 className="text-base font-display font-semibold text-text-heading">
          Team Members
        </h3>
        <span className="text-sm font-body text-text-caption">({members.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member.seed} className="relative">
            <AnonymizedTeamCard
              seed={member.seed}
              role={member.role}
              skills={member.skills}
            />
            {/* Tier badge and task count overlay */}
            <div className="mt-2 flex items-center justify-center gap-2">
              <Badge status={tierBadgeStatus[member.tier] ?? 'normal'}>
                {member.tier}
              </Badge>
              <span className="text-xs font-body text-text-caption">
                {member.tasksAssigned} tasks assigned
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
