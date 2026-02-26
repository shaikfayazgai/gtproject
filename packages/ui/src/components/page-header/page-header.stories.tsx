import type { Meta, StoryObj } from '@storybook/nextjs'
import { PageHeader } from './page-header'

const meta: Meta<typeof PageHeader> = {
  title: 'Design System/PageHeader',
  component: PageHeader,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof PageHeader>

export const TitleOnly: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <PageHeader title="Dashboard" />
    </div>
  ),
}

export const WithSubtitle: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <PageHeader
        title="My Tasks"
        subtitle="3 tasks in progress, 2 awaiting review"
      />
    </div>
  ),
}

export const WithBreadcrumb: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <PageHeader
        title="Evidence Submission"
        breadcrumb={
          <span>
            <span className="text-text-caption">Tasks</span>
            <span className="mx-2 text-text-disabled">/</span>
            <span className="text-text-body">API Integration</span>
            <span className="mx-2 text-text-disabled">/</span>
            <span className="text-text-body">Evidence</span>
          </span>
        }
      />
    </div>
  ),
}

export const WithActions: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <PageHeader
        title="Project Overview"
        subtitle="Enterprise SOW #2024-0847"
        actions={
          <button className="px-4 py-2 bg-brand-primary text-white rounded-button text-sm font-body font-medium">
            Submit Evidence
          </button>
        }
      />
    </div>
  ),
}

export const FullExample: Story = {
  render: () => (
    <div className="bg-bg-app p-6">
      <PageHeader
        title="Skill Genome"
        subtitle="Track your verified competencies"
        breadcrumb={
          <span>
            <span className="text-text-caption">Profile</span>
            <span className="mx-2 text-text-disabled">/</span>
            <span className="text-text-body">Skills</span>
          </span>
        }
        actions={
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-border text-text-body rounded-button text-sm font-body">
              Export
            </button>
            <button className="px-4 py-2 bg-brand-primary text-white rounded-button text-sm font-body font-medium">
              Add Skill
            </button>
          </div>
        }
      />
    </div>
  ),
}
