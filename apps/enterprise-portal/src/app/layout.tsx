import type { Metadata } from 'next'
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
  title: 'Enterprise Portal | GlimmoraTeam',
  description: 'GlimmoraTeam enterprise project management portal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${dmSans.variable}`}>
      <body className="font-body bg-bg-app text-text-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
