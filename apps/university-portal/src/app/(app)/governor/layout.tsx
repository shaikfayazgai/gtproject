'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@glimmora/ui'

const GOVERNOR_NAV = [
  { href: '/governor', label: 'Institution Metrics' },
  { href: '/governor/cohorts', label: 'Cohort Trends' },
  { href: '/governor/categories', label: 'Task Categories' },
]

export default function GovernorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text-heading">Strategic Governor</h1>
        <p className="text-sm font-body text-text-caption mt-1">
          Aggregated institutional overview. All data is anonymized -- individual student information is never shown.
        </p>
      </div>

      <nav className="flex gap-1 border-b border-border">
        {GOVERNOR_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-4 py-2 text-sm font-body font-medium transition-colors border-b-2 -mb-px',
              pathname === item.href
                ? 'text-brand-primary border-brand-primary'
                : 'text-text-caption border-transparent hover:text-text-body hover:border-border'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  )
}
