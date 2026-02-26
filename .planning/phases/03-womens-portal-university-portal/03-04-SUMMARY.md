---
phase: 03-womens-portal-university-portal
plan: 04
subsystem: ui
tags: [react, next.js, react-pdf, podl, pdf-export, anonymous-team, skill-genome, msw, zustand]

# Dependency graph
requires:
  - phase: 03-01
    provides: "University Portal scaffold, next-intl, i18n setup, @glimmora/types with StudentProfile/PoDLCredential"
  - phase: 02-03
    provides: "SkillGenomePanel, AnonymizedTeamCard, PoDLCard, APGFeed components"
  - phase: 02-02
    provides: "AppShell, Sidebar, TopBar, KPIStatCard, GradientCard"
provides:
  - "Complete University Portal student experience (14 routes)"
  - "Student registration with university email + student ID"
  - "4-step onboarding with email verification"
  - "Task discovery with accept flow"
  - "Evidence submission (5 types: file, url, code, video, text)"
  - "PoDL credential detail with branded PDF export via @react-pdf/renderer"
  - "Anonymous team view (seed/role/skills only, no identity)"
  - "Private Skill Genome page (no leaderboard/ranking)"
  - "MSW handlers for all API endpoints"
affects: ["03-05", "04-enterprise-portal", "05-mentor-admin-portals"]

# Tech tracking
tech-stack:
  added: ["@react-pdf/renderer", "lucide-react (university-portal)"]
  patterns: ["Dynamic PDF import (await import) for SSR safety", "Task discovery with accept flow (vs assignment)", "Cookie-based auth store with zustand persist"]

key-files:
  created:
    - "apps/university-portal/src/app/(pre-auth)/page.tsx"
    - "apps/university-portal/src/app/(pre-auth)/register/page.tsx"
    - "apps/university-portal/src/app/(pre-auth)/onboarding/verify/page.tsx"
    - "apps/university-portal/src/app/(app)/layout.tsx"
    - "apps/university-portal/src/app/(app)/dashboard/page.tsx"
    - "apps/university-portal/src/app/(app)/tasks/page.tsx"
    - "apps/university-portal/src/app/(app)/credentials/[credentialId]/page.tsx"
    - "apps/university-portal/src/app/(app)/team/page.tsx"
    - "apps/university-portal/src/app/(app)/skills/page.tsx"
    - "apps/university-portal/src/components/credentials/podl-pdf-document.tsx"
    - "apps/university-portal/src/components/credentials/podl-credential-detail.tsx"
    - "apps/university-portal/src/components/team/anonymous-team-view.tsx"
    - "apps/university-portal/src/components/skills/skill-genome-page.tsx"
    - "apps/university-portal/src/store/auth-store.ts"
  modified:
    - "apps/university-portal/package.json"
    - "apps/university-portal/src/messages/en.json"
    - "apps/university-portal/src/lib/msw/handlers.ts"
    - "pnpm-lock.yaml"

key-decisions:
  - "Task discovery uses Available/My Tasks/Completed tabs (students choose tasks, not assigned)"
  - "PDF export uses dynamic import (await import('@react-pdf/renderer')) to avoid SSR crashes"
  - "University Portal auth store uses zustand persist with localStorage for session continuity"
  - "APG handlers added for university portal dashboard (shared pattern with women's portal)"
  - "lucide-react added as direct dependency (needed for app layout icons)"

patterns-established:
  - "PDF export pattern: dynamic import of @react-pdf/renderer in client component, blob download"
  - "Task accept flow: POST /api/tasks/:id/accept (vs women's portal assignment model)"
  - "PoDL credential detail: PoDLCard widget + full details section + PDF/share actions"

# Metrics
duration: 10min
completed: 2026-02-26
---

# Phase 3 Plan 4: University Portal Student Experience Summary

**Complete University Portal with 14 routes: student registration with university email verification, task discovery with accept flow, PoDL credential PDF export via @react-pdf/renderer, anonymous team view, and private Skill Genome**

## Performance

- **Duration:** 10 min
- **Started:** 2026-02-26T13:36:10Z
- **Completed:** 2026-02-26T13:45:48Z
- **Tasks:** 2
- **Files modified:** 61

