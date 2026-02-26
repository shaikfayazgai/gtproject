'use client'
import { type ReactNode } from 'react'
import { PanelLeft } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAppShell } from '../app-shell/app-shell'

export interface SidebarNavItem {
  label: string
  icon: ReactNode
  href: string
  active?: boolean
}

interface SidebarProps {
  logo?: ReactNode
  navItems: SidebarNavItem[]
  bottomContent?: ReactNode
  className?: string
}

export function Sidebar({ logo, navItems, bottomContent, className }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar } = useAppShell()

  return (
    <aside
      className={cn(
        'bg-bg-sidebar border-r border-border flex flex-col h-full transition-all duration-200',
        sidebarCollapsed ? 'w-16' : 'w-60',
        className
      )}
    >
      {/* Logo + collapse toggle */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!sidebarCollapsed && logo && <div className="flex-1 min-w-0">{logo}</div>}
        <button
          onClick={toggleSidebar}
          className={cn(
            'text-text-caption hover:text-text-body transition-colors shrink-0',
            sidebarCollapsed && 'mx-auto'
          )}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            title={sidebarCollapsed ? item.label : undefined}
            className={cn(
              'flex items-center gap-3 py-2.5 text-sm font-body transition-colors mx-2 rounded-inner',
              sidebarCollapsed ? 'justify-center px-2' : 'px-4',
              item.active
                ? 'bg-hover text-brand-primary border-l-2 border-brand-primary font-medium'
                : 'text-text-body hover:bg-hover'
            )}
          >
            <span className="shrink-0">{item.icon}</span>
            {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* Bottom content (avatar + name) */}
      {bottomContent && (
        <div className="border-t border-border p-4">
          {sidebarCollapsed ? (
            <div className="flex justify-center">{bottomContent}</div>
          ) : (
            bottomContent
          )}
        </div>
      )}
    </aside>
  )
}
