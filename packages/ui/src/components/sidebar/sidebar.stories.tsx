import type { Meta, StoryObj } from '@storybook/nextjs'
import { LayoutDashboard, ListChecks, FileText, Sparkles, Settings } from 'lucide-react'
import { Sidebar } from './sidebar'
import { AppShell } from '../app-shell/app-shell'

const meta: Meta<typeof Sidebar> = {
  title: 'Design System/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof Sidebar>

const sampleNavItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, href: '#', active: true },
  { label: 'Tasks', icon: <ListChecks className="h-5 w-5" />, href: '#' },
  { label: 'Evidence', icon: <FileText className="h-5 w-5" />, href: '#' },
  { label: 'Skills', icon: <Sparkles className="h-5 w-5" />, href: '#' },
  { label: 'Settings', icon: <Settings className="h-5 w-5" />, href: '#' },
]

export const Expanded: Story = {
  render: () => (
    <AppShell>
      <Sidebar
        logo={<span className="text-lg font-display font-semibold text-text-heading">Glimmora</span>}
        navItems={sampleNavItems}
        bottomContent={
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-body font-medium">FA</div>
            <div className="min-w-0">
              <p className="text-sm font-body font-medium text-text-heading truncate">Fatima Al-Hassan</p>
              <p className="text-xs font-body text-text-caption truncate">Contributor</p>
            </div>
          </div>
        }
      />
      <div className="flex-1 bg-bg-app p-6">
        <p className="text-text-body font-body">Main content area</p>
      </div>
    </AppShell>
  ),
}

export const Collapsed: Story = {
  render: () => (
    <AppShell defaultCollapsed>
      <Sidebar
        logo={<span className="text-lg font-display font-semibold text-text-heading">Glimmora</span>}
        navItems={sampleNavItems}
        bottomContent={
          <div className="h-8 w-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-body font-medium">FA</div>
        }
      />
      <div className="flex-1 bg-bg-app p-6">
        <p className="text-text-body font-body">Main content area (sidebar collapsed)</p>
      </div>
    </AppShell>
  ),
}
