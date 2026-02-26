'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button, TextInput, PasswordInput, Heading, Body } from '@glimmora/ui'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'

const ACADEMIC_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Post-Graduate']

export function StudentRegistrationForm() {
  const t = useTranslations('register')
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [studentId, setStudentId] = useState('')
  const [universityName, setUniversityName] = useState('')
  const [degreeProgram, setDegreeProgram] = useState('')
  const [academicYear, setAcademicYear] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          studentId,
          universityName,
          degreeProgram,
          academicYear,
        }),
      })
      const data = await res.json()
      setUser(data.user)
      router.push('/onboarding/profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg-app px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-1 bg-brand-primary rounded-full mx-auto mb-4" />
          <Heading level="h1">{t('heading')}</Heading>
          <Body className="text-text-caption">
            Join GlimmoraTeam and start building verified credentials through real project work.
          </Body>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-card rounded-card shadow-card p-6 space-y-4">
          <TextInput
            label={t('emailLabel')}
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <TextInput
            label="Student ID"
            placeholder="e.g. STU-2024-1234"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
          <TextInput
            label="University Name"
            placeholder="e.g. Bangalore University"
            value={universityName}
            onChange={(e) => setUniversityName(e.target.value)}
            required
          />
          <TextInput
            label="Degree Program"
            placeholder="e.g. B.Tech Computer Science"
            value={degreeProgram}
            onChange={(e) => setDegreeProgram(e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-body font-medium text-text-body mb-1.5">
              Academic Year
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full rounded-inner border border-border bg-bg-card px-3 py-2 text-sm font-body text-text-body focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              required
            >
              <option value="">Select your year</option>
              {ACADEMIC_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <PasswordInput
            label={t('passwordLabel')}
            placeholder={t('passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <p className="text-xs font-body text-text-caption">
            Your information is kept private. No public profiles. No peer comparison.
          </p>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email || !password || password !== confirmPassword}
          >
            {isLoading ? 'Creating Account...' : t('submitButton')}
          </Button>
        </form>

        <p className="text-center text-sm font-body text-text-caption">
          {t('alreadyHaveAccount')}{' '}
          <Link href="/" className="text-brand-primary hover:underline font-medium">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </main>
  )
}
