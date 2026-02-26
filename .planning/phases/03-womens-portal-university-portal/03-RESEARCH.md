# Phase 3: Women's Portal + University Portal - Research

**Researched:** 2026-02-26
**Domain:** Next.js 15 App Router multi-portal with i18n/RTL, MSW mock data, PDF export, multi-step onboarding
**Confidence:** HIGH (all critical recommendations verified against official docs)

## Summary

Phase 3 builds two full contributor portals (Women's Portal on port 3001, University Portal on port 3002) from the existing canary pages into production-ready flows. The portals share a substantial component library (`@glimmora/ui` DS-01..DS-47) and type system (`@glimmora/types`), but diverge in onboarding flows, privacy constraints, and persona-specific features.

The primary technical challenges are: (1) i18n with RTL support as the FIRST interaction, requiring `next-intl` in cookie-based mode (no locale prefix in URLs) so language selection can happen before any routing, (2) a large MSW mock data layer (34 requirements generating ~15 API endpoints per portal), (3) PDF export for PoDL credentials using `@react-pdf/renderer` v4.3+ which is React 19 compatible, and (4) multi-step onboarding wizards using the existing `Stepper` component with route-based steps for bookmarkability.

**Primary recommendation:** Use `next-intl` v4.8 in "without-i18n-routing" mode (cookie-based locale), Tailwind v4's built-in logical properties for RTL, `@react-pdf/renderer` v4.3 for PDF export, and route-group-based App Router structure separating `(pre-auth)` from `(app)` layouts.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-intl | ^4.8.3 | i18n + RTL + translations | De facto Next.js i18n solution; Server Component support; ~2KB client bundle; cookie-based locale mode avoids URL prefix requirement |
| @react-pdf/renderer | ^4.3.2 | PoDL PDF credential export | React 19 compatible since v4.1.0; client-side PDF generation; styled with React components |
| zustand | ^5.0.11 | Client state (auth, onboarding, language) | Already installed; persist middleware for localStorage; v5 persist bug fixed in v5.0.10 |
| msw | ^2.12.10 | Mock API layer | Already installed; browser + node handlers pattern established |
| @tanstack/react-query | ^5.90.21 | Server state / data fetching | Already installed; pairs with MSW for realistic data fetching |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-pdf/renderer | ^4.3.2 | PDF generation | UP-05 PoDL export only; client-side, lazy-loaded |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| next-intl (cookie mode) | next-intl (routing mode with [locale]) | Routing mode adds /en, /ur, /ar URL prefixes; cookie mode keeps clean URLs and allows language selection as a true "first interaction" without URL changes; cookie mode is simpler for this use case |
| next-intl | react-i18next / i18next | react-i18next lacks native Next.js App Router integration and Server Component support; requires more boilerplate |
| @react-pdf/renderer | jspdf | jspdf is imperative (canvas-based); @react-pdf/renderer uses declarative React components matching the codebase pattern; better for styled credential documents |
| @react-pdf/renderer | window.print() CSS | Print-to-PDF is zero-dependency but gives less control over layout, fonts, and branding; PoDL credentials need precise, branded formatting |

**Installation (Women's Portal):**
```bash
cd apps/women-portal
pnpm add next-intl
```

**Installation (University Portal):**
```bash
cd apps/university-portal
pnpm add next-intl @react-pdf/renderer
```

## Architecture Patterns

### Recommended Project Structure — Women's Portal

```
apps/women-portal/src/
├── app/
│   ├── layout.tsx                    # Root layout: html lang/dir, NextIntlClientProvider
│   ├── globals.css                   # Tailwind theme import (exists)
│   ├── (pre-auth)/                   # Route group: NO sidebar/AppShell
│   │   ├── layout.tsx                # Minimal layout for pre-auth pages
│   │   ├── page.tsx                  # Language selector (FIRST screen — redirect target)
│   │   ├── welcome/page.tsx          # WhatsApp-style welcome (WP-02)
│   │   ├── register/page.tsx         # Email + password registration (WP-03)
│   │   └── onboarding/
│   │       ├── layout.tsx            # Stepper layout wrapper
│   │       ├── profile/page.tsx      # Step 1: Basic Profile (WP-04)
│   │       ├── devices/page.tsx      # Step 2: Devices & Connectivity (WP-04)
│   │       ├── skills/page.tsx       # Step 3: Skill Assessment (WP-04)
│   │       └── activation/page.tsx   # Step 4: Activation Confirmation (WP-04)
│   └── (app)/                        # Route group: AppShell + Sidebar
│       ├── layout.tsx                # AppShell layout with Sidebar navigation
│       ├── dashboard/page.tsx        # WP-06, WP-07, WP-08
│       ├── tasks/
│       │   ├── page.tsx              # Task list with tabs (WP-09)
│       │   └── [taskId]/
│       │       ├── page.tsx          # Task detail (WP-10)
│       │       ├── submit/page.tsx   # Evidence submission (WP-11)
│       │       └── rework/page.tsx   # Rework view (WP-13)
│       ├── submissions/page.tsx      # Submission status tracking (WP-12)
│       ├── skills/page.tsx           # Private Skill Genome (WP-14, WP-15)
│       ├── earnings/page.tsx         # Earnings dashboard (WP-16)
│       ├── credentials/page.tsx      # PoDL credentials (WP-17)
│       ├── messages/page.tsx         # Community Support messages (WP-18)
│       └── settings/
│           ├── page.tsx              # Profile settings (WP-19)
│           ├── privacy/page.tsx      # Privacy settings (WP-20)
│           ├── notifications/page.tsx # Notification prefs (WP-21)
│           └── devices/page.tsx      # Device/connectivity update (WP-22)
├── components/
│   ├── providers/
│   │   ├── Providers.tsx             # Existing: MSW + Query
│   │   ├── MSWProvider.tsx           # Existing
│   │   └── QueryProvider.tsx         # Existing
│   ├── language-selector/            # WP-01: Language selection component
│   ├── welcome-screen/              # WP-02: WhatsApp-style welcome
│   ├── registration-form/           # WP-03: Registration form
│   ├── onboarding/                  # WP-04: Step content components
│   ├── dashboard/                   # WP-06..08: Dashboard widgets
│   ├── tasks/                       # WP-09..13: Task list, detail, submission
│   ├── earnings/                    # WP-16: Earnings components
│   └── settings/                    # WP-19..22: Settings forms
├── i18n/
│   └── request.ts                    # next-intl request config (cookie-based locale)
├── messages/
│   ├── en.json                       # English translations
│   ├── ur.json                       # Urdu translations
│   └── ar.json                       # Arabic translations
├── lib/
│   └── msw/
│       ├── browser.ts                # Existing
│       ├── server.ts                 # Existing
│       ├── handlers.ts               # Expand: all WP endpoints
│       ├── handlers/                 # Handler files split by domain
│       │   ├── auth.ts
│       │   ├── tasks.ts
│       │   ├── evidence.ts
│       │   ├── earnings.ts
│       │   ├── skills.ts
│       │   ├── podl.ts
│       │   ├── messages.ts
│       │   ├── profile.ts
│       │   └── apg.ts
│       └── factories/                # Mock data factories
│           ├── user.ts
│           ├── task.ts
│           ├── evidence.ts
│           ├── earnings.ts
│           └── common.ts
└── store/
    ├── app-store.ts                  # Existing: sidebar state
    ├── auth-store.ts                 # Auth state + onboarding progress
    └── language-store.ts             # Language preference (persisted to cookie)
```

### Recommended Project Structure — University Portal

```
apps/university-portal/src/
├── app/
│   ├── layout.tsx                    # Root layout with next-intl (optional i18n)
│   ├── (pre-auth)/
│   │   ├── page.tsx                  # Landing / login
│   │   ├── register/page.tsx         # UP-01: Student registration
│   │   └── onboarding/
│   │       └── [step]/page.tsx       # UP-01: Student onboarding steps
│   └── (app)/
│       ├── layout.tsx                # AppShell layout
│       ├── dashboard/page.tsx        # UP-02: Student dashboard
│       ├── tasks/
│       │   ├── page.tsx              # UP-03: Discover/accept tasks
│       │   └── [taskId]/
│       │       ├── page.tsx          # Task detail
│       │       └── submit/page.tsx   # UP-04: Evidence submission
│       ├── credentials/
│       │   ├── page.tsx              # UP-05: PoDL credentials list
│       │   └── [credentialId]/
│       │       └── page.tsx          # UP-05: Single credential + PDF export
│       ├── team/page.tsx             # UP-06: Anonymous team view
│       ├── skills/page.tsx           # UP-07: Private Skill Genome
│       ├── alumni/
│       │   └── reactivate/page.tsx   # UP-08, UP-09: Alumni reactivation
│       └── governor/                 # UP-10..12: Governor dashboard
│           ├── layout.tsx            # Governor-specific layout
│           ├── page.tsx              # UP-10: Aggregated metrics
│           ├── cohorts/page.tsx      # UP-11: Anonymized cohort trends
│           └── categories/page.tsx   # UP-12: Task category config
├── components/
│   ├── providers/                    # Same pattern as Women's Portal
│   ├── credentials/
│   │   └── podl-pdf-document.tsx     # UP-05: React-PDF document component
│   ├── governor/                     # UP-10..12: Governor dashboard widgets
│   └── team/                         # UP-06: Anonymous team components
├── lib/
│   └── msw/
│       ├── handlers/
│       │   ├── auth.ts
│       │   ├── tasks.ts
│       │   ├── evidence.ts
│       │   ├── credentials.ts
│       │   ├── team.ts
│       │   ├── skills.ts
│       │   ├── alumni.ts
│       │   └── governor.ts
│       └── factories/
└── store/
    ├── app-store.ts
    └── auth-store.ts
```

### Pattern 1: Cookie-Based i18n with next-intl (No URL Prefix)

**What:** Language selection stored in cookie, no /en/ or /ur/ URL prefix. Language selection is the FIRST interaction.
**When to use:** When language must be selected before any routing occurs and URLs should remain clean.

**i18n/request.ts:**
```typescript
// Source: https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing
import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const store = await cookies()
  const locale = store.get('NEXT_LOCALE')?.value || 'en'

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

**next.config.ts (updated):**
```typescript
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  transpilePackages: ['@glimmora/ui', '@glimmora/types', '@glimmora/config'],
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
```

**Root layout.tsx (updated for RTL):**
```typescript
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { Providers } from '@/components/providers/Providers'
import './globals.css'

const RTL_LOCALES = ['ur', 'ar']

export const metadata: Metadata = {
  title: "Women's Portal | GlimmoraTeam",
  description: 'GlimmoraTeam contributor portal for women',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir}>
      <body className="font-body bg-bg-app text-text-body">
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### Pattern 2: Language Selection as First Interaction

**What:** The root page.tsx redirects to language selection if no locale cookie exists. Language selection sets the cookie and triggers a refresh.
**When to use:** WP-01 requirement — language MUST be the first interactive element.

```typescript
// app/(pre-auth)/page.tsx — Language Selector Page
'use client'
import { useRouter } from 'next/navigation'

const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
] as const

export default function LanguageSelectPage() {
  const router = useRouter()

  function selectLanguage(code: string) {
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`
    router.refresh()      // Re-renders with new locale
    router.push('/welcome')
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      {/* Show ALL languages simultaneously — each in its own script */}
      {LANGUAGES.map((lang) => (
        <button key={lang.code} onClick={() => selectLanguage(lang.code)}>
          <span className="text-2xl">{lang.nativeLabel}</span>
          <span className="text-sm">{lang.label}</span>
        </button>
      ))}
    </main>
  )
}
```

### Pattern 3: RTL Layout with Tailwind v4 Logical Properties

**What:** Tailwind v4 uses CSS logical properties by default. `mx-*` maps to `margin-inline`, `ms-*` maps to `margin-inline-start`, etc. Setting `dir="rtl"` on `<html>` automatically flips layouts.
**When to use:** All portal pages that need to support Urdu/Arabic RTL.

```html
<!-- These work automatically in both LTR and RTL -->
<div dir="ltr">
  <div class="ms-8">margin on LEFT (start)</div>
  <div class="me-8">margin on RIGHT (end)</div>
