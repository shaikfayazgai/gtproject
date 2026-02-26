---
phase: 04-mentor-portal
plan: 01
subsystem: ui, types, auth
tags: [react, typescript, msw, zustand, react-resizable-panels, mentor, onboarding]

# Dependency graph
requires:
  - phase: 02-design-system-completion
    provides: AppShell, Stepper, Badge, Card, Button, TextInput, Textarea, Select, Checkbox, RadioGroup, Tag, Spinner
  - phase: 01-monorepo-infrastructure-ds-foundation
    provides: monorepo structure, MSW setup, TanStack Query providers, zustand
provides:
  - "@glimmora/types mentor.ts with MentorApplication, ReviewQueueItem, ReviewDecision, SkillTagVerificationRequest, MentorConversation, MentorImpactMetrics"
  - "react-resizable-panels v4 wrapper (ResizablePanelGroup/ResizablePanel/ResizableHandle) in @glimmora/ui"
  - "Mentor Portal pre-auth flow (application form + status polling)"
  - "4-step mentor onboarding (Profile, Expertise, Capacity, Orientation+CoC)"
  - "MSW handlers for auth, application, onboarding in handlers/ directory"
  - "Auth store with zustand persist for mentor roles"
affects: [04-02-PLAN, 04-03-PLAN, 04-04-PLAN, 05-enterprise-portal]

# Tech tracking
tech-stack:
  added: [react-resizable-panels v4.6.5, lucide-react (mentor-portal), next-intl (mentor-portal)]
  patterns: [react-resizable-panels v4 wrapper (Group/Panel/Separator with orientation prop, plain functions not forwardRef)]

key-files:
  created:
    - packages/types/src/mentor.ts
    - packages/ui/src/components/resizable-panels/resizable-panels.tsx
    - packages/ui/src/components/resizable-panels/index.ts
    - apps/mentor-portal/src/components/application/application-form.tsx
    - apps/mentor-portal/src/components/application/application-status.tsx
    - apps/mentor-portal/src/components/onboarding/mentor-profile-step.tsx
    - apps/mentor-portal/src/components/onboarding/expertise-skills-step.tsx
    - apps/mentor-portal/src/components/onboarding/capacity-step.tsx
    - apps/mentor-portal/src/components/onboarding/orientation-step.tsx
    - apps/mentor-portal/src/store/auth-store.ts
    - apps/mentor-portal/src/lib/msw/factories/common.ts
    - apps/mentor-portal/src/lib/msw/factories/mentor.ts
    - apps/mentor-portal/src/lib/msw/handlers/auth.ts
    - apps/mentor-portal/src/lib/msw/handlers/application.ts
    - apps/mentor-portal/src/lib/msw/handlers/onboarding.ts
    - apps/mentor-portal/src/lib/msw/handlers/index.ts
  modified:
    - packages/types/src/index.ts
    - packages/ui/src/index.ts
    - packages/ui/package.json
    - apps/mentor-portal/package.json
    - apps/mentor-portal/src/app/page.tsx
    - apps/mentor-portal/src/lib/msw/browser.ts
    - apps/mentor-portal/src/lib/msw/server.ts
    - apps/mentor-portal/src/lib/msw/handlers.ts

key-decisions:
  - "MentorProfile renamed to MentorOnboardingProfile in mentor.ts to avoid conflict with MentorProfile from user.ts (which extends User)"
  - "react-resizable-panels v4 wrapper uses plain functions (not forwardRef) because v4 Group/Panel/Separator use elementRef prop instead of ref"
  - "Application status uses TanStack Query refetchInterval: 5000 for pending/under_review polling"
  - "Mentor auth store has 3 roles: applicant, pending_onboarding, mentor"

patterns-established:
  - "Mentor pre-auth flow: /apply -> /apply/status -> /onboarding/* -> /queue"
  - "react-resizable-panels v4 wrapper: import Group/Panel/Separator, use orientation prop (not direction)"

# Metrics
duration: 9min
completed: 2026-02-26
---

# Phase 4 Plan 01: Mentor Portal Foundation Summary

**Mentor types (11 exports), react-resizable-panels v4 wrapper, application form with status polling, 4-step onboarding with Code of Conduct acceptance**

## Performance

- **Duration:** 9 min
- **Started:** 2026-02-26T15:05:12Z
- **Completed:** 2026-02-26T15:13:45Z
- **Tasks:** 2
- **Files modified:** 31

## Accomplishments
- Full mentor type system in @glimmora/types with 11 exports including ReviewQueueItem (with hasSLAExtensionPending for 04-02)
- react-resizable-panels v4.6.5 wrapper in @glimmora/ui (ResizablePanelGroup/ResizablePanel/ResizableHandle)
- Complete mentor application flow: form submission (expertise tags, credentials, availability) and APG review status polling
- 4-step onboarding: Profile, Expertise+Skills (2-8 areas), Capacity (hours + review types), Orientation + 6-item Code of Conduct
- MSW handlers structured in handlers/ directory with factory functions for realistic mock data

