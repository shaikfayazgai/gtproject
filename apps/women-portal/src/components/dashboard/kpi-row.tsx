'use client'
import { GradientCard, KPIStatCard } from '@glimmora/ui'
import { useTranslations } from 'next-intl'

interface KPIRowProps {
  activeTasks: number
  earningsThisMonth: number
  skillsGrowing: number
}

export function KPIRow({ activeTasks, earningsThisMonth, skillsGrowing }: KPIRowProps) {
  const t = useTranslations('dashboard')
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <GradientCard gradient="primary" className="p-6">
        <p className="text-[36px] font-display font-semibold text-white leading-tight">
          {activeTasks}
        </p>
        <p className="text-sm font-body text-white/80 mt-1">{t('activeTasks')}</p>
      </GradientCard>
      <GradientCard gradient="nature" className="p-6">
        <p className="text-[36px] font-display font-semibold text-white leading-tight">
          ${earningsThisMonth}
        </p>
        <p className="text-sm font-body text-white/80 mt-1">{t('earningsThisMonth')}</p>
      </GradientCard>
      <KPIStatCard label={t('skillsGrowing')} value={skillsGrowing} />
    </div>
  )
}
