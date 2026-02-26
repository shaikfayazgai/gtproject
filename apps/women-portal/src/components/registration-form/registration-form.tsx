'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { TextInput, PasswordInput, Button, Heading, Body } from '@glimmora/ui'
import { useAuthStore } from '@/store/auth-store'

export function RegistrationForm() {
  const t = useTranslations('register')
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      setAuth(data.user.id, data.user.displayName ?? email.split('@')[0])
      router.push('/onboarding/profile')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-app flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <Heading level="h1" className="text-text-heading text-center">
          {t('heading')}
        </Heading>
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput
            label={t('emailLabel')}
            type="email"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <PasswordInput
            label={t('passwordLabel')}
            placeholder={t('passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          {error && <Body className="text-red-500 text-sm">{error}</Body>}
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : t('submitButton')}
          </Button>
        </form>
        <Body className="text-center text-text-secondary text-sm">
          {t('alreadyHaveAccount')}{' '}
          <a href="/login" className="text-brand-primary hover:underline">
            {t('signIn')}
          </a>
        </Body>
      </div>
    </div>
  )
}
