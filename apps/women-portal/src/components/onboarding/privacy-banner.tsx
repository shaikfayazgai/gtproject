'use client'
import { useTranslations } from 'next-intl'
import { Shield } from 'lucide-react'
import { Body } from '@glimmora/ui'

export function PrivacyBanner() {
  const t = useTranslations('onboarding.privacyBanner')
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
      <Shield className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-brand-primary font-semibold text-sm font-body">{t('title')}</p>
        <Body size="sm" className="text-text-secondary mt-0.5">
          {t('body')}
        </Body>
      </div>
    </div>
  )
}
