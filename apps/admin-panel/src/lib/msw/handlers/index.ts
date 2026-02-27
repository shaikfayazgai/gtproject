import { authHandlers } from './auth'
import { dashboardHandlers } from './dashboard'
import { userHandlers } from './users'
import { projectHandlers } from './projects'
import { disputeHandlers } from './disputes'
import { reportHandlers } from './reports'
import { contentHandlers } from './content'
import { apgConfigHandlers } from './apg-config'
import { auditLogHandlers } from './audit-log'
import { settingsHandlers } from './settings'

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...userHandlers,
  ...projectHandlers,
  ...disputeHandlers,
  ...reportHandlers,
  ...contentHandlers,
  ...apgConfigHandlers,
  ...auditLogHandlers,
  ...settingsHandlers,
]
