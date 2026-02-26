import type { Meta, StoryObj } from '@storybook/nextjs'
import { BarChart } from './bar-chart'

const meta: Meta<typeof BarChart> = {
  title: 'Design System/Bar Chart',
  component: BarChart,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof BarChart>

const sampleData = [
  { month: 'Jan', deliveries: 12 },
  { month: 'Feb', deliveries: 19 },
  { month: 'Mar', deliveries: 15 },
  { month: 'Apr', deliveries: 22 },
  { month: 'May', deliveries: 28 },
  { month: 'Jun', deliveries: 24 },
]

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-2xl p-4 bg-bg-card rounded-card">
      <BarChart data={sampleData} dataKey="deliveries" xAxisKey="month" />
    </div>
  ),
}

export const CustomHeight: Story = {
  render: () => (
    <div className="w-full max-w-md p-4 bg-bg-card rounded-card">
      <BarChart data={sampleData} dataKey="deliveries" xAxisKey="month" height={200} />
    </div>
  ),
}
