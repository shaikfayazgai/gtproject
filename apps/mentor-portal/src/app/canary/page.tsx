'use client'

import { useQuery } from '@tanstack/react-query'
import { Button, Heading, Body, Caption } from '@glimmora/ui'
import type { Task, APIResponse } from '@glimmora/types'
import { useAppStore } from '@/store/app-store'

export default function CanaryPage() {
  const { sidebarOpen, toggleSidebar } = useAppStore()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['canary-tasks'],
    queryFn: async (): Promise<APIResponse<Task[]>> => {
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    },
  })

  return (
    <main className="min-h-screen bg-bg-app p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Heading level="h1">Canary Validation</Heading>
          <Caption>Sidebar: {sidebarOpen ? 'open' : 'closed'}</Caption>
        </div>

        <Body>
          This page proves the complete toolchain: @glimmora/ui components,
          @glimmora/types interfaces, TanStack Query data fetching, MSW mock
          interception, and Zustand state management.
        </Body>

        <div className="flex gap-3">
          <Button variant="primary" onClick={() => refetch()}>
            Refetch Data
          </Button>
          <Button variant="secondary" onClick={toggleSidebar}>
            Toggle Sidebar State
          </Button>
        </div>

        <div className="p-4 bg-bg-card rounded-card shadow-card space-y-2">
          <Heading level="h3">Integration Status</Heading>
          <CheckItem label="@glimmora/ui" status="pass" detail="Components rendering" />
          <CheckItem label="@glimmora/types" status="pass" detail="Type imports working" />
          <CheckItem label="Tailwind v4 tokens" status="pass" detail="Brand colors applied" />
          <CheckItem
            label="TanStack Query + MSW"
            status={isLoading ? 'loading' : error ? 'fail' : 'pass'}
            detail={isLoading ? 'Fetching...' : error ? String(error) : `${data?.data?.length ?? 0} tasks loaded`}
          />
          <CheckItem
            label="Zustand"
            status="pass"
            detail={`Store active, sidebar=${sidebarOpen}`}
          />
        </div>

        {data?.data && (
          <div className="space-y-3">
            <Heading level="h3">Mock Tasks (from MSW)</Heading>
            {data.data.map((task) => (
              <div key={task.id} className="p-4 bg-bg-card rounded-card border border-border">
                <div className="flex items-center justify-between mb-2">
                  <Heading level="h4">{task.title}</Heading>
                  <span className={`text-xs px-2 py-1 rounded-badge ${
                    task.priority === 'urgent' ? 'bg-status-urgent/10 text-status-urgent' :
                    task.priority === 'high' ? 'bg-brand-primary/10 text-brand-primary' :
                    'bg-status-neutral/10 text-status-neutral'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <Body>{task.description}</Body>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {task.skillRequirements.map((skill) => (
                    <Caption key={skill} className="px-2 py-0.5 bg-bg-dashboard rounded-badge">
                      {skill}
                    </Caption>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function CheckItem({ label, status, detail }: { label: string; status: 'pass' | 'fail' | 'loading'; detail: string }) {
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⏳'
  return (
    <div className="flex items-center gap-2">
      <span>{icon}</span>
      <Caption className="font-medium">{label}</Caption>
      <Caption className="text-text-caption">{detail}</Caption>
    </div>
  )
}
