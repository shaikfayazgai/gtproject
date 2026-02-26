'use client'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent, Badge, Tag } from '@glimmora/ui'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import type { Task, APIResponse } from '@glimmora/types'

const STATUS_BADGE_MAP: Record<
  string,
  'urgent' | 'normal' | 'inprogress' | 'done' | 'atrisk'
> = {
  open: 'normal',
  assigned: 'normal',
  'in-progress': 'inprogress',
  'evidence-submitted': 'inprogress',
  'under-review': 'atrisk',
  'rework-required': 'urgent',
  approved: 'done',
  completed: 'done',
  rejected: 'urgent',
}

export function TaskListWithTabs() {
  const [tab, setTab] = useState('all')
  const t = useTranslations('tasks')

  const { data, isLoading } = useQuery<APIResponse<Task[]>>({
    queryKey: ['tasks', tab],
    queryFn: () =>
      fetch(`/api/tasks${tab !== 'all' ? `?status=${tab}` : ''}`).then((r) =>
        r.json()
      ),
  })

  const tasks = data?.data ?? []

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="all">{t('all')}</TabsTrigger>
        <TabsTrigger value="open">{t('open')}</TabsTrigger>
        <TabsTrigger value="in-progress">{t('inProgress')}</TabsTrigger>
        <TabsTrigger value="under-review">{t('underReview')}</TabsTrigger>
        <TabsTrigger value="completed">{t('completed')}</TabsTrigger>
      </TabsList>

      <TabsContent value={tab}>
        <div className="space-y-3 mt-4">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="block bg-bg-card rounded-card shadow-card p-4 hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-body font-medium text-text-heading truncate">
                    {task.title}
                  </h3>
                  <p className="text-xs font-body text-text-caption mt-1 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {task.skillRequirements.map((skill) => (
                      <Tag key={skill} variant="skill">
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge status={STATUS_BADGE_MAP[task.status] ?? 'normal'}>
                    {task.status}
                  </Badge>
                  <span className="text-xs font-body text-text-caption">
                    {t('dueDate')}: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {tasks.length === 0 && !isLoading && (
            <p className="text-center text-sm font-body text-text-caption py-8">
              {t('noTasks')}
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
