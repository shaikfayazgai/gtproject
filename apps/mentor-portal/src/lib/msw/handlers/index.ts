import { authHandlers } from './auth'
import { applicationHandlers } from './application'
import { onboardingHandlers } from './onboarding'
import { reviewHandlers } from './reviews'
import { profileHandlers } from './profile'
import { skillVerificationHandlers } from './skill-verification'

export const handlers = [
  ...authHandlers,
  ...applicationHandlers,
  ...onboardingHandlers,
  ...reviewHandlers,
  ...profileHandlers,
  ...skillVerificationHandlers,
]
