'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clock, Brain, Bell } from 'lucide-react'
import { PageHeader, cn } from '@glimmora/ui'

const settingsItems = [
  {
    href: '/settings/capacity',
    icon: Clock,
    label: 'Capacity',
    description: 'Manage your weekly review hours and availability',
  },
  {
    href: '/settings/skills',
    icon: Brain,
    label: 'Expertise & Skills',
    description: 'Update your expertise areas and skill tags',
  },
  {
    href: '/settings/notifications',
    icon: Bell,
    label: 'Notifications',
    description: 'Configure how you receive notifications',
  },
]

export default function SettingsPage() {
  const pathname = usePathname()

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Settings" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-start gap-4 p-5 bg-bg-card rounded-card shadow-card hover:shadow-card-hover transition-shadow border border-transparent',
                isActive && 'border-brand-primary'
              )}
            >
              <div className="p-2 bg-brand-primary/10 rounded-inner shrink-0">
                <Icon className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <p className="text-sm font-display font-semibold text-text-heading">{item.label}</p>
                <p className="text-xs font-body text-text-caption mt-1">{item.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