</div>
<div dir="rtl">
  <div class="ms-8">margin on RIGHT (start)</div>
  <div class="me-8">margin on LEFT (end)</div>
</div>
```

**Tailwind v4 built-in logical utilities (no plugin needed):**
| Utility | CSS Property | LTR | RTL |
|---------|-------------|-----|-----|
| `ms-*` | `margin-inline-start` | left | right |
| `me-*` | `margin-inline-end` | right | left |
| `ps-*` | `padding-inline-start` | left | right |
| `pe-*` | `padding-inline-end` | right | left |
| `mx-*` | `margin-inline` | both | both |
| `px-*` | `padding-inline` | both | both |
| `start-*` | `inset-inline-start` | left | right |
| `end-*` | `inset-inline-end` | right | left |
| `text-start` | `text-align: start` | left | right |
| `text-end` | `text-align: end` | right | left |
| `rounded-s-*` | `border-start-*-radius` | left | right |
| `rounded-e-*` | `border-end-*-radius` | right | left |
| `border-s-*` | `border-inline-start-width` | left | right |
| `border-e-*` | `border-inline-end-width` | right | left |

**Key insight:** Tailwind v4 already uses logical properties for `mx-*`, `px-*`, and similar utilities. The main action items are: (1) audit existing components that use physical-only utilities (`ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right`) and replace with logical equivalents (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`), and (2) set `dir` attribute on `<html>` based on locale.