## Task Commits

Each task was committed atomically:

1. **Task 1: @glimmora/types mentor.ts + react-resizable-panels v4 wrapper** - `07308cf` (feat)
2. **Task 2: Mentor Portal pre-auth + 4-step onboarding + MSW handlers** - `3a1b318` (feat)

**Plan metadata:** (pending)

## Files Created/Modified
- `packages/types/src/mentor.ts` - 11 exports: MentorApplication, MentorOnboardingProfile, ReviewQueueItem, ReviewDecision, etc.
- `packages/ui/src/components/resizable-panels/resizable-panels.tsx` - Wrapper around react-resizable-panels v4 Group/Panel/Separator
- `apps/mentor-portal/src/components/application/application-form.tsx` - Expertise tag input, credentials textarea, availability select
- `apps/mentor-portal/src/components/application/application-status.tsx` - TanStack Query polling with status-specific messaging
- `apps/mentor-portal/src/components/onboarding/mentor-profile-step.tsx` - Display name, bio, photo placeholder
- `apps/mentor-portal/src/components/onboarding/expertise-skills-step.tsx` - 16 predefined categories + custom, 2-8 selection
- `apps/mentor-portal/src/components/onboarding/capacity-step.tsx` - Weekly hours radio + review type checkboxes
- `apps/mentor-portal/src/components/onboarding/orientation-step.tsx` - Platform overview + 6-item CoC + agreement checkbox
- `apps/mentor-portal/src/store/auth-store.ts` - Zustand persist with applicant/pending_onboarding/mentor roles
- `apps/mentor-portal/src/lib/msw/factories/mentor.ts` - Factory functions with 5 seeded ReviewQueueItems
- `apps/mentor-portal/src/lib/msw/handlers/` - auth, application, onboarding handler modules

## Decisions Made
- **MentorProfile naming:** Renamed to MentorOnboardingProfile in mentor.ts because user.ts already exports a MentorProfile (extends User with different fields). This avoids duplicate export conflicts.
- **react-resizable-panels v4 API:** v4 uses plain functions (not forwardRef), so wrapper functions are also plain. The v4 API is Group/Panel/Separator with `orientation` prop (not PanelGroup/PanelResizeHandle with `direction`).
- **Application status polling:** Uses TanStack Query refetchInterval that stops when application is approved/rejected (conditional polling).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] MentorProfile naming conflict with user.ts**
- **Found during:** Task 2 (build verification)
- **Issue:** mentor.ts defined MentorProfile which collided with existing MentorProfile in user.ts (extends User). TypeScript error: `mentorId does not exist on type MentorProfile`
- **Fix:** Renamed to MentorOnboardingProfile in mentor.ts, updated index.ts re-export and factory usage
- **Files modified:** packages/types/src/mentor.ts, packages/types/src/index.ts, apps/mentor-portal/src/lib/msw/factories/mentor.ts
- **Verification:** pnpm turbo build passes
- **Committed in:** 3a1b318 (Task 2 commit)

**2. [Rule 1 - Bug] react-resizable-panels v4 does not support forwardRef**
- **Found during:** Task 2 (build verification)
- **Issue:** Original wrapper used React.forwardRef but v4 Group/Separator don't accept ref prop (they use elementRef instead). Build failed: `Property 'ref' does not exist on type`
- **Fix:** Rewrote wrapper to use plain functions instead of forwardRef
- **Files modified:** packages/ui/src/components/resizable-panels/resizable-panels.tsx
- **Verification:** pnpm turbo build passes
- **Committed in:** 3a1b318 (Task 2 commit)

**3. [Rule 1 - Bug] Unused variable iconClass in StatusIcon**
- **Found during:** Task 2 (build verification)
- **Issue:** ESLint warning for unused `iconClass` variable
- **Fix:** Removed the unused variable
- **Files modified:** apps/mentor-portal/src/components/application/application-status.tsx
- **Verification:** No more warnings
- **Committed in:** 3a1b318 (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (3 bugs)
**Impact on plan:** All fixes necessary for build success. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Mentor types ready for 04-02 (Review Queue with hasSLAExtensionPending field)
- ResizablePanelGroup/ResizablePanel/ResizableHandle available in @glimmora/ui for 3-panel review layout
- Pre-auth flow complete, ready for authenticated (app) route group in 04-02
- MSW handlers directory ready to add review queue, impact metrics, and messaging handlers

---
*Phase: 04-mentor-portal*
*Completed: 2026-02-26*
