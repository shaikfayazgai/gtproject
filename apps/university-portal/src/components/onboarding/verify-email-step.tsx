'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button, TextInput, Heading, Body } from '@glimmora/ui'

export function VerifyEmailStep() {
  const t = useTranslations('onboarding')
  const router = useRouter()
  const [studentId, setStudentId] = useState('')
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSendCode() {
    await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send' }),
    })
    setSent(true)
  }

  async function handleVerify() {
    setIsVerifying(true)
    try {
      await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', code }),
      })
      router.push('/onboarding/skills')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-app px-6 py-10">
      <div className="max-w-sm mx-auto space-y-6">
        <div>
          <p className="text-text-caption text-xs uppercase tracking-wide font-body">
            {t('stepOf', { current: 2, total: 4 })}
          </p>
          <Heading level="h2" className="text-text-heading mt-1">
            {t('verify.title')}
          </Heading>
          <Body size="sm" className="text-text-caption mt-2">
            {t('verify.description')}
          </Body>
        </div>

        <div className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <label htmlFor="studentId" className="text-sm font-medium text-text-body">
              {t('verify.studentIdLabel', { fallback: 'Student ID' })}
            </label>
            <TextInput
              id="studentId"
              placeholder={t('verify.studentIdPlaceholder', { fallback: 'e.g. STU-2024-0042' })}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>
          {!sent ? (
            <Button variant="primary" className="w-full" onClick={handleSendCode} disabled={!studentId}>
              {t('verify.sendCode')}
            </Button>
          ) : (
            <>
              <TextInput
                label={t('verify.codeLabel')}
                placeholder={t('verify.codePlaceholder')}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center text-lg tracking-widest"
              />
              <Button
                variant="primary"
                className="w-full"
                onClick={handleVerify}
                disabled={isVerifying || code.length < 6}
              >
                {isVerifying ? 'Verifying...' : t('verify.verifyButton')}
              </Button>
              <button
                onClick={handleSendCode}
                className="text-sm text-brand-primary hover:underline font-body"
              >
                {t('verify.resend')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
