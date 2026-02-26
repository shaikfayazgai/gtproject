import type { AlumniProfile } from '@glimmora/types'

export function createMockAlumniProfile(overrides: Partial<AlumniProfile> = {}): AlumniProfile {
  return {
    userId: 'alumni-001',
    universityName: 'Indian Institute of Technology, Bangalore',
    graduationYear: 2024,
    currentEmployment: 'Full-stack developer at a startup',
    previousPoDLCount: 8,
    status: 'active_alumni',
    ...overrides,
  }
}
