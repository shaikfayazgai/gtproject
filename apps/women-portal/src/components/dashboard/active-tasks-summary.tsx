'use client'
import { Badge, Button } from '@glimmora/ui'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import type { Task, APIResponse } from '@glimmora/types'

export function ActiveTasksSummary() {
  const t = useTranslations('dashboard')
  const { data } = useQuery<APIResponse<Task[]>>({
    queryKey: ['tasks', 'active'],
    queryFn: () => fetch('/api/tasks?status=in-progress').then((r) => r.json()),
  })

  const tasks = data?.data ?? []

  return (
    <div className="bg-bg-card rounded-card shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-text-heading">
          {t('currentTasks')}
        </h2>
        <Link href="/tasks">
          <Button variant="ghost" size="sm">
            {t('viewAllTasks')}
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {tasks.slice(0, 3).map((task) => (
          <Link
            key={task.id}
            href={`/tasks/${task.id}`}
            className="flex items-center justify-between p-3 rounded-inner hover:bg-hover transition-colors"
          >
            <div>
              <p className="text-sm font-body font-medium text-text-heading">
                {task.title}
              </p>
              <p className="text-xs font-body text-text-caption">
                {t('dueDate', { ns: 'tasks' })}: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
            <Badge status="inprogress">In Progress</Badge>
          </Link>
        ))}
        {tasks.length === 0 && (
          <p className="text-sm font-body text-text-caption text-center py-4">
            No active tasks
          </p>
        )}
      </div>
    </div>
  )
}
