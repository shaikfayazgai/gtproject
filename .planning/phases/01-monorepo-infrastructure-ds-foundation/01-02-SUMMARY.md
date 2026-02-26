---
phase: 01-monorepo-infrastructure-ds-foundation
plan: 02
subsystem: types, data-layer
tags: [typescript, msw, tanstack-query, zustand, mock-api, type-contracts]

# Dependency graph
requires:
  - phase: 01-monorepo-infrastructure-ds-foundation
    plan: 01
    provides: monorepo scaffold, 5 portal apps, pnpm workspaces, turbo build pipeline
provides:
  - "@glimmora/types package with 8 interface families (user, project, task, sow, evidence, podl, skill-genome, api)"
  - "MSW v2 dual-runtime mocking (browser service worker + server-side instrumentation.ts) in all 5 portals"
  - "TanStack Query v5 provider with devtools in all 5 portals"
  - "Zustand v5 app-store with sidebar state in all 5 portals"
  - "Typed mock handlers returning APIResponse<Task[]> via MSW"
  - "Providers wrapper component composing MSW + Query providers per portal"
affects:
  - 01-monorepo-infrastructure-ds-foundation (plan 03, 04 will use types and providers)
  - All future portal development (every page fetches through TanStack Query -> MSW -> typed responses)
  - Backend handoff (types become API contract specification)

# Tech tracking
tech-stack:
  added: [msw@2.12.10, @tanstack/react-query@5, @tanstack/react-query-devtools@5, zustand@5]
  patterns: [dual-runtime-msw, provider-composition, typed-mock-handlers, barrel-exports]

