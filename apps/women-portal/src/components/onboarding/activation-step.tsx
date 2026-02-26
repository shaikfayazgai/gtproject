'use client'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button, Heading, Body } from '@glimmora/ui'
import { PrivacyBanner } from './privacy-banner'
import { CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'

export function ActivationStep() {
  const t = useTranslations('onboarding.activation')
  const router = useRouter()
  const setOnboardingComplete = useAuthStore((s) => s.setOnboardingComplete)

  async function handleGoToDashboard() {
    await fetch('/api/onboarding/complete', { method: 'POST' })
    setOnboardingComplete()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg-app px-6 py-10">
      <div className="max-w-sm mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-brand-primary" />
          </div>
          <Heading level="h2" className="text-text-heading">
            {t('title')}
          </Heading>
          <Body className="text-text-secondary">{t('message')}</Body>
        </div>
        <PrivacyBanner />
        <div className="space-y-3">
          <Body size="sm" className="text-text-secondary font-medium">
            {t('nextSteps')}
          </Body>
          {(['step1', 'step2', 'step3'] as const).map((step, i) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <Body size="sm" className="text-text-body">
                {t(step)}
              </Body>
            </div>
          ))}
        </div>
        <Button size="lg" className="w-full" onClick={handleGoToDashboard}>
          {t('goToDashboard')}
        </Button>
      </div>
    </div>
  )
}
