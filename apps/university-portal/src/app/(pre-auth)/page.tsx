'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button, TextInput, PasswordInput, Heading, Body } from '@glimmora/ui'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'

export default function LoginPage() {
  const t = useTranslations('welcome')
  const tReg = useTranslations('register')
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      setUser(data.user)
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg-app px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-1 bg-brand-primary rounded-full mx-auto mb-4" />
          <Heading level="h1">{t('greeting')}</Heading>
          <Body className="text-text-caption">{t('message2')}</Body>
        </div>

        <form onSubmit={handleLogin} className="bg-bg-card rounded-card shadow-card p-6 space-y-5">
          <TextInput
            label={tReg('emailLabel')}
            placeholder={tReg('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <PasswordInput
            label={tReg('passwordLabel')}
            placeholder={tReg('passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm font-body text-text-caption">
          {tReg('alreadyHaveAccount').replace('Already have an account?', "Don't have an account?")}{' '}
          <Link href="/register" className="text-brand-primary hover:underline font-medium">
            {tReg('submitButton').replace('Create Account', 'Register')}
          </Link>
        </p>
      </div>
    </main>
  )
}
