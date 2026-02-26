---
phase: 03-womens-portal-university-portal
plan: 01
subsystem: ui
tags: [next-intl, i18n, rtl, zustand, msw, onboarding, typescript, react]

# Dependency graph
requires:
  - phase: 01-monorepo-infrastructure-ds-foundation
    provides: monorepo structure, @glimmora/types, MSW setup, portal scaffolding
  - phase: 02-design-system-completion
    provides: Button, TextInput, PasswordInput, Textarea, RadioGroup, RadioItem, Tag, Heading, Body, Badge
provides:
  - 14 new domain types in @glimmora/types (earnings, message, onboarding, student, governor, notification, device)
  - next-intl cookie-based i18n with RTL support in women-portal and university-portal
  - Women's Portal complete pre-auth flow (language selector -> welcome -> register -> 4-step onboarding)
  - Zustand auth and language stores
  - MSW auth and onboarding mock handlers
  - PrivacyBanner reusable component
affects: [03-02, 03-03, 03-04, 03-05, 04-enterprise-mentor-portals]

# Tech tracking
tech-stack:
  added: [next-intl, lucide-react (women-portal direct dep), Noto Sans Arabic (web font)]
  patterns: [cookie-based locale (NEXT_LOCALE), dynamic dir attribute for RTL, pre-auth route group, MSW handlers directory structure]

key-files:
  created:
    - packages/types/src/earnings.ts
    - packages/types/src/message.ts
    - packages/types/src/onboarding.ts
    - packages/types/src/student.ts
    - packages/types/src/governor.ts
    - packages/types/src/notification.ts
    - packages/types/src/device.ts
    - apps/women-portal/src/i18n/request.ts
    - apps/women-portal/src/messages/en.json
    - apps/women-portal/src/messages/ur.json
    - apps/women-portal/src/messages/ar.json
    - apps/women-portal/src/components/language-selector/language-selector.tsx
    - apps/women-portal/src/components/welcome-screen/welcome-screen.tsx
    - apps/women-portal/src/components/registration-form/registration-form.tsx
    - apps/women-portal/src/components/onboarding/privacy-banner.tsx
    - apps/women-portal/src/components/onboarding/profile-step.tsx
    - apps/women-portal/src/components/onboarding/devices-step.tsx
    - apps/women-portal/src/components/onboarding/skills-step.tsx
    - apps/women-portal/src/components/onboarding/activation-step.tsx
    - apps/women-portal/src/store/auth-store.ts
    - apps/women-portal/src/store/language-store.ts
    - apps/women-portal/src/lib/msw/handlers/auth.ts
    - apps/women-portal/src/lib/msw/handlers/onboarding.ts
    - apps/women-portal/src/lib/msw/factories/user.ts
    - apps/university-portal/src/i18n/request.ts
    - apps/university-portal/src/messages/en.json
    - apps/university-portal/src/messages/ur.json
    - apps/university-portal/src/messages/ar.json
  modified:
    - packages/types/src/index.ts
    - apps/women-portal/src/app/layout.tsx
    - apps/women-portal/src/app/globals.css
    - apps/women-portal/next.config.ts
    - apps/women-portal/package.json
    - apps/university-portal/src/app/layout.tsx
    - apps/university-portal/next.config.ts
    - apps/university-portal/package.json

key-decisions:
  - "Cookie-based locale (NEXT_LOCALE) for next-intl instead of URL-prefix routing -- simpler, no path rewriting"
  - "Tag uses dismissible+onDismiss API (not onRemove) -- matched existing @glimmora/ui Tag component"
  - "MSW handlers migrated from flat handlers.ts to handlers/ directory (auth, onboarding, canary) -- scalable for future mock endpoints"
  - "lucide-react added as direct dependency to women-portal for Shield/CheckCircle icons"

patterns-established:
  - "Pre-auth route group: app/(pre-auth)/ for all unauthenticated pages"
  - "Zustand stores in src/store/ with persist middleware for client state"
  - "MSW handler modules in src/lib/msw/handlers/ with barrel index"
  - "PrivacyBanner pattern: reusable privacy guarantee on every sensitive step"
  - "i18n pattern: useTranslations('namespace') for page-level translations, separate tCommon for shared strings"

# Metrics
duration: 8min
completed: 2026-02-26
---

# Plan 03-01: Foundation -- Types + i18n + Women's Portal Pre-Auth/Onboarding Summary

**14 new domain types in @glimmora/types, cookie-based next-intl i18n with RTL (en/ur/ar) in both portals, and complete Women's Portal pre-auth flow: language selector first, WhatsApp-style welcome, email-only registration, 4-step onboarding with PrivacyBanner on every step**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-26T13:11:34Z
- **Completed:** 2026-02-26T13:20:22Z
- **Tasks:** 3/3
- **Files modified:** 55

## Accomplishments

- Extended @glimmora/types with 14 new types across 7 files (Earning, EarningsSummary, Message, MessageThread, OnboardingStep, OnboardingProgress, StudentProfile, AlumniProfile, GovernorMetrics, CohortTrend, TaskCategory, NotificationPreference, DeviceInfo, DeviceInfo)
- Configured cookie-based next-intl i18n in both women-portal and university-portal with dynamic RTL support (dir attribute switches on Urdu/Arabic locale)
- Built complete Women's Portal pre-auth flow: language selector as absolute first interaction at root URL, WhatsApp-style conversational welcome screen, email+password-only registration (no phone, no social login)
- Built 4-step onboarding wizard (profile -> devices -> skills -> activation) with PrivacyBanner visible on every step confirming: no public profiles, no leaderboards, no peer comparison

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend @glimmora/types + Install next-intl** - `eb87a2f` (chore)
2. **Task 2: Pre-auth flow (language selector, welcome, registration)** - `5eefacb` (feat)
3. **Task 3: 4-step onboarding wizard with PrivacyBanner** - `f2d77be` (feat)

