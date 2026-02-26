'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button, Heading, RadioGroup, RadioItem } from '@glimmora/ui'
import { PrivacyBanner } from './privacy-banner'
import type { DeviceType, InternetStability } from '@glimmora/types'

export function DevicesStep() {
  const t = useTranslations('onboarding')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [deviceType, setDeviceType] = useState<DeviceType>('smartphone')
  const [internetStability, setInternetStability] = useState<InternetStability>('stable')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    await fetch('/api/onboarding/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceType, internetStability }),
    })
    setIsLoading(false)
    router.push('/onboarding/skills')
  }

  const deviceOptions: DeviceType[] = ['smartphone', 'laptop', 'desktop', 'tablet']
  const internetOptions: InternetStability[] = ['stable', 'intermittent', 'limited']

  return (
    <div className="min-h-screen bg-bg-app px-6 py-10">
      <div className="max-w-sm mx-auto space-y-6">
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide font-body">
            {t('stepOf', { current: 2, total: 4 })}
          </p>
          <Heading level="h2" className="text-text-heading mt-1">
            {t('devices.title')}
          </Heading>
        </div>
        <PrivacyBanner />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-text-heading font-body">
              {t('devices.deviceTypeLabel')}
            </p>
            <RadioGroup
              value={deviceType}
              onValueChange={(v) => setDeviceType(v as DeviceType)}
            >
              {deviceOptions.map((type) => (
                <RadioItem
                  key={type}
                  value={type}
                  id={`device-${type}`}
                  label={t(`devices.${type}`)}
                />
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-text-heading font-body">
              {t('devices.internetLabel')}
            </p>
            <RadioGroup
              value={internetStability}
              onValueChange={(v) => setInternetStability(v as InternetStability)}
            >
              {internetOptions.map((stability) => (
                <RadioItem
                  key={stability}
                  value={stability}
                  id={`internet-${stability}`}
                  label={t(`devices.${stability}`)}
                />
              ))}
            </RadioGroup>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Saving...' : tCommon('continue')}
          </Button>
        </form>
      </div>
    </div>
  )
}