### Pattern 4: Route-Group-Based Layout Separation

**What:** Next.js App Router route groups `(pre-auth)` and `(app)` share the same root layout but have different nested layouts.
**When to use:** Pre-auth pages (language, welcome, register, onboarding) need a minimal layout. Authenticated pages need AppShell with Sidebar.

```
app/
├── layout.tsx              # Root: html, body, Providers, NextIntlClientProvider
├── (pre-auth)/
│   ├── layout.tsx          # Minimal: centered content, no sidebar
│   ├── page.tsx            # Language selector (root of pre-auth)
│   ├── welcome/page.tsx    # WhatsApp-style welcome
│   └── ...
└── (app)/
    ├── layout.tsx          # AppShell + Sidebar + TopBar
    ├── dashboard/page.tsx
    └── ...
```

Route groups do NOT create URL segments. `/welcome` works, not `/(pre-auth)/welcome`.

### Pattern 5: MSW Handler Organization

**What:** Split handlers by domain, aggregate in index, one factory per entity type.
**When to use:** When a portal has many endpoints (this phase: ~15 per portal).

```typescript
// lib/msw/handlers/index.ts
import { authHandlers } from './auth'
import { taskHandlers } from './tasks'
import { evidenceHandlers } from './evidence'
import { earningsHandlers } from './earnings'
// ...

export const handlers = [
  ...authHandlers,
  ...taskHandlers,
  ...evidenceHandlers,
  ...earningsHandlers,
  // ...
]

// lib/msw/factories/task.ts
import type { Task } from '@glimmora/types'

let taskIdCounter = 1

export function createMockTask(overrides: Partial<Task> = {}): Task {
  const id = `task-${String(taskIdCounter++).padStart(3, '0')}`
  return {
    id,
    projectId: 'proj-001',
    title: `Mock Task ${id}`,
    description: 'A mock task for development',
    type: 'development',
    status: 'open',
    priority: 'medium',
    skillRequirements: ['react', 'typescript'],
    estimatedHours: 8,
    dueDate: '2026-04-01T00:00:00Z',
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-20T10:00:00Z',
    ...overrides,
  }
}
```

### Pattern 6: PoDL PDF Export with @react-pdf/renderer

**What:** Declarative PDF document component, lazy-loaded on click, client-side only.
**When to use:** UP-05 PoDL credential PDF export.

```typescript
// components/credentials/podl-pdf-document.tsx
'use client'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { PoDLCredential } from '@glimmora/types'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { fontSize: 24, marginBottom: 20, color: '#A0614A' },
  // ... more styles
})

export function PoDLPDFDocument({ credential }: { credential: PoDLCredential }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{credential.title}</Text>
        {/* ... credential details ... */}
      </Page>
    </Document>
  )
}

// Usage in page — lazy-loaded:
// const { pdf } = await import('@react-pdf/renderer')
// const blob = await pdf(<PoDLPDFDocument credential={credential} />).toBlob()
// saveAs(blob, `podl-${credential.id}.pdf`)
```

**Critical:** `@react-pdf/renderer` must be dynamically imported and only used in 'use client' components. It cannot run in Server Components.

### Pattern 7: Onboarding Wizard with Route-Based Steps

**What:** Each onboarding step is a separate route under `/onboarding/`, using the existing `Stepper` from `@glimmora/ui` in a shared layout.
**When to use:** WP-04 4-step onboarding, UP-01 student onboarding.

```typescript
// app/(pre-auth)/onboarding/layout.tsx
'use client'
import { usePathname } from 'next/navigation'
import { Stepper } from '@glimmora/ui'

const STEPS = [
  { label: 'Profile', description: 'Basic info' },
  { label: 'Devices', description: 'Your setup' },
  { label: 'Skills', description: 'What you know' },
  { label: 'Activation', description: 'Welcome!' },
]

const STEP_PATHS = ['/onboarding/profile', '/onboarding/devices', '/onboarding/skills', '/onboarding/activation']

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentStep = STEP_PATHS.findIndex(p => pathname.includes(p))

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Stepper steps={STEPS} currentStep={Math.max(0, currentStep)} className="mb-8" />
      {children}
    </div>
  )
}
```

**Why route-based over in-memory steps:** Bookmarkable, back-button works, progress survives refresh, cleaner Server Component boundaries.

### Anti-Patterns to Avoid

