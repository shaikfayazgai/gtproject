import { http, HttpResponse } from 'msw'
import { isoPast, isoNow, randomId } from '../factories/common'
import type { AdminUser, AdminRole } from '@glimmora/types'

const mockAdmins: AdminUser[] = [
  {
    id: 'admin-001',
    displayName: 'Sarah Chen',
    email: 'sarah.chen@glimmora.com',
    adminRole: 'super_admin',
    isActive: true,
    createdAt: isoPast(180),
    lastLoginAt: isoPast(0),
  },
  {
    id: 'admin-002',
    displayName: 'Raj Patel',
    email: 'raj.patel@glimmora.com',
    adminRole: 'super_admin',
    isActive: true,
    createdAt: isoPast(150),
    lastLoginAt: isoPast(1),
  },
  {
    id: 'admin-003',
    displayName: 'Maria Santos',
    email: 'maria.santos@glimmora.com',
    adminRole: 'standard_admin',
    isActive: true,
    createdAt: isoPast(120),
    lastLoginAt: isoPast(0),
  },
  {
    id: 'admin-004',
    displayName: 'James Wilson',
    email: 'james.wilson@glimmora.com',
    adminRole: 'standard_admin',
    isActive: true,
    createdAt: isoPast(90),
    lastLoginAt: isoPast(2),
  },
  {
    id: 'admin-005',
    displayName: 'Aisha Mohammed',
    email: 'aisha.mohammed@glimmora.com',
    adminRole: 'standard_admin',
    isActive: false,
    createdAt: isoPast(200),
    lastLoginAt: isoPast(45),
  },
]

export const settingsHandlers = [
  http.get('/api/admin/settings/admins', () => {
    return HttpResponse.json(mockAdmins)
  }),

  http.patch('/api/admin/settings/admins/:id', async ({ params, request }) => {
    const body = (await request.json()) as { adminRole: AdminRole }
    const admin = mockAdmins.find((a) => a.id === params.id)
    if (!admin) return new HttpResponse(null, { status: 404 })
    admin.adminRole = body.adminRole
    return HttpResponse.json(admin)
  }),

  http.post('/api/admin/settings/admins', async ({ request }) => {
    const body = (await request.json()) as { email: string; adminRole: AdminRole }
    const newAdmin: AdminUser = {
      id: randomId('admin'),
      displayName: body.email.split('@')[0],
      email: body.email,
      adminRole: body.adminRole,
      isActive: true,
      createdAt: isoNow(),
      lastLoginAt: isoNow(),
    }
    mockAdmins.push(newAdmin)
    return HttpResponse.json(newAdmin, { status: 201 })
  }),
]
