import type { Meta, StoryObj } from '@storybook/nextjs'
import { KPIStatCard } from './kpi-stat-card'
import { GradientCard } from '../gradient-card/gradient-card'

const meta: Meta<typeof KPIStatCard> = {
  title: 'Design System/KPIStatCard',
  component: KPIStatCard,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof KPIStatCard>

export const TrendUp: Story = {
  render: () => (
    <div className="max-w-xs bg-bg-app p-6">
      <KPIStatCard
        label="Tasks Completed"
        value={847}
        trend={{ direction: 'up', value: '+12.5%' }}
      />
    </div>
  ),
}

export const TrendDown: Story = {
  render: () => (
    <div className="max-w-xs bg-bg-app p-6">
      <KPIStatCard
        label="Open Issues"
        value={23}
        trend={{ direction: 'down', value: '-3.2%' }}
      />
    </div>
  ),
}

export const WithSparkline: Story = {
  render: () => (
    <div className="max-w-xs bg-bg-app p-6">
      <KPIStatCard
        label="Deliverables This Week"
        value={56}
        trend={{ direction: 'up', value: '+8%' }}
        sparklineData={[12, 18, 14, 22, 28, 25, 32, 36, 34, 42]}
      />
    </div>
  ),
}

export const DashboardRow: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <div className="grid grid-cols-4 gap-4">
        <KPIStatCard
          label="Active Tasks"
          value={24}
          trend={{ direction: 'up', value: '+4' }}
        />
        <KPIStatCard
          label="Completion Rate"
          value="92%"
          trend={{ direction: 'up', value: '+2.1%' }}
          sparklineData={[82, 85, 84, 88, 90, 89, 91, 92]}
        />
        <KPIStatCard
          label="Avg Delivery Time"
          value="3.2d"
          trend={{ direction: 'down', value: '-0.5d' }}
        />
        <KPIStatCard
          label="Skills Verified"
          value={156}
          trend={{ direction: 'neutral', value: '0%' }}
        />
      </div>
    </div>
  ),
}

export const OnGradient: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        <GradientCard gradient="primary">
          <p className="text-[48px] font-display font-semibold leading-tight">847</p>
          <p className="text-sm font-body opacity-90 mt-1">Total Deliverables</p>
        </GradientCard>
        <GradientCard gradient="nature">
          <p className="text-[48px] font-display font-semibold leading-tight">92%</p>
          <p className="text-sm font-body opacity-90 mt-1">Success Rate</p>
        </GradientCard>
      </div>
    </div>
  ),
}
