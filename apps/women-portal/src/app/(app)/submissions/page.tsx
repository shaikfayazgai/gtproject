'use client'
import { SubmissionStatusTracker } from '@/components/tasks'
import { PageHeader } from '@glimmora/ui'
import { useTranslations } from 'next-intl'

export default function SubmissionsPage() {
  const t = useTranslations('submissions')
  return (
    <div className="space-y-6 p-6">
      <PageHeader title={t('title')} />
      <SubmissionStatusTracker />
    </div>
  )
}