- **Do NOT use `[locale]` route segment for Women's Portal.** The UX requirement is that language selection is the FIRST interaction — before any page content. Using `[locale]` means the user must navigate to `/en/` first, which defeats the purpose. Cookie-based locale with `next-intl` "without-i18n-routing" mode is correct.
- **Do NOT store language preference only in Zustand.** The cookie must be the source of truth because `next-intl`'s `getRequestConfig` runs server-side and reads from cookies. Zustand can mirror it for client convenience, but the cookie is canonical.
- **Do NOT use physical CSS properties (`ml-*`, `mr-*`, `left-*`, `right-*`) in new components.** Always use logical properties (`ms-*`, `me-*`, `start-*`, `end-*`) for RTL compatibility.
- **Do NOT add contributor identity to Evidence types.** The existing `Evidence` interface in `@glimmora/types` includes `contributorId` (needed for data association), but the `EvidenceViewer` UI component deliberately omits identity display. Evidence submission forms must never show who submitted what to reviewers.
- **Do NOT use `flex-row-reverse` for RTL.** Flexbox `row` already respects `dir="rtl"` — items flow right-to-left automatically. Adding `flex-row-reverse` would double-reverse and break the layout.
- **Do NOT create a custom i18n solution.** `next-intl` handles Server Component rendering, message extraction, plurals, and interpolation. Custom solutions will miss edge cases.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| i18n / translations | Custom key-lookup with JSON files | `next-intl` v4.8 | Handles Server Components, plurals, interpolation, date/number formatting, typed translations |
| RTL layout flipping | Manual CSS direction overrides | Tailwind v4 logical properties + `dir` attribute | Built into the framework; no plugin needed in v4 |
| PDF generation | Canvas-based rendering or server-side | `@react-pdf/renderer` v4.3 | React component model; client-side; branded output |
| Multi-step form wizard | Custom step state machine | Route-based steps + `Stepper` from `@glimmora/ui` | Bookmarkable, back-button compatible, SSR-friendly |
| File upload with drag-and-drop | Custom drag handlers | `FileUpload` from `@glimmora/ui` (DS-24) | Already built with validation, size limits, file list |
| Mock data seeding | Inline JSON in handlers | Factory functions with overrides pattern | Consistent, composable, DRY |
| Client state persistence | Custom localStorage wrapper | Zustand `persist` middleware | Handles hydration, SSR, serialization; fixed in v5.0.10 |

**Key insight:** The `@glimmora/ui` design system already provides most UI primitives needed. Phase 3's job is composing them into page-level features, not building new primitives. The only new installations are `next-intl` (both portals) and `@react-pdf/renderer` (university portal only).

## Common Pitfalls

### Pitfall 1: Hydration Mismatch with Language/RTL

**What goes wrong:** Server renders `lang="en" dir="ltr"` but client has a different cookie value, causing hydration mismatch.
**Why it happens:** Cookie reads in `getRequestConfig` happen server-side. If the client sets a cookie and doesn't trigger a full page refresh, the server-rendered HTML will mismatch.
**How to avoid:** Always call `router.refresh()` after setting the locale cookie (this triggers a full server re-render). Never update locale client-side without a server round-trip.
**Warning signs:** React hydration warnings in console; content briefly showing in wrong language.

### Pitfall 2: Zustand Persist + SSR Flash

**What goes wrong:** Initial server render shows default state (e.g., `onboardingCompleted: false`), then client hydrates with persisted state from localStorage, causing a flash.
**Why it happens:** `localStorage` is not available during SSR. Zustand `persist` middleware restores state asynchronously after mount.
**How to avoid:** Use Zustand's `onRehydrateStorage` callback or a `hasHydrated` flag. Don't render auth-dependent content until hydration is complete. Alternatively, gate auth state on the server via cookies (not Zustand).
**Warning signs:** Brief flash of login screen before dashboard; content jumping on initial load.

### Pitfall 3: @react-pdf/renderer in Server Components

**What goes wrong:** Import of `@react-pdf/renderer` fails in Server Components because it requires browser APIs.
**Why it happens:** The library depends on browser-only APIs and cannot run in Node.js Server Components.
**How to avoid:** Always use dynamic import (`await import('@react-pdf/renderer')`) inside 'use client' components. Never import at the top level of a Server Component.
**Warning signs:** Build errors mentioning `document` or `window` is not defined.

### Pitfall 4: Physical CSS Properties Breaking RTL

**What goes wrong:** `ml-4` adds left margin in both LTR and RTL modes. In RTL, this should be right margin.
**Why it happens:** `ml-*` maps to `margin-left` (physical property), not `margin-inline-start` (logical property).
**How to avoid:** Use `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end` everywhere. Audit existing `@glimmora/ui` components for physical properties (the Sidebar uses `border-l-2` which should become `border-s-2` for RTL).
**Warning signs:** Sidebar border appearing on wrong side; margins inverted in RTL; text aligned to wrong edge.

### Pitfall 5: MSW Worker Not Starting Before Fetch

**What goes wrong:** API calls fire before MSW service worker is initialized, returning 404s.
**Why it happens:** MSWProvider sets `ready: true` after `worker.start()`, but `@tanstack/react-query` queries may fire before that.
**How to avoid:** The existing MSWProvider returns `null` until ready (confirmed in codebase). Keep this pattern. Ensure QueryProvider is nested INSIDE MSWProvider (already the case).
**Warning signs:** Failed API calls on first load; data appearing only after refresh.

### Pitfall 6: next-intl Plugin Must Wrap Next Config

**What goes wrong:** Translations not loading; `getTranslations()` returns undefined.
**Why it happens:** `next.config.ts` must be wrapped with `createNextIntlPlugin()`. The plugin configures the Webpack/Turbopack resolver for message files.
**How to avoid:** Always apply `const withNextIntl = createNextIntlPlugin(); export default withNextIntl(nextConfig)` in `next.config.ts`.
**Warning signs:** Build warnings about missing modules; translations showing keys instead of values.

### Pitfall 7: Evidence Submission — Blind Review Leakage

**What goes wrong:** Contributor identity leaks into evidence submission flow, breaking blind review.
**Why it happens:** Developer accidentally passes contributor name/avatar to evidence display components.
**How to avoid:** The `EvidenceViewer` component in `@glimmora/ui` deliberately takes no identity props. The `Evidence` type in `@glimmora/types` has `contributorId` for data binding, but submission forms should never expose this to the reviewer-facing UI. Enforce via code review.
**Warning signs:** Any name/avatar appearing near evidence displays.

## Code Examples

