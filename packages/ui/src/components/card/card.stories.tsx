import type { Meta, StoryObj } from '@storybook/nextjs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <div className="max-w-sm bg-bg-app p-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Summary</CardTitle>
          <CardDescription>Overview of your current deliverables</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-body text-text-body">
            You have 3 tasks in progress and 2 awaiting review. Your next deadline is in 4 days.
          </p>
        </CardContent>
        <CardFooter>
          <button className="text-sm font-body text-brand-primary hover:underline">View all</button>
        </CardFooter>
      </Card>
    </div>
  ),
}

export const Bordered: Story = {
  render: () => (
    <div className="max-w-sm bg-bg-app p-6">
      <Card bordered>
        <CardHeader>
          <CardTitle>Bordered Card</CardTitle>
          <CardDescription>With warm earth border accent</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-body text-text-body">
            This variant uses the warm #EAD9CC border for added definition.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const ContentOnly: Story = {
  render: () => (
    <div className="max-w-sm bg-bg-app p-6">
      <Card>
        <CardContent>
          <p className="text-sm font-body text-text-body">
            A simple card with just content -- no header or footer.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const Grid: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <div className="grid grid-cols-3 gap-4">
        {['Evidence', 'Skills', 'Tasks'].map((title) => (
          <Card key={title} bordered>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-display font-semibold text-text-heading">12</p>
              <p className="text-sm font-body text-text-caption">items this week</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  ),
}
