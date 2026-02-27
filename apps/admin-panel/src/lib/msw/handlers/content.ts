import { http, HttpResponse } from 'msw'
import { createMockTaxonomy } from '../factories/skill-taxonomy'
import { randomId, isoNow, isoPast } from '../factories/common'
import type {
  PlatformAnnouncement,
  ResourceItem,
  AnnouncementAudience,
  AnnouncementStatus,
  ResourceItemType,
} from '@glimmora/types'

const mockSkills = createMockTaxonomy()

const mockAnnouncements: PlatformAnnouncement[] = [
  {
    id: 'ann-001',
    title: 'Platform Maintenance Scheduled',
    content: 'GlimmoraTeam will undergo scheduled maintenance on March 5, 2026 from 02:00-04:00 UTC. All services will be temporarily unavailable.',
    audience: 'all',
    status: 'published',
    publishedAt: isoPast(3),
    createdBy: 'Sarah Chen',
    createdAt: isoPast(5),
  },
  {
    id: 'ann-002',
    title: 'New Skill Categories Available',
    content: 'We have added 8 new skill categories including AI/ML, Cloud Architecture, and DevOps. Contributors can now tag their profiles with these skills.',
    audience: 'contributors',
    status: 'published',
    publishedAt: isoPast(7),
    createdBy: 'Raj Patel',
    createdAt: isoPast(10),
  },
  {
    id: 'ann-003',
    title: 'Updated Payment Terms',
    content: 'Starting April 1, 2026, payment release cycles will move from weekly to bi-weekly for projects under $1,000.',
    audience: 'enterprise',
    status: 'draft',
    createdBy: 'Maria Santos',
    createdAt: isoPast(1),
  },
  {
    id: 'ann-004',
    title: 'Mentor Review SLA Update',
    content: 'Review SLA has been updated from 48 hours to 36 hours for standard reviews. Safety-tagged reviews remain at 24 hours.',
    audience: 'mentors',
    status: 'published',
    publishedAt: isoPast(14),
    createdBy: 'Sarah Chen',
    createdAt: isoPast(16),
  },
  {
    id: 'ann-005',
    title: 'Deprecated API Endpoints',
    content: 'The v1 API endpoints will be deprecated on June 1, 2026. Please migrate to v2 endpoints.',
    audience: 'all',
    status: 'archived',
    publishedAt: isoPast(30),
    createdBy: 'Raj Patel',
    createdAt: isoPast(45),
  },
]

const mockResources: ResourceItem[] = [
  {
    id: 'res-001',
    title: 'Contributor Onboarding Guide',
    type: 'guide',
    fileUrl: '/docs/contributor-onboarding.pdf',
    description: 'Step-by-step guide for new contributors',
    audience: 'contributors',
    isActive: true,
    createdBy: 'Sarah Chen',
    createdAt: isoPast(60),
    updatedAt: isoPast(5),
  },
  {
    id: 'res-002',
    title: 'Platform Code of Conduct',
    type: 'policy',
    fileUrl: '/docs/code-of-conduct.pdf',
    description: 'Community guidelines and expected behavior',
    audience: 'all',
    isActive: true,
    createdBy: 'Maria Santos',
    createdAt: isoPast(90),
    updatedAt: isoPast(10),
  },
  {
    id: 'res-003',
    title: 'SOW Template - Software Development',
    type: 'template',
    fileUrl: '/docs/sow-template-software.docx',
    description: 'Standard SOW template for software projects',
    audience: 'enterprise',
    isActive: true,
    createdBy: 'Raj Patel',
    createdAt: isoPast(45),
    updatedAt: isoPast(3),
  },
  {
    id: 'res-004',
    title: 'Evidence Submission Best Practices',
    type: 'guide',
    fileUrl: '/docs/evidence-best-practices.pdf',
    description: 'How to submit high-quality deliverable evidence',
    audience: 'contributors',
    isActive: true,
    createdBy: 'Sarah Chen',
    createdAt: isoPast(30),
    updatedAt: isoPast(7),
  },
  {
    id: 'res-005',
    title: 'Dispute Resolution Policy',
    type: 'policy',
    fileUrl: '/docs/dispute-resolution.pdf',
    description: 'Official dispute resolution process and guidelines',
    audience: 'all',
    isActive: true,
    createdBy: 'Maria Santos',
    createdAt: isoPast(60),
    updatedAt: isoPast(15),
  },
  {
    id: 'res-006',
    title: 'Mentor Review Guidelines',
    type: 'training',
    fileUrl: '/docs/mentor-review-guidelines.pdf',
    description: 'Training material for mentor-reviewers',
    audience: 'mentors',
    isActive: true,
    createdBy: 'Raj Patel',
    createdAt: isoPast(20),
    updatedAt: isoPast(2),
  },
  {
    id: 'res-007',
    title: 'SOW Template - Design Projects',
    type: 'template',
    fileUrl: '/docs/sow-template-design.docx',
    description: 'Standard SOW template for design and UX projects',
    audience: 'enterprise',
    isActive: true,
    createdBy: 'Sarah Chen',
    createdAt: isoPast(40),
    updatedAt: isoPast(12),
  },
]

