import type { Meta, StoryObj } from '@storybook/nextjs'
import { Search, Bell } from 'lucide-react'
import { TopBar } from './top-bar'
import { AppShell } from '../app-shell/app-shell'

const meta: Meta<typeof TopBar> = {
  title: 'Design System/TopBar',
  component: TopBar,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof TopBar>

export const WithBreadcrumb: Story = {
  render: () => (
    <AppShell>
      <div className="flex-1 flex flex-col">
        <TopBar
          breadcrumb={
            <span>
              <span className="text-text-caption">Dashboard</span>
              <span className="mx-2 text-text-disabled">&gt;</span>
              <span className="text-text-body font-medium">Tasks</span>
            </span>
          }
          actions={
            <>
              <button className="text-text-caption hover:text-text-body transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-body font-medium">
                FA
              </div>
            </>
          }
          primaryAction={
            <button className="px-4 py-2 bg-brand-primary text-white rounded-button text-sm font-body font-medium">
              New Task
            </button>
          }
        />
        <main className="flex-1 bg-bg-app p-6">
          <p className="text-text-body font-body">Content area</p>
        </main>
      </div>
    </AppShell>
  ),
}

export const WithSearch: Story = {
  render: () => (
    <AppShell>
      <div className="flex-1 flex flex-col">
        <TopBar
          breadcrumb={<span className="text-text-body font-medium">Skills</span>}
          search={
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-caption" />
              <input
                type="text"
                placeholder="Search skills..."
                className="pl-8 pr-3 py-1.5 border border-border rounded-inner text-sm font-body text-text-body bg-bg-app w-48 focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          }
        />
        <main className="flex-1 bg-bg-app p-6">
          <p className="text-text-body font-body">Content area with search</p>
        </main>
      </div>
    </AppShell>
  ),
}
