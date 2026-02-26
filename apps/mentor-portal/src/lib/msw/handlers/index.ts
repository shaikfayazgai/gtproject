import { authHandlers } from './auth'
import { applicationHandlers } from './application'
import { onboardingHandlers } from './onboarding'
import { reviewHandlers } from './reviews'
import { profileHandlers } from './profile'
import { skillVerificationHandlers } from './skill-verification'
import { conversationHandlers } from './conversations'
import { notificationHandlers } from './notifications'

export const handlers = [
  ...authHandlers,
  ...applicationHandlers,
  ...onboardingHandlers,
  ...reviewHandlers,
  ...profileHandlers,
  ...skillVerificationHandlers,
  ...conversationHandlers,
  ...notificationHandlers,
]
