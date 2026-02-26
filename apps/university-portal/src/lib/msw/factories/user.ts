import type { StudentProfile } from '@glimmora/types'

export function createMockStudentProfile(
  overrides?: Partial<StudentProfile>
): StudentProfile {
  return {
    userId: 'student-001',
    universityEmail: 'arjun@university.edu',
    studentId: 'STU-2024-0042',
    universityName: 'Bangalore Institute of Technology',
    academicYear: 3,
    status: 'active',
    ...overrides,
  }
}
