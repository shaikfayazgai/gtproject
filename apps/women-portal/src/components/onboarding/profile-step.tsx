'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { TextInput, Textarea, Button, Heading } from '@glimmora/ui'
import { PrivacyBanner } from './privacy-banner'

export function ProfileStep() {
  const t = useTranslations('onboarding')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    await fetch('/api/onboarding/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName, name, bio }),
    })
    setIsLoading(false)
    router.push('/onboarding/devices')
  }

  return (
    <div className="min-h-screen bg-bg-app px-6 py-10">
      <div className="max-w-sm mx-auto space-y-6">
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide font-body">
            {t('stepOf', { current: 1, total: 4 })}
          </p>
          <Heading level="h2" className="text-text-heading mt-1">
            {t('profile.title')}
          </Heading>
        </div>
        <PrivacyBanner />
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput
            label={t('profile.displayNameLabel')}
            placeholder={t('profile.displayNamePlaceholder')}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <TextInput
            label={t('profile.nameLabel')}
            placeholder={t('profile.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            label={t('profile.bioLabel')}
            placeholder={t('profile.bioPlaceholder')}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
          <Button type="submit" size="lg" className="w-full" disabled={isLoading || !displayName}>
            {isLoading ? 'Saving...' : tCommon('continue')}
          </Button>
        </form>
      </div>
    </div>
  )
}
