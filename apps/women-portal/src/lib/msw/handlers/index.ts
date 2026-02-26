import { authHandlers } from './auth'
import { onboardingHandlers } from './onboarding'
import { canaryHandlers } from './canary'

export const handlers = [...canaryHandlers, ...authHandlers, ...onboardingHandlers]
