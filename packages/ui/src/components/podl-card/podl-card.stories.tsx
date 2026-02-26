import type { Meta, StoryObj } from '@storybook/nextjs'
import { PoDLCard } from './podl-card'

const meta: Meta<typeof PoDLCard> = {
  title: 'Governance/PoDLCard',
  component: PoDLCard,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof PoDLCard>

export const Verified: Story = {
  args: {
    title: 'Authentication Middleware Implementation',
    projectName: 'FinServ API Gateway',
    completedDate: 'Feb 15, 2026',
    skills: ['TypeScript', 'Node.js', 'Security'],
    verificationHash: '0x7a3f8c2d1e9b4a6f3c8d2e1b5a7f9c3d...b2c1',
    chainVerified: true,
    onShare: () => {},
    onExport: () => {},
  },
}

export const Unverified: Story = {
  args: {
    title: 'Data Pipeline Optimization',
    projectName: 'Analytics Dashboard v2',
    completedDate: 'Feb 22, 2026',
    skills: ['Python', 'PostgreSQL'],
    verificationHash: '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e...pending',
    chainVerified: false,
    onShare: () => {},
    onExport: () => {},
  },
}

export const CredentialGrid: Story = {
  name: 'Credential Grid',
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-bg-app p-6">
      <PoDLCard
        title="Auth Middleware"
        projectName="FinServ API Gateway"
        completedDate="Feb 15, 2026"
        skills={['TypeScript', 'Node.js', 'Security']}
        verificationHash="0x7a3f...b2c1"
        chainVerified={true}
        onShare={() => {}}
        onExport={() => {}}
      />
      <PoDLCard
        title="Data Pipeline"
        projectName="Analytics Dashboard v2"
        completedDate="Feb 10, 2026"
        skills={['Python', 'PostgreSQL']}
        verificationHash="0x2c4d...a3f2"
        chainVerified={true}
        onShare={() => {}}
        onExport={() => {}}
      />
      <PoDLCard
        title="UI Component Library"
        projectName="Design System 3.0"
        completedDate="Feb 22, 2026"
        skills={['React', 'TypeScript', 'CSS', 'Accessibility']}
        verificationHash="0x9f1e...pending"
        chainVerified={false}
        onShare={() => {}}
        onExport={() => {}}
      />
    </div>
  ),
}
