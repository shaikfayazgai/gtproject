import type { Evidence, EvidencePack, EvidenceStatus } from '@glimmora/types'
import { randomId, isoNow } from './common'

export function createMockEvidence(overrides: Partial<Evidence> = {}): Evidence {
  return {
    id: randomId('ev'),
    taskId: 'task-001',
    contributorId: 'user-001',
    type: 'file',
    title: 'Implementation Evidence',
    description: 'Code implementation with tests passing',
    content: '',
    fileName: 'component.tsx',
    fileSize: 24576,
    fileUrl: '/mock/files/component.tsx',
    status: 'submitted',
    submittedAt: isoNow(),
    ...overrides,
  }
}

export function createMockEvidencePack(
  taskId: string,
  status: EvidenceStatus = 'submitted'
): EvidencePack {
  return {
    id: randomId('ep'),
    taskId,
    projectId: 'proj-001',
    evidenceItems: [
      createMockEvidence({
        taskId,
        type: 'code',
        title: 'Source Code',
        content: 'export function Component() {\n  return <div>Hello</div>\n}',
        status,
      }),
      createMockEvidence({
        taskId,
        type: 'file',
        title: 'Screenshot',
        fileName: 'screenshot.png',
        fileSize: 150000,
        status,
      }),
      createMockEvidence({
        taskId,
        type: 'text',
        title: 'Implementation Notes',
        content:
          'Implemented following the design system guidelines. All accessibility requirements met.',
        status,
      }),
    ],
    submittedAt: isoNow(),
    status,
  }
}

export function createMockReworkEvidencePack(taskId: string): EvidencePack {
  return {
    id: randomId('ep'),
    taskId,
    projectId: 'proj-001',
    evidenceItems: [
      createMockEvidence({
        taskId,
        type: 'code',
        title: 'Export Module',
        status: 'rework-required',
        reviewerFeedback:
          'CSV headers do not match the SOW specification. Column ordering is incorrect and date formats need to follow ISO 8601.',
        reworkItems: [
          'Fix CSV column headers to match SOW spec',
          'Change date format to ISO 8601',
          'Add data validation before export',
        ],
      }),
    ],
    submittedAt: isoNow(),
    status: 'rework-required',
  }
}
