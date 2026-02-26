import type { Meta, StoryObj } from '@storybook/nextjs'
import { LayoutDashboard, ListChecks, FileText, Sparkles, Settings, Bell } from 'lucide-react'
import { AppShell } from './app-shell'
import { Sidebar } from '../sidebar/sidebar'
import { TopBar } from '../top-bar/top-bar'

const meta: Meta<typeof AppShell> = {
  title: 'Design System/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof AppShell>

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, href: '#', active: true },
  { label: 'Tasks', icon: <ListChecks className="h-5 w-5" />, href: '#' },
  { label: 'Evidence', icon: <FileText className="h-5 w-5" />, href: '#' },
  { label: 'Skills', icon: <Sparkles className="h-5 w-5" />, href: '#' },
  { label: 'Settings', icon: <Settings className="h-5 w-5" />, href: '#' },
]

export const FullLayout: Story = {
  render: () => (
    <AppShell>
      <Sidebar
        logo={<span className="text-lg font-display font-semibold text-text-heading">Glimmora</span>}
        navItems={navItems}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          breadcrumb={
            <span>
              <span className="text-text-caption">Home</span>
              <span className="mx-2 text-text-disabled">&gt;</span>
              <span className="text-text-body font-medium">Dashboard</span>
            </span>
          }
          actions={
            <>
              <button className="text-text-caption hover:text-text-body transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-body font-medium">FA</div>
            </>
          }
          primaryAction={
            <button className="px-4 py-2 bg-brand-primary text-white rounded-button text-sm font-body font-medium">
              Submit Evidence
            </button>
          }
        />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-display font-semibold text-text-heading mb-4">Dashboard</h1>
          <div className="grid grid-cols-3 gap-4">
            {['Active Tasks', 'Completed', 'Pending Review'].map((title) => (
              <div key={title} className="bg-bg-card rounded-card shadow-card p-5">
                <p className="text-sm font-body text-text-caption">{title}</p>
                <p className="text-3xl font-display font-semibold text-text-heading mt-1">12</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AppShell>
  ),
}

export const CollapsedSidebar: Story = {
  render: () => (
    <AppShell defaultCollapsed>
      <Sidebar
        logo={<span className="text-lg font-display font-semibold text-text-heading">G</span>}
        navItems={navItems}
        bottomContent={
          <div className="h-8 w-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-body font-medium">FA</div>
        }
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          breadcrumb={<span className="text-text-body font-medium">Dashboard</span>}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <p className="text-text-body font-body">Main content with collapsed sidebar. Click the toggle in sidebar or top bar to expand.</p>
        </main>
      </div>
    </AppShell>
  ),
}
