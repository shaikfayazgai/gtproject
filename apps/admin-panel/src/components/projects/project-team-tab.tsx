'use client'
import { useQuery } from '@tanstack/react-query'
import { AnonymizedTeamCard, Spinner, Badge } from '@glimmora/ui'
import type { AdminTeamMember } from '@/lib/msw/factories/project'
import { Users } from 'lucide-react'

const tierBadgeStatus: Record<string, 'normal' | 'inprogress' | 'done' | 'atrisk'> = {
  'emerging': 'normal',
  'developing': 'inprogress',
  'proficient': 'done',
  'expert': 'atrisk',
}

interface ProjectTeamTabProps {
  projectId: string
}

export function ProjectTeamTab({ projectId }: ProjectTeamTabProps) {
  const { data: members, isLoading, error } = useQuery<AdminTeamMember[]>({
    queryKey: ['admin-project-team', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/projects/${projectId}/team`)
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

  // Team stats
  const totalMembers = members.length
  const uniqueSkills = new Set(members.flatMap((m) => m.skills))
  const tierCounts: Record<string, number> = {}
  members.forEach((m) => {
    tierCounts[m.tier] = (tierCounts[m.tier] || 0) + 1
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-semibold text-text-heading">Team Summary</h3>
        <p className="text-sm font-body text-text-caption mt-0.5">
          Anonymized team members assigned to this project. No real contributor names are shown.
        </p>
      </div>

      {/* Team stats summary */}
      <div className="flex items-center gap-6 text-sm font-body text-text-caption">
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          <span>{totalMembers} members</span>
        </div>
        <span>{uniqueSkills.size} unique skills</span>
        <div className="flex items-center gap-2">
          {Object.entries(tierCounts).map(([tier, count]) => (
            <span key={tier} className="flex items-center gap-1">
              <Badge status={tierBadgeStatus[tier] ?? 'normal'}>{tier}</Badge>
              <span className="text-xs">({count})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Team grid */}
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
