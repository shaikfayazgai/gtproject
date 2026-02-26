import type { Meta, StoryObj } from '@storybook/nextjs'
import { APGFeed } from './apg-feed'

const meta: Meta<typeof APGFeed> = {
  title: 'Governance/APGFeed',
  component: APGFeed,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof APGFeed>

const sampleActions = [
  {
    id: '1',
    type: 'team_formed' as const,
    title: 'Team Formed',
    description: 'APG assembled a 4-member team based on skill genome matching.',
    timestamp: '2 hours ago',
    detail:
      'Team composition: 2 frontend developers, 1 backend developer, 1 QA reviewer. Matching confidence: 94%. All contributors passed skill verification for the required competencies.',
  },
  {
    id: '2',
    type: 'task_assigned' as const,
    title: 'Tasks Distributed',
    description: 'Decomposed milestone into 6 tasks and assigned to team members.',
    timestamp: '1 hour 45 min ago',
  },
  {
    id: '3',
    type: 'review_requested' as const,
    title: 'Review Requested',
    description: 'Evidence submitted for Task 2: API endpoint implementation.',
    timestamp: '45 min ago',
  },
  {
    id: '4',
    type: 'risk_detected' as const,
    title: 'Risk Detected',
    description: 'Task 4 approaching deadline with 60% completion. Suggested reallocation.',
    timestamp: '30 min ago',
    detail:
      'Current velocity indicates a 2-day delay risk. APG recommends reassigning the database migration subtask to an available contributor with PostgreSQL expertise.',
  },
  {
    id: '5',
    type: 'milestone_completed' as const,
    title: 'Milestone 1 Complete',
    description: 'All 6 tasks delivered and evidence accepted. Moving to Milestone 2.',
    timestamp: '15 min ago',
  },
  {
    id: '6',
    type: 'payment_triggered' as const,
    title: 'Payment Released',
    description: 'Milestone 1 payment of $2,400 released to team escrow.',
    timestamp: '10 min ago',
  },
]

export const AllActionTypes: Story = {
  args: { actions: sampleActions },
}

export const WithExpandableDetail: Story = {
  name: 'With Expandable Details',
  args: {
    actions: sampleActions.filter((a) => a.detail),
  },
}

export const LimitedFeed: Story = {
  name: 'Limited Visibility (3 items)',
  args: {
    actions: sampleActions,
    maxVisible: 3,
  },
}
