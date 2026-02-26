import type { ReviewDetail } from '@glimmora/types'
import { isoFuture } from './common'

export function createMockReviewDetail(id: string): ReviewDetail {
  return {
    id,
    taskId: 'task-101',
    taskTitle: 'Implement User Authentication Module',
    taskBrief:
      'Build a complete authentication module including login, registration, password reset, and session management. The module should use JWT tokens with refresh rotation and support both email/password and social login providers.',
    deliverables: [
      'Login and registration forms with validation',
      'JWT token management with refresh rotation',
      'Password reset flow with email verification',
      'Session persistence across page refreshes',
      'Unit tests for auth utility functions',
    ],
    skillTagsRequired: ['React', 'TypeScript', 'Authentication', 'JWT', 'Testing'],
    evidences: [
      {
        id: 'ev-001',
        type: 'code',
        content:
          'import { SignJWT, jwtVerify } from "jose";\n\nexport async function createToken(payload: Record<string, unknown>) {\n  const secret = new TextEncoder().encode(process.env.JWT_SECRET);\n  return await new SignJWT(payload)\n    .setProtectedHeader({ alg: "HS256" })\n    .setExpirationTime("15m")\n    .sign(secret);\n}\n\nexport async function verifyToken(token: string) {\n  const secret = new TextEncoder().encode(process.env.JWT_SECRET);\n  const { payload } = await jwtVerify(token, secret);\n  return payload;\n}',
        submittedAt: '2026-02-25T10:00:00Z',
        language: 'typescript',
        filename: 'auth-utils.ts',
      },
      {
        id: 'ev-002',
        type: 'code',
        content:
          'import { describe, it, expect } from "vitest";\nimport { createToken, verifyToken } from "./auth-utils";\n\ndescribe("createToken", () => {\n  it("creates a valid JWT", async () => {\n    const token = await createToken({ sub: "user-1" });\n    expect(token).toBeDefined();\n    expect(typeof token).toBe("string");\n  });\n\n  it("created token can be verified", async () => {\n    const token = await createToken({ sub: "user-1", role: "contributor" });\n    const payload = await verifyToken(token);\n    expect(payload.sub).toBe("user-1");\n  });\n});',
        submittedAt: '2026-02-25T10:05:00Z',
        language: 'typescript',
        filename: 'auth-utils.test.ts',
      },
      {
        id: 'ev-003',
        type: 'document',
        content: '',
        submittedAt: '2026-02-25T10:10:00Z',
        filename: 'auth-architecture.pdf',
        fileSize: '245 KB',
        fileType: 'application/pdf',
        downloadUrl: '#',
      },
      {
        id: 'ev-004',
        type: 'text',
        content:
          'The authentication module implements JWT-based auth with 15-minute access tokens and 7-day refresh tokens with rotation. Password reset uses time-limited tokens sent via email. All sensitive routes are protected by middleware that validates the JWT on every request.',
        submittedAt: '2026-02-25T10:15:00Z',
      },
      {
        id: 'ev-005',
        type: 'link',
        content: '',
        submittedAt: '2026-02-25T10:20:00Z',
        url: 'https://github.com/example/auth-demo',
        title: 'GitHub Repository - Auth Module',
        description: 'Complete source code with CI/CD pipeline and test coverage report',
      },
    ],
    submittedAt: '2026-02-25T10:00:00Z',
    slaDeadline: isoFuture(18),
    submissionCount: 1,
  }
}
