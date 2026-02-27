import { authHandlers } from './auth'
import { onboardingHandlers } from './onboarding'
import { sowHandlers } from './sow'
import { blueprintHandlers } from './blueprint'
import { dashboardHandlers } from './dashboard'
import { projectHandlers } from './projects'

export const handlers = [
  ...authHandlers,
  ...onboardingHandlers,
  ...sowHandlers,
  ...blueprintHandlers,
  ...dashboardHandlers,
  ...projectHandlers,
]
