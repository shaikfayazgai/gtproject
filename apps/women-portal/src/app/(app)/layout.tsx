'use client'
import { AppShell, Sidebar, TopBar } from '@glimmora/ui'
import type { SidebarNavItem } from '@glimmora/ui'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  LayoutDashboard,
  ListTodo,
  FileCheck,
  Brain,
  Wallet,
  Award,
  MessageSquare,
  Settings,
} from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const t = useTranslations()

  const navItems: SidebarNavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, active: pathname === '/dashboard' },
    { label: 'Tasks', href: '/tasks', icon: <ListTodo className="h-5 w-5" />, active: pathname.startsWith('/tasks') },
    { label: 'Submissions', href: '/submissions', icon: <FileCheck className="h-5 w-5" />, active: pathname === '/submissions' },
    { label: 'Skills', href: '/skills', icon: <Brain className="h-5 w-5" />, active: pathname === '/skills' },
    { label: 'Earnings', href: '/earnings', icon: <Wallet className="h-5 w-5" />, active: pathname === '/earnings' },
    { label: 'Credentials', href: '/credentials', icon: <Award className="h-5 w-5" />, active: pathname === '/credentials' },
    { label: 'Messages', href: '/messages', icon: <MessageSquare className="h-5 w-5" />, active: pathname === '/messages' },
    { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" />, active: pathname === '/settings' },
  ]

  return (
    <AppShell>
      <Sidebar
        navItems={navItems}
        logo={
          <span className="text-sm font-display font-semibold text-text-heading">
            Women&apos;s Portal
          </span>
        }
      />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar
          breadcrumb={
            <span className="text-sm font-body text-text-caption">
              Women&apos;s Portal
            </span>
          }
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AppShell>
  )
}
