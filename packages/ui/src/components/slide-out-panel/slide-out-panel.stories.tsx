import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { SlideOutPanel } from './slide-out-panel'

const meta: Meta<typeof SlideOutPanel> = {
  title: 'Design System/SlideOutPanel',
  component: SlideOutPanel,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof SlideOutPanel>

function SlideOutPanelDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="p-6 bg-bg-app min-h-screen">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-brand-primary text-white rounded-button text-sm font-body"
      >
        Open Panel
      </button>
      <SlideOutPanel open={open} onClose={() => setOpen(false)} title="Task Details">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-body font-medium text-text-heading block mb-1">Task Name</label>
            <input
              type="text"
              className="w-full border border-border rounded-inner px-3 py-2 text-sm font-body text-text-body"
              placeholder="Enter task name..."
            />
          </div>
          <div>
            <label className="text-sm font-body font-medium text-text-heading block mb-1">Description</label>
            <textarea
              className="w-full border border-border rounded-inner px-3 py-2 text-sm font-body text-text-body h-24"
              placeholder="Describe the task..."
            />
          </div>
          <div>
            <label className="text-sm font-body font-medium text-text-heading block mb-1">Priority</label>
            <select className="w-full border border-border rounded-inner px-3 py-2 text-sm font-body text-text-body">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
        </div>
      </SlideOutPanel>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <SlideOutPanelDemo />,
}
