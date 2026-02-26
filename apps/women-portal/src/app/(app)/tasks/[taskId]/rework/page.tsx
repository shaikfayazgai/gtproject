'use client'
import { use } from 'react'
import { ReworkRequestView } from '@/components/tasks'
import { PageHeader } from '@glimmora/ui'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function ReworkPage({
  params,
}: {
  params: Promise<{ taskId: string }>
}) {
  const { taskId } = use(params)
  const t = useTranslations('rework')
  return (
    <div className="p-6">
      <PageHeader
        title={t('title')}
        breadcrumb={
          <Link
            href={`/tasks/${taskId}`}
            className="hover:text-brand-primary transition-colors"
          >
            Task Detail
          </Link>
        }
      />
      <ReworkRequestView taskId={taskId} />
    </div>
  )
}