### Language Selector Component (WP-01)

```typescript
// Source: verified against next-intl docs + UX flow 06
'use client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface Language {
  code: string
  nativeLabel: string
  englishLabel: string
  dir: 'ltr' | 'rtl'
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', nativeLabel: 'English', englishLabel: 'English', dir: 'ltr' },
  { code: 'ur', nativeLabel: 'اردو', englishLabel: 'Urdu', dir: 'rtl' },
  { code: 'ar', nativeLabel: 'العربية', englishLabel: 'Arabic', dir: 'rtl' },
]

export function LanguageSelector() {
  const router = useRouter()

  function handleSelect(code: string) {
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`
    router.refresh()
    router.push('/welcome')
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleSelect(lang.code)}
          dir={lang.dir}
          className="w-64 rounded-card border border-border bg-bg-card p-4 text-center shadow-card hover:shadow-card-hover transition-shadow"
        >
          <span className="block text-2xl font-display text-text-heading">
            {lang.nativeLabel}
          </span>
          {lang.code !== 'en' && (
            <span className="block text-sm font-body text-text-caption mt-1">
              {lang.englishLabel}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
```

### Evidence Submission Form (WP-11, UP-04)

```typescript
// Source: Based on existing EvidenceViewer, FileUpload, and Evidence types
'use client'
import { useState } from 'react'
import { FileUpload, Tabs, TabsList, TabsTrigger, TabsContent, Button, Textarea, TextInput } from '@glimmora/ui'
import type { EvidenceType } from '@glimmora/types'

interface EvidenceItem {
  type: EvidenceType
  title: string
  content: string
  files?: File[]
}

export function EvidenceSubmissionForm({ taskId }: { taskId: string }) {
  const [items, setItems] = useState<EvidenceItem[]>([])
  const [activeType, setActiveType] = useState<EvidenceType>('file')

  // Multiple evidence items per submission
  function addItem(item: EvidenceItem) {
    setItems(prev => [...prev, item])
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeType} onValueChange={(v) => setActiveType(v as EvidenceType)}>
        <TabsList>
          <TabsTrigger value="file">File Upload</TabsTrigger>
          <TabsTrigger value="url">URL Link</TabsTrigger>
          <TabsTrigger value="code">Code Snippet</TabsTrigger>
          <TabsTrigger value="video-url">Video URL</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <FileUpload accept=".pdf,.doc,.docx,.zip,.png,.jpg" maxFiles={5} maxSizeMB={10} />
        </TabsContent>
        <TabsContent value="url">
          <TextInput label="URL" placeholder="https://..." />
        </TabsContent>
        <TabsContent value="code">
          <Textarea label="Code Snippet" placeholder="Paste your code here..." className="font-mono" />
        </TabsContent>
        {/* ... other tab content ... */}
      </Tabs>

      <Button variant="primary">Submit Evidence</Button>
    </div>
  )
}
```

### Zustand Auth Store with Persist

```typescript
// Source: Zustand v5 docs + persist middleware pattern
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ContributorProfile } from '@glimmora/types'

interface AuthState {
  user: ContributorProfile | null
  isAuthenticated: boolean
  onboardingStep: number       // 0-4 for WP-04
  onboardingCompleted: boolean

