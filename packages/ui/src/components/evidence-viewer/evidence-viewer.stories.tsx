import type { Meta, StoryObj } from '@storybook/nextjs'
import { EvidenceViewer } from './evidence-viewer'
import type { Evidence } from './evidence-viewer'

const meta: Meta<typeof EvidenceViewer> = {
  title: 'Governance/EvidenceViewer',
  component: EvidenceViewer,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof EvidenceViewer>

const allEvidence: Evidence[] = [
  {
    type: 'code',
    language: 'typescript',
    filename: 'auth-middleware.ts',
    code: `import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('session')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
}`,
  },
  {
    type: 'document',
    filename: 'architecture-diagram.pdf',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    downloadUrl: '#',
  },
  {
    type: 'link',
    url: 'https://github.com/example/repo/pull/42',
    title: 'Pull Request #42: Auth middleware implementation',
    description: 'Implements JWT-based authentication middleware with session cookie support.',
  },
  {
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Feature walkthrough recording',
  },
  {
    type: 'text',
    content: `Implementation Notes:

The auth middleware validates JWT tokens stored in session cookies. Key design decisions:

1. Token verification uses the jose library for edge-runtime compatibility
2. Failed verification redirects to /login rather than returning 401
3. Session refresh is handled by a separate endpoint to avoid middleware complexity

Testing was performed against the staging environment with both valid and expired tokens.`,
  },
]

export const AllEvidenceTypes: Story = {
  args: { evidence: allEvidence },
}

export const CodeOnly: Story = {
  args: {
    evidence: [
      {
        type: 'code',
        language: 'typescript',
        filename: 'user-service.ts',
        code: `export class UserService {
  async findById(id: string) {
    return this.db.user.findUnique({ where: { id } })
  }

  async updateProfile(id: string, data: UpdateProfileDto) {
    return this.db.user.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    })
  }
}`,
      },
      {
        type: 'code',
        language: 'sql',
        filename: 'migration-001.sql',
        code: `CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`,
      },
    ],
  },
}

export const BlindReview: Story = {
  name: 'Blind Review (No Identity)',
  args: {
    evidence: [
      {
        type: 'code',
        language: 'typescript',
        code: `// Notice: no contributor name, avatar, or identifier is shown anywhere.
// Evidence is reviewed purely on merit -- blind review enforced at component level.
export function processDelivery(data: DeliveryPayload) {
  return validate(data).then(transform).then(persist)
}`,
      },
      {
        type: 'text',
        content:
          'This component enforces blind review by design. The Evidence type has no contributor field. No name, avatar, or identifying information is accepted or rendered.',
      },
    ],
  },
}
