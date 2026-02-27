import { http, HttpResponse } from 'msw'
import { createMockAuditEntries } from '../factories/audit-log'

const mockAuditEntries = createMockAuditEntries()

export const auditLogHandlers = [
  http.get('/api/admin/audit-log', () => {
    return HttpResponse.json(mockAuditEntries)
  }),
]
