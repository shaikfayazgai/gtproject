'use client'
import { Sidebar } from '@glimmora/ui'
import type { SidebarNavItem } from '@glimmora/ui'
import { usePathname } from 'next/navigation'
import {
  Inbox,
  ShieldCheck,
  User,
  MessageSquare,
  Settings,
} from 'lucide-react'

export function MentorSidebar() {
  const pathname = usePathname()

  const navItems: SidebarNavItem[] = [
    { label: 'Queue', href: '/queue', icon: <Inbox className="h-5 w-5" />, active: pathname.startsWith('/queue') },
    { label: 'Skill Verification', href: '/skill-verification', icon: <ShieldCheck className="h-5 w-5" />, active: pathname.startsWith('/skill-verification') },
    { label: 'Profile', href: '/profile', icon: <User className="h-5 w-5" />, active: pathname === '/profile' },
    { label: 'Messages', href: '/messages', icon: <MessageSquare className="h-5 w-5" />, active: pathname.startsWith('/messages') },
    { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" />, active: pathname.startsWith('/settings') },
  ]

  return (
    <Sidebar
      navItems={navItems}
      logo={
        <span className="text-sm font-display font-semibold text-text-heading">
          GlimmoraTeam
        </span>
      }
      bottomContent={
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
            <User className="h-4 w-4 text-brand-primary" />
          </div>
          <span className="text-sm font-body text-text-body truncate">
            Alex Rivera
          </span>
        </div>
      }
    />
  )
}
