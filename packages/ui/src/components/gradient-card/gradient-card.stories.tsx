import type { Meta, StoryObj } from '@storybook/nextjs'
import { GradientCard } from './gradient-card'

const meta: Meta<typeof GradientCard> = {
  title: 'Design System/GradientCard',
  component: GradientCard,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof GradientCard>

export const PrimaryGradient: Story = {
  render: () => (
    <div className="max-w-xs bg-bg-app p-6">
      <GradientCard gradient="primary">
        <p className="text-[48px] font-display font-semibold leading-tight">847</p>
        <p className="text-sm font-body opacity-90 mt-1">Total Deliverables</p>
      </GradientCard>
    </div>
  ),
}

export const NatureGradient: Story = {
  render: () => (
    <div className="max-w-xs bg-bg-app p-6">
      <GradientCard gradient="nature">
        <p className="text-[48px] font-display font-semibold leading-tight">92%</p>
        <p className="text-sm font-body opacity-90 mt-1">Success Rate</p>
      </GradientCard>
    </div>
  ),
}

export const SideBySide: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        <GradientCard gradient="primary">
          <p className="text-4xl font-display font-semibold leading-tight">24</p>
          <p className="text-sm font-body opacity-90 mt-1">Active Tasks</p>
        </GradientCard>
        <GradientCard gradient="nature">
          <p className="text-4xl font-display font-semibold leading-tight">156</p>
          <p className="text-sm font-body opacity-90 mt-1">Skills Earned</p>
        </GradientCard>
      </div>
    </div>
  ),
}
