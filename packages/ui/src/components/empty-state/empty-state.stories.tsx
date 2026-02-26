import type { Meta, StoryObj } from '@storybook/nextjs'
import { Inbox, Search } from 'lucide-react'
import { EmptyState } from './empty-state'

const meta: Meta<typeof EmptyState> = {
  title: 'Design System/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof EmptyState>

export const WithIconAndAction: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <EmptyState
        icon={<Inbox className="h-12 w-12" />}
        title="No tasks yet"
        description="When a project is decomposed by APG, your assigned tasks will appear here."
        action={
          <button className="px-4 py-2 bg-brand-primary text-white rounded-button text-sm font-body font-medium">
            Browse Projects
          </button>
        }
      />
    </div>
  ),
}

export const Minimal: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <EmptyState title="No results found" />
    </div>
  ),
}

export const SearchEmpty: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <EmptyState
        icon={<Search className="h-10 w-10" />}
        title="No matching skills"
        description="Try adjusting your search terms or clearing filters."
      />
    </div>
  ),
}