## Files Created/Modified

### Types (7 new files)
- `packages/types/src/earnings.ts` - Earning, EarningsSummary types
- `packages/types/src/message.ts` - Message, MessageThread types
- `packages/types/src/onboarding.ts` - OnboardingStep, OnboardingProgress types
- `packages/types/src/student.ts` - StudentProfile, AlumniProfile types
- `packages/types/src/governor.ts` - GovernorMetrics, CohortTrend, TaskCategory types
- `packages/types/src/notification.ts` - NotificationPreference type
- `packages/types/src/device.ts` - DeviceInfo type

### i18n Configuration
- `apps/women-portal/src/i18n/request.ts` - Cookie-based locale resolver
- `apps/women-portal/src/messages/{en,ur,ar}.json` - Full translation files
- `apps/university-portal/src/i18n/request.ts` - Same resolver pattern
- `apps/university-portal/src/messages/{en,ur,ar}.json` - University-specific translations

### Women's Portal Pre-Auth Components
- `apps/women-portal/src/components/language-selector/language-selector.tsx` - First interactive element
- `apps/women-portal/src/components/welcome-screen/welcome-screen.tsx` - WhatsApp-style chat bubble UI
- `apps/women-portal/src/components/registration-form/registration-form.tsx` - Email+password form

### Women's Portal Onboarding Components
- `apps/women-portal/src/components/onboarding/privacy-banner.tsx` - Privacy guarantee banner
- `apps/women-portal/src/components/onboarding/profile-step.tsx` - Step 1: display name, name, bio
- `apps/women-portal/src/components/onboarding/devices-step.tsx` - Step 2: device type, internet stability
- `apps/women-portal/src/components/onboarding/skills-step.tsx` - Step 3: skill selection with chips
- `apps/women-portal/src/components/onboarding/activation-step.tsx` - Step 4: completion + next steps

### Stores & MSW
- `apps/women-portal/src/store/auth-store.ts` - Auth state (Zustand)
- `apps/women-portal/src/store/language-store.ts` - Language persistence (Zustand + persist)
- `apps/women-portal/src/lib/msw/handlers/auth.ts` - Register/login/logout mock handlers
- `apps/women-portal/src/lib/msw/handlers/onboarding.ts` - Onboarding progress mock handlers
- `apps/women-portal/src/lib/msw/factories/user.ts` - Mock user/contributor factories

## Decisions Made

- **Cookie-based locale:** Used `NEXT_LOCALE` cookie instead of URL-prefix routing for simpler i18n without path rewriting
- **Tag API adaptation:** Plan specified `onRemove` but actual @glimmora/ui Tag uses `dismissible` + `onDismiss` -- adapted accordingly
- **MSW directory refactor:** Migrated flat handlers.ts to handlers/ directory with separate modules for auth, onboarding, and canary -- enables clean scaling
- **lucide-react direct dep:** Added as direct dependency to women-portal since it's not transitively available from @glimmora/ui in pnpm strict mode

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added lucide-react as direct dependency**
- **Found during:** Task 3 (PrivacyBanner needs Shield icon)
- **Issue:** lucide-react is a dep of @glimmora/ui but not hoisted to women-portal in pnpm strict mode
- **Fix:** Added lucide-react to women-portal package.json
- **Files modified:** apps/women-portal/package.json, pnpm-lock.yaml
- **Committed in:** eb87a2f (Task 1 commit)

**2. [Rule 1 - Bug] Adapted Tag component API from plan's onRemove to actual onDismiss**
- **Found during:** Task 3 (SkillsStep component)
- **Issue:** Plan specified `onRemove` prop but actual Tag component uses `dismissible` + `onDismiss`
- **Fix:** Used `dismissible onDismiss={() => toggleSkill(skill)}` matching actual API
- **Files modified:** apps/women-portal/src/components/onboarding/skills-step.tsx
- **Committed in:** f2d77be (Task 3 commit)

**3. [Rule 1 - Bug] Fixed User type property alignment in MSW factories**
- **Found during:** Task 2 (MSW user factory)
- **Issue:** Plan's mock user used `role: 'contributor'` and minimal fields, but actual User type requires `isActive`, `updatedAt`, `role: 'woman-contributor'`
- **Fix:** Aligned factory with actual User/ContributorProfile interfaces from @glimmora/types
- **Files modified:** apps/women-portal/src/lib/msw/factories/user.ts
- **Committed in:** 5eefacb (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (2 bug fixes, 1 blocking)
**Impact on plan:** All auto-fixes necessary for type safety and correct operation. No scope creep.

## Issues Encountered

- @glimmora/types package has no `type-check` script -- verified types indirectly through women-portal and university-portal type-checks which import the types

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- i18n foundation ready for all Phase 3 plans (03-02 through 03-05)
- Pre-auth flow complete, dashboard pages can build on top of (pre-auth) -> authenticated transition
- PrivacyBanner pattern established for reuse in any contributor-facing flow
- MSW handler directory structure ready for additional mock endpoints
- University portal has i18n configured but awaits its own page components (03-02)

---
*Phase: 03-womens-portal-university-portal*
*Completed: 2026-02-26*
