'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Locale = 'en' | 'ur' | 'ar'

interface LanguageStore {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => {
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
        set({ locale })
      },
    }),
    { name: 'glimmora-language' }
  )
)
