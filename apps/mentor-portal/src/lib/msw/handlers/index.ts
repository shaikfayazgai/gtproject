import { authHandlers } from './auth'
import { applicationHandlers } from './application'
import { onboardingHandlers } from './onboarding'
import { reviewHandlers } from './reviews'

export const handlers = [
  ...authHandlers,
  ...applicationHandlers,
  ...onboardingHandlers,
  ...reviewHandlers,
]
