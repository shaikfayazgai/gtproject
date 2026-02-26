'use client'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { useAppShell } from '../app-shell/app-shell'
import { PanelLeft } from 'lucide-react'

interface TopBarProps {
  breadcrumb?: ReactNode
  search?: ReactNode
  actions?: ReactNode
  primaryAction?: ReactNode
  className?: string
}

export function TopBar({ breadcrumb, search, actions, primaryAction, className }: TopBarProps) {
  const { sidebarCollapsed, toggleSidebar } = useAppShell()

  return (
    <header className={cn('h-16 border-b border-border bg-bg-card flex items-center justify-between px-6', className)}>
      <div className="flex items-center gap-3">
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="text-text-caption hover:text-text-body transition-colors mr-2"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        )}
        {breadcrumb && <div className="text-sm font-body text-text-caption">{breadcrumb}</div>}
      </div>
      <div className="flex items-center gap-3">
        {search}
        {actions}
        {primaryAction}
      </div>
    </header>
  )
}
