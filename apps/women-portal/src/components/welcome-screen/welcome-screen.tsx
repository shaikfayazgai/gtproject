'use client'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button, Body } from '@glimmora/ui'

const CHAT_MESSAGES = ['message1', 'message2', 'message3'] as const

export function WelcomeScreen() {
  const t = useTranslations('welcome')
  const router = useRouter()

  return (
    <div className="min-h-screen bg-bg-app flex flex-col">
      {/* Chat-style header */}
      <div className="bg-brand-primary px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-gold/30 flex items-center justify-center">
          <span className="text-white text-sm font-bold">G</span>
        </div>
        <div>
          <div className="text-white font-semibold text-sm">GlimmoraTeam</div>
          <div className="text-white/70 text-xs">Secure messaging</div>
        </div>
      </div>

      {/* Chat bubbles */}
      <div className="flex-1 px-6 py-8 space-y-4 max-w-sm mx-auto w-full">
        <div className="text-center">
          <span className="text-xs text-text-secondary bg-bg-card px-3 py-1 rounded-full">
            Today
          </span>
        </div>

        {CHAT_MESSAGES.map((key, i) => (
          <div key={key} className="flex items-end gap-2">
            {i === 0 && (
              <div className="w-7 h-7 rounded-full bg-brand-primary/20 flex-shrink-0 flex items-center justify-center">
                <span className="text-brand-primary text-xs font-bold">G</span>
              </div>
            )}
            {i > 0 && <div className="w-7 flex-shrink-0" />}
            <div className="bg-bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs shadow-sm">
              <Body className="text-text-body">{t(key)}</Body>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 pb-10 max-w-sm mx-auto w-full">
        <Button size="lg" className="w-full" onClick={() => router.push('/register')}>
          {t('cta')}
        </Button>
      </div>
    </div>
  )
}
