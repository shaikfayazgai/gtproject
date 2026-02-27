'use client'
import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@glimmora/ui'
import type { Project } from '@glimmora/types'
import { ProjectOverviewTab } from './project-overview-tab'
import { ProjectTimelineTab } from './project-timeline-tab'
import { ProjectEvidenceTab } from './project-evidence-tab'
import { ProjectReworkTab } from './project-rework-tab'
import { ProjectEscalationTab } from './project-escalation-tab'
import { ProjectPaymentTab } from './project-payment-tab'
import { ProjectTeamTab } from './project-team-tab'
import { APGActivityTab } from './apg-activity-tab'
import { AdminInterventionLog } from './admin-intervention-log'
import { FreezeTab } from './freeze-tab'

const TAB_CONFIG = [
  { value: 'overview', label: 'Overview' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'evidence', label: 'Evidence Packs' },
  { value: 'rework', label: 'Rework Requests' },
  { value: 'escalation', label: 'Escalation Centre' },
  { value: 'payments', label: 'Payment Release' },
  { value: 'team', label: 'Team Summary' },
  { value: 'apg-activity', label: 'APG Activity Log' },
  { value: 'interventions', label: 'Admin Interventions' },
  { value: 'freeze', label: 'Freeze/Unfreeze' },
] as const

type TabValue = (typeof TAB_CONFIG)[number]['value']

function getInitialTab(): TabValue {
  if (typeof window === 'undefined') return 'overview'
  const hash = window.location.hash.replace('#', '')
  const valid = TAB_CONFIG.some((t) => t.value === hash)
  return valid ? (hash as TabValue) : 'overview'
}

interface ProjectAdminTabsProps {
  projectId: string
  project: Project
}

export function ProjectAdminTabs({ projectId, project }: ProjectAdminTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('overview')

  useEffect(() => {
    setActiveTab(getInitialTab())

    function onHashChange() {
      const hash = window.location.hash.replace('#', '')
      const valid = TAB_CONFIG.some((t) => t.value === hash)
      if (valid) setActiveTab(hash as TabValue)
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function handleTabChange(value: string) {
    setActiveTab(value as TabValue)
    window.location.hash = value
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="w-full flex-wrap">
        {TAB_CONFIG.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview">
        <ProjectOverviewTab projectId={projectId} project={project} />
      </TabsContent>

      <TabsContent value="timeline">
        <ProjectTimelineTab projectId={projectId} />
      </TabsContent>

      <TabsContent value="evidence">
        <ProjectEvidenceTab projectId={projectId} />
      </TabsContent>

      <TabsContent value="rework">
        <ProjectReworkTab projectId={projectId} />
      </TabsContent>

      <TabsContent value="escalation">
        <ProjectEscalationTab projectId={projectId} />
      </TabsContent>

      <TabsContent value="payments">
        <ProjectPaymentTab projectId={projectId} />
      </TabsContent>

      <TabsContent value="team">
        <ProjectTeamTab projectId={projectId} />
      </TabsContent>

      <TabsContent value="apg-activity">
        <APGActivityTab projectId={projectId} />
      </TabsContent>

      <TabsContent value="interventions">
        <AdminInterventionLog projectId={projectId} />
      </TabsContent>

      <TabsContent value="freeze">
        <FreezeTab projectId={projectId} isFrozen={project.status === 'frozen'} />
      </TabsContent>
    </Tabs>
  )
}
