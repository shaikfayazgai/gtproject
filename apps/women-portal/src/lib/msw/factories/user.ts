import type { User, ContributorProfile } from '@glimmora/types'

export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: 'user-001',
    email: 'contributor@example.com',
    role: 'woman-contributor',
    displayName: 'Amina',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockContributorProfile(
  overrides?: Partial<ContributorProfile>
): ContributorProfile {
  return {
    id: 'user-001',
    email: 'contributor@example.com',
    role: 'woman-contributor',
    displayName: 'Amina',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tier: 'emerging',
    anonymousId: 'anon-abc123',
    languagePreference: 'en',
    onboardingCompleted: false,
    ...overrides,
  }
}
