'use client'
import { useState, createContext, useContext, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface AppShellContextValue {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

const AppShellContext = createContext<AppShellContextValue>({
  sidebarCollapsed: false,
  toggleSidebar: () => {},
})

export const useAppShell = () => useContext(AppShellContext)

interface AppShellProps {
  children: ReactNode
  className?: string
  defaultCollapsed?: boolean
}

export function AppShell({ children, className, defaultCollapsed = false }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultCollapsed)
  return (
    <AppShellContext.Provider value={{ sidebarCollapsed, toggleSidebar: () => setSidebarCollapsed(p => !p) }}>
      <div className={cn('flex h-screen bg-bg-app', className)}>
        {children}
      </div>
    </AppShellContext.Provider>
  )
}
