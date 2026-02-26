import { authHandlers } from './auth'
import { onboardingHandlers } from './onboarding'
import { canaryHandlers } from './canary'
import { taskHandlers } from './tasks'
import { evidenceHandlers } from './evidence'
import { apgHandlers } from './apg'

export const handlers = [
  ...canaryHandlers,
  ...authHandlers,
  ...onboardingHandlers,
  ...taskHandlers,
  ...evidenceHandlers,
  ...apgHandlers,
]