export const contentHandlers = [
  // ---- Skills ----

  http.get('/api/admin/content/skills', () => {
    return HttpResponse.json(mockSkills)
  }),

  http.post('/api/admin/content/skills', async ({ request }) => {
    const body = (await request.json()) as { name: string; category: string }
    const newSkill = {
      id: randomId('skill'),
      name: body.name,
      category: body.category,
      isActive: true,
      usageCount: 0,
      createdAt: isoNow(),
      updatedAt: isoNow(),
    }
    mockSkills.push(newSkill)
    return HttpResponse.json(newSkill, { status: 201 })
  }),

  http.patch('/api/admin/content/skills/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const skill = mockSkills.find((s) => s.id === params.id)
    if (!skill) return new HttpResponse(null, { status: 404 })
    Object.assign(skill, body, { updatedAt: isoNow() })
    return HttpResponse.json(skill)
  }),

  http.post('/api/admin/content/skills/:id/merge', async ({ params, request }) => {
    const body = (await request.json()) as { targetId: string }
    return HttpResponse.json({
      success: true,
      sourceId: params.id,
      targetId: body.targetId,
      mergedAt: isoNow(),
    })
  }),

  // ---- Announcements ----

  http.get('/api/admin/content/announcements', () => {
    return HttpResponse.json(mockAnnouncements)
  }),

  http.post('/api/admin/content/announcements', async ({ request }) => {
    const body = (await request.json()) as {
      title: string
      content: string
      audience: AnnouncementAudience
      status: AnnouncementStatus
    }
    const newAnn: PlatformAnnouncement = {
      id: randomId('ann'),
      title: body.title,
      content: body.content,
      audience: body.audience,
      status: body.status,
      publishedAt: body.status === 'published' ? isoNow() : undefined,
      createdBy: 'Current Admin',
      createdAt: isoNow(),
    }
    mockAnnouncements.unshift(newAnn)
    return HttpResponse.json(newAnn, { status: 201 })
  }),

  http.patch('/api/admin/content/announcements/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const ann = mockAnnouncements.find((a) => a.id === params.id)
    if (!ann) return new HttpResponse(null, { status: 404 })
    Object.assign(ann, body)
    if (body.status === 'published' && !ann.publishedAt) {
      ann.publishedAt = isoNow()
    }
    return HttpResponse.json(ann)
  }),

  // ---- Resources ----

  http.get('/api/admin/content/resources', () => {
    return HttpResponse.json(mockResources)
  }),

  http.post('/api/admin/content/resources', async ({ request }) => {
    const body = (await request.json()) as {
      title: string
      type: ResourceItemType
      fileUrl: string
    }
    const newRes: ResourceItem = {
      id: randomId('res'),
      title: body.title,
      type: body.type,
      fileUrl: body.fileUrl,
      audience: 'all',
      isActive: true,
      createdBy: 'Current Admin',
      createdAt: isoNow(),
      updatedAt: isoNow(),
    }
    mockResources.unshift(newRes)
    return HttpResponse.json(newRes, { status: 201 })
  }),

  http.patch('/api/admin/content/resources/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const res = mockResources.find((r) => r.id === params.id)
    if (!res) return new HttpResponse(null, { status: 404 })
    Object.assign(res, body, { updatedAt: isoNow() })
    return HttpResponse.json(res)
  }),

  http.delete('/api/admin/content/resources/:id', ({ params }) => {
    const idx = mockResources.findIndex((r) => r.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    mockResources.splice(idx, 1)
    return HttpResponse.json({ success: true })
  }),
]
