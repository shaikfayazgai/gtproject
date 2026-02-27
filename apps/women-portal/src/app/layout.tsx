import type { Metadata } from 'next'
import { getLocale, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'
import './globals.css'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-miller-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-avenir',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Women's Portal | GlimmoraTeam",
  description: 'GlimmoraTeam contributor portal for women',
}

const RTL_LOCALES = ['ur', 'ar']

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()
  const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} className={`${playfairDisplay.variable} ${dmSans.variable}`}>
      <body className="font-body bg-bg-app text-text-body">
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
