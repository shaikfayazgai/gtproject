'use client'
import { KPIRow, APGActivityWidget, ActiveTasksSummary } from '@/components/dashboard'
import { PageHeader } from '@glimmora/ui'
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  return (
    <div className="space-y-6 p-6">
      <PageHeader title={t('title')} />
      <KPIRow activeTasks={3} earningsThisMonth={480} skillsGrowing={5} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveTasksSummary />
        <APGActivityWidget />
      </div>
    </div>
  )
}
