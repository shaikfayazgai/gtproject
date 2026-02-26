'use client'
import { useRouter } from 'next/navigation'
import { useLanguageStore } from '@/store/language-store'
import { Heading, Body } from '@glimmora/ui'

const LANGUAGES = [
  { code: 'en' as const, label: 'English', nativeLabel: 'English', dir: 'ltr' as const },
  { code: 'ur' as const, label: 'Urdu', nativeLabel: 'اردو', dir: 'rtl' as const },
  { code: 'ar' as const, label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl' as const },
]

export function LanguageSelector() {
  const router = useRouter()
  const setLocale = useLanguageStore((s) => s.setLocale)

  function handleSelect(code: 'en' | 'ur' | 'ar') {
    setLocale(code)
    router.refresh()
    router.push('/welcome')
  }

  return (
    <div className="min-h-screen bg-bg-app flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <Heading level="h1" className="text-text-heading">
            GlimmoraTeam
          </Heading>
          <Body className="text-text-secondary">
            Choose your language / اپنی زبان منتخب کریں / اختر لغتك
          </Body>
        </div>
        <div className="space-y-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-border bg-bg-card hover:bg-hover hover:border-brand-primary transition-colors group"
              dir={lang.dir}
            >
              <span className="text-lg font-medium text-text-body group-hover:text-brand-primary transition-colors">
                {lang.nativeLabel}
              </span>
              <span className="text-sm text-text-secondary">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