  setUser: (user: ContributorProfile) => void
  setOnboardingStep: (step: number) => void
  completeOnboarding: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      onboardingStep: 0,
      onboardingCompleted: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      completeOnboarding: () => set({ onboardingCompleted: true, onboardingStep: 4 }),
      logout: () => set({ user: null, isAuthenticated: false, onboardingStep: 0, onboardingCompleted: false }),
    }),
    {
      name: 'glimmora-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

## @glimmora/types Gaps Analysis

The existing types cover Task, Evidence, PoDL, SkillGenome, User, Project, SOW, API. The following types are **missing** and needed for Phase 3:

### New Types Required

```typescript
// --- Earnings (WP-16, UP-02) ---
export type EarningsStatus = 'pending' | 'released' | 'withdrawn'

export interface Earning {
  id: string
  taskId: string
  projectId: string
  amount: number
  currency: string           // 'USD' | 'PKR' etc.
  status: EarningsStatus
  earnedAt: string
  releasedAt?: string
  withdrawnAt?: string
}

export interface EarningsSummary {
  pending: number
  released: number
  total: number
  currency: string
  withdrawalHistory: Earning[]
}

// --- Messages (WP-18) ---
export type MessageRole = 'contributor' | 'support-lead'

export interface Message {
  id: string
  threadId: string
  senderRole: MessageRole    // NOT sender name — privacy
  content: string
  sentAt: string
  readAt?: string
}

export interface MessageThread {
  id: string
  contributorId: string
  supportLeadId: string
  subject: string
  lastMessageAt: string
  unreadCount: number
  messages: Message[]
}

// --- Onboarding (WP-04, UP-01) ---
export type OnboardingStepStatus = 'pending' | 'in-progress' | 'completed' | 'skipped'

export interface OnboardingStep {
  id: string
  stepNumber: number
  label: string
  status: OnboardingStepStatus
  completedAt?: string
}

export interface OnboardingProgress {
  userId: string
  steps: OnboardingStep[]
  currentStep: number
  isComplete: boolean
}

// --- University Profile (UP-01) ---
export interface StudentProfile extends ContributorProfile {
  role: Extract<UserRole, 'student-contributor'>
  universityEmail: string
  studentId: string
  universityName: string
  academicYear: string          // e.g., '3rd Year', 'Final Year'
  degreeProgram: string
  graduationYear?: string
  emailVerified: boolean
}

export interface AlumniProfile extends ContributorProfile {
  role: Extract<UserRole, 'alumni-contributor'>
  universityName: string
  degreeProgram: string
  graduationYear: string
  careerContext?: string         // Updated career context on reactivation
  reactivatedAt?: string
  previousPoDLCount: number     // Preserved count from student era
}

// --- Governor Metrics (UP-10, UP-11, UP-12) ---
export interface GovernorMetrics {
  institutionId: string
  activeContributors: number       // Count only — NO names
  totalTasksCompleted: number
  averageCompletionRate: number    // Percentage
  totalPoDLsIssued: number
  averageSkillGrowth: number       // Percentage
  periodStart: string
  periodEnd: string
}

export interface CohortTrend {
  cohortId: string
  cohortLabel: string              // e.g., "2024 Batch" — NOT individual names
  totalContributors: number
  activePercentage: number
  completionRate: number
  topSkillCategories: string[]     // Categories, not individual skills
  averageEarnings: number          // Aggregate — NOT individual
}

export interface TaskCategory {
  id: string
  name: string
  description: string
  isActive: boolean
  taskCount: number
  institutionId: string
}

// --- Notification Preferences (WP-21) ---
export interface NotificationPreference {
  channel: 'in-app' | 'email' | 'whatsapp'
  category: 'task-updates' | 'payment' | 'community' | 'system'
  enabled: boolean
}

// --- Device Info (WP-04 step 2, WP-22) ---
export interface DeviceInfo {
  primaryDevice: 'desktop' | 'laptop' | 'tablet' | 'smartphone'
  operatingSystem: string
  internetSpeed: 'slow' | 'moderate' | 'fast'
  hasWebcam: boolean
  availableHoursPerWeek: number
}
```

### Existing Types That Are Sufficient

- `Task` — covers WP-09, WP-10, UP-03 (has `apgGuidance`, `skillRequirements`, `status`, `dueDate`)
- `Evidence` / `EvidencePack` — covers WP-11, WP-12, WP-13, UP-04 (has `reworkItems`, `reviewerFeedback`, multi-type)
- `PoDL` / `PoDLCredential` — covers WP-17, UP-05 (has `exportUrl`, `pdfGeneratedAt`)
- `SkillGenome` / `SkillNode` — covers WP-14, WP-15, UP-07
- `APGActivity` — covers WP-07
- `ContributorProfile` — covers basic profile for WP-19 (has `languagePreference`, `onboardingCompleted`)
- `APIResponse` — covers pagination for all list endpoints

## MSW Mock Data Requirements

### Women's Portal Endpoints

| Endpoint | Method | Requirement | Mock Data |
|----------|--------|-------------|-----------|
| `/api/auth/register` | POST | WP-03 | Accept email+password, return ContributorProfile |
| `/api/auth/login` | POST | WP-03 | Validate mock credentials |
| `/api/onboarding/progress` | GET/PUT | WP-04 | OnboardingProgress |
| `/api/profile` | GET/PUT | WP-19 | ContributorProfile |
| `/api/profile/devices` | GET/PUT | WP-22 | DeviceInfo |
| `/api/tasks` | GET | WP-09 | Task[] with status filtering |
| `/api/tasks/:id` | GET | WP-10 | Single Task with apgGuidance |
| `/api/tasks/:id/evidence` | POST | WP-11 | Create EvidencePack |
| `/api/tasks/:id/evidence` | GET | WP-12, WP-13 | EvidencePack with status |
| `/api/skill-genome` | GET | WP-14, WP-15 | SkillGenome |
| `/api/earnings` | GET | WP-16 | EarningsSummary |
| `/api/credentials` | GET | WP-17 | PoDLCredential[] |
| `/api/messages` | GET/POST | WP-18 | MessageThread[] |
| `/api/apg/activities` | GET | WP-07 | APGActivity[] |
| `/api/settings/privacy` | GET/PUT | WP-20 | Privacy settings object |
| `/api/settings/notifications` | GET/PUT | WP-21 | NotificationPreference[] |

### University Portal Endpoints

All Women's Portal endpoints above PLUS:

| Endpoint | Method | Requirement | Mock Data |
|----------|--------|-------------|-----------|
| `/api/auth/verify-email` | POST | UP-01 | University email verification |
| `/api/tasks/discover` | GET | UP-03 | Tasks filtered by skill level |
| `/api/credentials/:id/pdf` | GET | UP-05 | Trigger PDF generation |
| `/api/credentials/:id/share` | POST | UP-05 | Generate share link |
| `/api/team` | GET | UP-06 | AnonymizedTeamMember[] (no names) |
| `/api/alumni/reactivate` | POST | UP-08 | Alumni reactivation flow |
| `/api/alumni/credentials` | GET | UP-09 | Preserved PoDL history |
| `/api/governor/metrics` | GET | UP-10 | GovernorMetrics (aggregated) |
| `/api/governor/cohorts` | GET | UP-11 | CohortTrend[] (anonymized) |
| `/api/governor/categories` | GET/POST/PUT | UP-12 | TaskCategory[] |

### Factory Functions Needed

| Factory | Generates | Used By |
|---------|-----------|---------|
| `createMockUser` | `ContributorProfile` | Auth, profile |
| `createMockStudentProfile` | `StudentProfile` | UP-01, UP-02 |
| `createMockAlumniProfile` | `AlumniProfile` | UP-08, UP-09 |
| `createMockTask` | `Task` (with various statuses) | WP-09..13, UP-03..04 |
| `createMockEvidence` | `Evidence` / `EvidencePack` | WP-11..13, UP-04 |
| `createMockEarning` | `Earning` / `EarningsSummary` | WP-16, UP-02 |
| `createMockPoDL` | `PoDLCredential` | WP-17, UP-05 |
| `createMockSkillGenome` | `SkillGenome` | WP-14, UP-07 |
| `createMockAPGActivity` | `APGActivity` | WP-07, UP-02 |
| `createMockMessage` | `Message` / `MessageThread` | WP-18 |
| `createMockGovernorMetrics` | `GovernorMetrics` | UP-10 |
| `createMockCohortTrend` | `CohortTrend` | UP-11 |
| `createMockTaskCategory` | `TaskCategory` | UP-12 |

## Component Gaps Analysis

### Components Needed Per Portal (NOT in @glimmora/ui)

These are page-level or portal-specific compositions that must be built IN each portal app, not in the shared design system:

**Women's Portal — New Components:**

| Component | Requirement | Uses from @glimmora/ui |
|-----------|-------------|----------------------|
| `LanguageSelector` | WP-01 | Button, Card |
| `WhatsAppWelcomeScreen` | WP-02 | Button, Heading, Body |
| `RegistrationForm` | WP-03 | TextInput, PasswordInput, Button |
| `OnboardingProfileStep` | WP-04 step 1 | TextInput, Select, Button |
| `OnboardingDevicesStep` | WP-04 step 2 | Select, Checkbox, RadioGroup, Button |
| `OnboardingSkillsStep` | WP-04 step 3 | Tag, RadioGroup, Button |
| `OnboardingActivationStep` | WP-04 step 4 | GradientCard, Button |
| `PrivacyBanner` | WP-05 | Badge (used across portal) |
| `DashboardKPIRow` | WP-06 | GradientCard, KPIStatCard |
| `APGActivityWidget` | WP-07 | APGFeed |
| `ActiveTasksSummary` | WP-08 | Card, Badge |
| `TaskListWithTabs` | WP-09 | Tabs, DataTable, Badge, Tag |
| `TaskDetailPage` | WP-10 | PageHeader, Card, Tag, Badge |
| `EvidenceSubmissionForm` | WP-11 | FileUpload, Tabs, TextInput, Textarea, Button |
| `SubmissionStatusTracker` | WP-12 | TimelineBar, Badge |
| `ReworkRequestView` | WP-13 | Card, Badge, Button, Textarea |
| `SkillGenomePage` | WP-14, WP-15 | SkillGenomePanel |
| `EarningsDashboard` | WP-16 | KPIStatCard, BarChart, DataTable |
| `PoDLCredentialsList` | WP-17 | PoDLCard |
| `MessagesPage` | WP-18 | Card, TextInput, Button |
| `ProfileSettingsForm` | WP-19 | TextInput, Textarea, Select, Button |
| `PrivacySettingsForm` | WP-20 | Switch, Card |
| `NotificationPrefsForm` | WP-21 | Switch, Card |
| `DeviceInfoForm` | WP-22 | Select, RadioGroup, Checkbox, Button |

**University Portal — Additional Components (beyond shared with Women's):**

| Component | Requirement | Uses from @glimmora/ui |
|-----------|-------------|----------------------|
| `StudentRegistrationForm` | UP-01 | TextInput, Button (+ email verification) |
| `StudentDashboard` | UP-02 | KPIStatCard, GradientCard, Badge |
| `TaskDiscoveryList` | UP-03 | Tabs, Card, Tag, Badge |
| `PoDLCredentialDetail` | UP-05 | PoDLCard, Button (+ PDF export trigger) |
| `PoDLPDFDocument` | UP-05 | @react-pdf/renderer (standalone) |
| `AnonymousTeamView` | UP-06 | AnonymizedTeamCard |
| `AlumniReactivationForm` | UP-08 | TextInput, Select, Button |
| `GovernorMetricsDashboard` | UP-10 | KPIStatCard, BarChart, ProgressRing |
| `CohortTrendsView` | UP-11 | DataTable, BarChart, ProgressRing |
| `TaskCategoryManager` | UP-12 | DataTable, Dialog, TextInput, Switch, Button |

## Plan Dependency Mapping

### Sub-Plan Dependencies

```
03-01: Women's Portal pre-auth + onboarding
  Depends on: next-intl installation, i18n config, messages files, auth MSW handlers
  Produces: Language selector, welcome screen, registration, 4-step onboarding

03-02: Women's Portal dashboard, tasks, evidence
  Depends on: 03-01 (auth flow must exist for mock login)
  Produces: AppShell layout, dashboard, task list/detail, evidence submission/tracking

03-03: Women's Portal Skill Genome, earnings, PoDL, messages, settings
  Depends on: 03-02 (AppShell layout, navigation already in place)
  Produces: Skill genome page, earnings dashboard, PoDL list, messages, all settings

03-04: University Portal student flows
  Depends on: 03-01 (can reuse i18n patterns), 03-02 (can reuse evidence/task patterns)
  Produces: Student onboarding, dashboard, tasks, evidence, PoDL + PDF export, team, skill genome

03-05: University Portal alumni + governor
  Depends on: 03-04 (student portal structure exists)
  Produces: Alumni reactivation, governor metrics/cohorts/categories
```

### Parallelization Opportunities

```
SERIAL (must be sequential):
  03-01 → 03-02 → 03-03   (Women's Portal builds on itself)

PARTIALLY PARALLEL:
  03-01 + (types/factories shared prep)   can run together
  03-03 and 03-04                         can run in parallel after 03-02 completes
  03-05                                   requires 03-04

OPTIMAL EXECUTION ORDER:
  1. Types gap-fill (add Earnings, Message, OnboardingStep, StudentProfile, etc. to @glimmora/types)
  2. 03-01 (Women's pre-auth + onboarding — establishes i18n, auth, MSW patterns)
  3. 03-02 (Women's dashboard + tasks — establishes AppShell, task flow patterns)
  4. 03-03 || 03-04 (in parallel — Women's remaining + University student flows)
  5. 03-05 (University alumni + governor)
```

### Shared Work That Should Happen First (in 03-01)

1. Install `next-intl` in both portals
2. Add all new types to `@glimmora/types`
3. Create translation message files (en.json minimum; ur.json, ar.json with placeholder content)
4. Set up `i18n/request.ts` and update `next.config.ts` in both portals
5. Create MSW factory functions in a shared location or per-portal
6. Establish the route group pattern `(pre-auth)` / `(app)` in both portals

## Governor Dashboard Privacy Enforcement (UP-10, UP-11, UP-12)

### Architecture-Level Privacy

The governor views must be privacy-safe by construction — not by developer discipline. Approach:

1. **MSW mock data layer:** Governor endpoints (`/api/governor/*`) return ONLY aggregated data. The mock handler functions never include individual identifiers in responses.
2. **Types enforce it:** `GovernorMetrics` and `CohortTrend` types have no `contributorId`, no `name`, no `email` fields. Impossible to accidentally render what doesn't exist in the type.
3. **Component props enforce it:** `GovernorMetricsDashboard` accepts `GovernorMetrics` type — which structurally cannot contain individual data.
4. **Review checkpoint:** Any PR touching governor components must verify no individual identifiers appear.

```typescript
// CORRECT: GovernorMetrics has only aggregate fields
interface GovernorMetrics {
  activeContributors: number       // Count — not a list
  totalTasksCompleted: number
  averageCompletionRate: number    // Percentage — not per-person
}

// WRONG: Would expose individual data
interface GovernorMetrics {
  contributors: { name: string; tasksCompleted: number }[]  // NEVER DO THIS
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `[locale]` URL prefix for all i18n | Cookie-based locale without URL prefix (next-intl "without-i18n-routing") | next-intl v3+ | Cleaner URLs; language selection can be first interaction without URL change |
| `ml-*` / `mr-*` physical CSS props | `ms-*` / `me-*` logical CSS props | Tailwind v4.0 (Jan 2025) | RTL works automatically via `dir` attribute; no plugin needed |
| `tailwindcss-rtl` plugin | Tailwind v4 built-in logical properties | Tailwind v4.0 | No extra dependency for RTL support |
| @react-pdf/renderer v3 (React 18 only) | @react-pdf/renderer v4.1+ (React 19 support) | v4.1.0 (2025) | Can use in React 19 projects without compat issues |
| Zustand v4 `create(...)` | Zustand v5 `create<T>()(...)` | v5.0.0 (2024) | TypeScript middleware types preserved; persist bug fixed in v5.0.10 |

**Deprecated/outdated:**
- `tailwindcss-rtl` plugin: Unnecessary with Tailwind v4's built-in logical properties
- `next-i18next`: Designed for Pages Router; not compatible with App Router
- `@react-pdf/renderer` v3.x: Incompatible with React 19

## Open Questions

1. **Translation content depth for Phase 3**
   - What we know: Three locales needed (en, ur, ar). Message file structure is straightforward.
   - What's unclear: How complete should ur.json and ar.json translations be for Phase 3? Full professional translation, or placeholder/lorem text with English keys?
   - Recommendation: Use English as the complete baseline. Create ur.json and ar.json with the same keys but placeholder Urdu/Arabic text for a representative subset of screens (language selector, welcome, registration, dashboard). Mark remaining keys with English fallback. This proves RTL works without blocking on professional translation.

2. **Urdu font support**
   - What we know: The current font stack is Miller Display (display) + Avenir LT Std (body), both Latin-script fonts. These will not render Urdu/Arabic correctly.
   - What's unclear: Which Urdu/Arabic-compatible font should be used? Noto Sans Arabic? Noto Naskh Arabic? A custom font?
   - Recommendation: Add `Noto Sans Arabic` as a web font (available via Google Fonts, free). Set it as the font-family when `dir="rtl"` using a CSS override in `theme.css`. For Phase 3, this is sufficient. Professional Urdu typography can be refined later.

3. **WhatsApp-style welcome screen specifics**
   - What we know: WP-02 requires a "WhatsApp-style" welcome screen that is culturally appropriate.
   - What's unclear: Exact visual design — does "WhatsApp-style" mean green color scheme, chat-bubble UI, or just a familiar conversational tone?
   - Recommendation: Interpret as "conversational, friendly UI with chat-like message bubbles" — NOT a literal WhatsApp clone. Use Glimmora brand colors (not WhatsApp green). Include a welcome message in a speech-bubble-style container, with a friendly illustration or icon. The key is making it feel personal and trustworthy, not corporate.

4. **Shared MSW factories vs per-portal**
   - What we know: Both portals need mock Task, Evidence, PoDL data. Factory functions should be DRY.
   - What's unclear: Should factories live in a shared package (e.g., `@glimmora/test-utils`) or be duplicated per portal?
   - Recommendation: Keep factories per-portal for Phase 3. The portals share `@glimmora/types` but their mock data has different shapes (Women's has no university fields; Governor has aggregate-only data). A shared test-utils package can be extracted in a later phase if duplication becomes painful.

## Sources

### Primary (HIGH confidence)
- [next-intl Getting Started — App Router (without i18n routing)](https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing) — Cookie-based locale setup, Server/Client Component patterns
- [next-intl Routing Setup](https://next-intl.dev/docs/routing/setup) — Routing configuration, middleware
- [Tailwind CSS v4.0 Announcement](https://tailwindcss.com/blog/tailwindcss-v4) — Logical properties built-in, RTL support
- [Tailwind CSS v4 Margin Docs](https://tailwindcss.com/docs/margin) — `ms-*`, `me-*` utilities, `dir` attribute interaction
- [@react-pdf/renderer Compatibility](https://react-pdf.org/compatibility) — React 19 support since v4.1.0
- Codebase: `@glimmora/ui` index.ts — Full component inventory (DS-01..DS-47)
- Codebase: `@glimmora/types` — Existing type definitions verified
- Codebase: MSW setup — Browser/server/handler pattern verified

### Secondary (MEDIUM confidence)
- [next-intl v4.8 on npm](https://www.npmjs.com/package/next-intl) — Version 4.8.3, last published Feb 2026
- [@react-pdf/renderer v4.3 on npm](https://www.npmjs.com/package/@react-pdf/renderer) — Version 4.3.2, last published Dec 2025
- [Zustand v5 Next.js Integration](https://www.dimasroger.com/blog/how-to-use-zustand-with-next-js-15) — Persist middleware patterns, SSR considerations
- [Zustand persist bug fix v5.0.10](https://github.com/pmndrs/zustand/discussions/2897) — State consistency fix

### Tertiary (LOW confidence)
- [next-intl locale switching GitHub discussion](https://github.com/amannn/next-intl/discussions/1096) — Community patterns for cookie-based locale switching (verified against official docs)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All libraries verified against official docs and npm; versions confirmed
- Architecture: HIGH — Route group pattern, cookie-based i18n, and logical properties verified against Next.js/Tailwind/next-intl docs
- Types gaps: HIGH — Systematic comparison of requirements vs existing types in codebase
- MSW mock data: HIGH — Endpoint mapping directly from requirements
- Pitfalls: HIGH — Based on verified framework behaviors (hydration, SSR, RTL)
- PDF export: MEDIUM — @react-pdf/renderer v4.3 confirmed React 19 compatible; specific integration patterns based on docs + community examples

**Research date:** 2026-02-26
**Valid until:** 2026-03-28 (30 days — stable libraries, no fast-moving changes expected)