key-files:
  created:
    - packages/types/src/user.ts
    - packages/types/src/project.ts
    - packages/types/src/task.ts
    - packages/types/src/sow.ts
    - packages/types/src/evidence.ts
    - packages/types/src/podl.ts
    - packages/types/src/skill-genome.ts
    - packages/types/src/api.ts
    - packages/types/src/index.ts
    - packages/types/tsconfig.json
    - apps/*/src/lib/msw/handlers.ts
    - apps/*/src/lib/msw/browser.ts
    - apps/*/src/lib/msw/server.ts
    - apps/*/src/components/providers/MSWProvider.tsx
    - apps/*/src/components/providers/QueryProvider.tsx
    - apps/*/src/components/providers/Providers.tsx
    - apps/*/src/store/app-store.ts
    - apps/*/instrumentation.ts
    - apps/*/public/mockServiceWorker.js
  modified:
    - packages/types/package.json
    - package.json
    - apps/*/package.json
    - apps/*/src/app/layout.tsx
    - pnpm-lock.yaml

key-decisions:
  - "MSW build scripts approved via pnpm.onlyBuiltDependencies in root package.json"
  - "MSW workerDirectory configured as array of all 5 portal public dirs in root package.json"
  - "Providers composition: MSWProvider (outer) -> QueryProvider (inner) ensures MSW intercepts before queries fire"

patterns-established:
  - "Provider composition: MSWProvider wraps QueryProvider, both 'use client', composed in Providers.tsx"
  - "MSW dual-runtime: browser.ts for client dev, server.ts for instrumentation.ts server-side interception"
  - "Typed mock handlers: all MSW handlers import types from @glimmora/types and return APIResponse<T>"
  - "Zustand store: per-portal app-store.ts with create<AppState> pattern"
  - "Type barrel exports: packages/types/src/index.ts re-exports all type families"

# Metrics
duration: 4min
completed: 2026-02-26
---

# Phase 1 Plan 2: Shared Types + MSW Mock Layer Summary

**@glimmora/types with 8 interface families (User/Project/Task/SOW/Evidence/PoDL/SkillGenome/API) plus MSW v2 dual-runtime mocking, TanStack Query v5, and Zustand v5 wired into all 5 portal apps**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-26T08:22:22Z
- **Completed:** 2026-02-26T08:26:44Z
- **Tasks:** 2/2
- **Files modified:** 67

## Accomplishments
- @glimmora/types package populated with 8 complete interface families covering all platform domain entities
- MSW v2 dual-runtime (browser service worker + Node.js server via instrumentation.ts) installed and configured in all 5 portals
- TanStack Query v5 with QueryClientProvider and ReactQueryDevtools in all 5 portals
- Zustand v5 app-store initialized per portal with sidebar state management
- All portal layout.tsx files wrap children in composed Providers (MSW + Query)
- All 5 portals build successfully with `pnpm turbo build`

## Task Commits

Each task was committed atomically:

1. **Task 1: @glimmora/types core TypeScript interfaces** - `83a48f5` (feat)
2. **Task 2: MSW v2 dual-runtime + TanStack Query + Zustand in all 5 portals** - `cc6363b` (feat)

## Files Created/Modified

### packages/types/
- `src/user.ts` - UserRole, ContributorTier, MentorTier, User, ContributorProfile, MentorProfile, EnterpriseUser
- `src/project.ts` - ProjectStatus, ProjectHealthStatus, Project, ProjectMilestone
- `src/task.ts` - TaskStatus, TaskPriority, TaskType, Task
- `src/sow.ts` - SOWStatus, SOW, SOWDecomposition
- `src/evidence.ts` - EvidenceType, EvidenceStatus, Evidence, EvidencePack
- `src/podl.ts` - PoDL, PoDLCredential
- `src/skill-genome.ts` - SkillGenome, SkillNode
- `src/api.ts` - APIResponse<T>, APGActivity
- `src/index.ts` - Barrel re-exports for all 8 families
- `package.json` - Updated with type:module, exports map
- `tsconfig.json` - Created extending react-library base

### Per-portal (x5: women, university, enterprise, mentor, admin)
- `src/lib/msw/handlers.ts` - Typed mock handlers for /api/health and /api/tasks
- `src/lib/msw/browser.ts` - MSW browser worker setup
- `src/lib/msw/server.ts` - MSW Node.js server setup
- `src/components/providers/MSWProvider.tsx` - Client-side MSW initialization
- `src/components/providers/QueryProvider.tsx` - TanStack Query client + devtools
- `src/components/providers/Providers.tsx` - Composed provider wrapper
- `src/store/app-store.ts` - Zustand store with sidebar state
- `instrumentation.ts` - Next.js instrumentation for server-side MSW
- `public/mockServiceWorker.js` - MSW service worker script
- `src/app/layout.tsx` - Updated to wrap children in Providers
- `package.json` - Updated with msw, @tanstack/react-query, zustand dependencies

### Root
- `package.json` - Added pnpm.onlyBuiltDependencies for MSW, msw.workerDirectory array

## Decisions Made
- MSW build scripts approved via `pnpm.onlyBuiltDependencies` in root package.json (pnpm v10 strict mode requires explicit approval)
- MSW `workerDirectory` configured as array of all 5 portal public directories
- Provider nesting order: MSWProvider (outer) wraps QueryProvider (inner) to ensure mock service worker intercepts before any queries fire

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] MSW build scripts required explicit approval in pnpm v10**
- **Found during:** Task 2 (dependency installation)
- **Issue:** pnpm v10 strict mode blocks postinstall scripts by default; MSW needs its postinstall to run
- **Fix:** Added `pnpm.onlyBuiltDependencies: ["msw"]` to root package.json
- **Files modified:** package.json
- **Verification:** `pnpm install` runs MSW postinstall successfully
- **Committed in:** cc6363b (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential for MSW to function. No scope creep.

## Issues Encountered
None beyond the MSW build approval deviation documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Type contracts ready for use by any portal page or shared package
- MSW handlers ready to be extended with domain-specific mock data per portal
- TanStack Query ready for useQuery/useMutation hooks in portal components
- Zustand stores ready to be extended with portal-specific state
- All infrastructure required for Phase 1 Plans 03 and 04 is in place

---
*Phase: 01-monorepo-infrastructure-ds-foundation*
*Completed: 2026-02-26*