## Accomplishments
- Built complete University Portal student experience with 14 routes (7 pre-auth + 7 authenticated)
- Installed @react-pdf/renderer and created PoDL PDF document component with Glimmora branding (terracotta #A0614A)
- Student registration includes university email, student ID, university name, degree program, and academic year
- 4-step onboarding with email verification step (code input UI)
- Task discovery with Available/My Tasks/Completed tabs and "Accept Task" button
- Evidence submission supports all 5 types (file, URL, code, video, text)
- Anonymous team view passes only seed/role/skills to AnonymizedTeamCard (zero identity leakage)
- Private Skill Genome with zero leaderboard/ranking/comparison text

## Task Commits

Each task was committed atomically:

1. **Task 1: Install @react-pdf/renderer + set up University Portal structure** - `8ed6717` (feat)
2. **Task 2: Build authenticated pages (dashboard, tasks, credentials+PDF, team, skills)** - `a69bc6d` (feat)

## Files Created/Modified

### Pre-auth routes
- `apps/university-portal/src/app/(pre-auth)/page.tsx` - Login page
- `apps/university-portal/src/app/(pre-auth)/register/page.tsx` - Student registration
- `apps/university-portal/src/app/(pre-auth)/onboarding/profile/page.tsx` - Profile step
- `apps/university-portal/src/app/(pre-auth)/onboarding/verify/page.tsx` - Email verification step
- `apps/university-portal/src/app/(pre-auth)/onboarding/skills/page.tsx` - Skills selection step
- `apps/university-portal/src/app/(pre-auth)/onboarding/activation/page.tsx` - Activation step

### Authenticated routes
- `apps/university-portal/src/app/(app)/layout.tsx` - AppShell with university sidebar
- `apps/university-portal/src/app/(app)/dashboard/page.tsx` - Student dashboard
- `apps/university-portal/src/app/(app)/tasks/page.tsx` - Task discovery
- `apps/university-portal/src/app/(app)/tasks/[taskId]/page.tsx` - Task detail
- `apps/university-portal/src/app/(app)/tasks/[taskId]/submit/page.tsx` - Evidence submission
- `apps/university-portal/src/app/(app)/credentials/page.tsx` - Credentials list
- `apps/university-portal/src/app/(app)/credentials/[credentialId]/page.tsx` - Credential detail
- `apps/university-portal/src/app/(app)/team/page.tsx` - Anonymous team view
- `apps/university-portal/src/app/(app)/skills/page.tsx` - Private Skill Genome

### Components
- `apps/university-portal/src/components/registration/student-registration-form.tsx` - Registration with university fields
- `apps/university-portal/src/components/onboarding/verify-email-step.tsx` - Email verification code input
- `apps/university-portal/src/components/dashboard/student-dashboard.tsx` - Dashboard with KPI cards + APG feed
- `apps/university-portal/src/components/tasks/task-discovery-list.tsx` - Task discovery with tabs
- `apps/university-portal/src/components/tasks/evidence-submission-form.tsx` - 5-type evidence form
- `apps/university-portal/src/components/credentials/podl-credential-detail.tsx` - PoDL detail + PDF export
- `apps/university-portal/src/components/credentials/podl-pdf-document.tsx` - React-PDF document component
- `apps/university-portal/src/components/team/anonymous-team-view.tsx` - Anonymous team cards
- `apps/university-portal/src/components/skills/skill-genome-page.tsx` - Private skills view

### MSW
- `apps/university-portal/src/lib/msw/handlers/` - 7 handler files (auth, tasks, evidence, credentials, team, skills, apg)
- `apps/university-portal/src/lib/msw/factories/` - 7 factory files (user, task, evidence, podl, team, skills, apg, common)

## Decisions Made
- Task discovery uses Available/My Tasks/Completed tabs (students choose tasks, unlike women's portal assignment model)
- PDF export uses dynamic import (`await import('@react-pdf/renderer')`) to avoid SSR crashes -- both react-pdf and the PDF document component are lazy-loaded
- University Portal auth store uses zustand persist with localStorage for session continuity across page reloads
- lucide-react added as direct dependency to university-portal (needed for sidebar navigation icons)
- APG factory and handlers added for university portal dashboard (same TYPE_MAP pattern as women's portal)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added APG activity mock data and handler**
- **Found during:** Task 2 (Student Dashboard)
- **Issue:** Plan didn't include APG factory/handler for university portal, but dashboard uses APGFeed component requiring `/api/apg/activities`
- **Fix:** Created `factories/apg.ts` and `handlers/apg.ts` following women's portal pattern
- **Files modified:** `factories/apg.ts`, `handlers/apg.ts`, `handlers/index.ts`
- **Verification:** Build passes, dashboard renders APG feed
- **Committed in:** a69bc6d (Task 2 commit)

**2. [Rule 3 - Blocking] Added lucide-react as direct dependency**
- **Found during:** Task 2 (AppShell layout)
- **Issue:** University portal layout needs lucide-react icons for sidebar navigation but it wasn't in package.json
- **Fix:** Installed lucide-react alongside @react-pdf/renderer in Task 1
- **Files modified:** `apps/university-portal/package.json`
- **Verification:** Build passes with all icon imports
- **Committed in:** 8ed6717 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 missing critical, 1 blocking)
**Impact on plan:** Both essential for correct operation. No scope creep.

## Issues Encountered
None - clean build on both tasks.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- University Portal complete with 14 routes, all MSW-backed
- Ready for 03-05 (shared cross-portal components or integration testing if planned)
- @react-pdf/renderer installed and pattern established for any portal needing PDF export
- PoDL credential PDF template can be reused across portals

---
*Phase: 03-womens-portal-university-portal*
*Completed: 2026-02-26*
