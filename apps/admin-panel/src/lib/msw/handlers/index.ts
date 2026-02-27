import { authHandlers } from './auth'
import { dashboardHandlers } from './dashboard'
import { userHandlers } from './users'
import { projectHandlers } from './projects'
import { disputeHandlers } from './disputes'

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...userHandlers,
  ...projectHandlers,
  ...disputeHandlers,
]
