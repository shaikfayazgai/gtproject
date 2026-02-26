# Phase 4: Mentor Portal - Research

**Researched:** 2026-02-26
**Domain:** 3-panel resizable layout, SLA countdown timers, auto-save drafts, blind evidence review, mentor domain types, MSW mock layer
**Confidence:** HIGH

## Summary

Phase 4 builds the Mentor Portal (port 3004) with 20 requirements (MP-01..MP-20). The portal's signature feature is a 3-panel resizable review layout: task context (~320px left), evidence viewer (flexible center), review form (~320px right). The existing `@glimmora/ui` library already provides the EvidenceViewer (DS-38) component that enforces blind review at the TypeScript level (no contributor identity fields). The mentor-portal app already has a canary page, MSW setup, Zustand store, and providers -- all patterns established in Phases 1-3.

The three technical challenges unique to this phase are: (1) the 3-panel resizable layout requiring `react-resizable-panels` v4.6+ added to `@glimmora/ui`, (2) SLA countdown timers that must avoid hydration mismatch in Next.js SSR, and (3) auto-save drafts for in-progress reviews using Zustand persist keyed by review ID. Everything else (onboarding wizard, tabbed queues, settings pages, MSW handlers) follows established Phase 3 patterns.

**Primary recommendation:** Install `react-resizable-panels@^4.6.5` in `@glimmora/ui`, create a thin `ResizablePanels` wrapper component using the v4 API (`Group`/`Panel`/`Separator`), then compose the review detail page from three panels containing existing `@glimmora/ui` components. Use percentage-based sizing (25/45/30 default split) with `minSize` constraints. For SLA timers, render "---" on server and hydrate with `useEffect` + `setInterval`. For auto-save, use Zustand persist with localStorage keyed by `review-draft-{reviewId}`.

## Standard Stack

### Core (Already Installed in mentor-portal)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| @glimmora/ui | workspace:* | All design system components (EvidenceViewer, Tabs, DataTable, KPIStatCard, etc.) | Installed |
| @glimmora/types | workspace:* | Shared TypeScript contracts | Installed |
| @tanstack/react-query | ^5.90.21 | Server state / data fetching from MSW | Installed |
| zustand | ^5.0.11 | Client state (auth, sidebar, review drafts) | Installed |
| msw | ^2.12.10 | Mock API layer | Installed |
| next | ^15.3.3 | App Router framework | Installed |
| react | ^19.1.0 | UI framework | Installed |

### New Dependencies (To Install)
| Library | Version | Purpose | Confidence | Install Target |
|---------|---------|---------|------------|----------------|
| react-resizable-panels | ^4.6.5 | 3-panel review layout (resizable) | HIGH -- 2.7M weekly downloads, React 19 compatible, v4 supports pixels/percentages/SSR | @glimmora/ui |
| lucide-react | ^0.475.0 | Icons (ClipboardList, Star, Clock, Shield, etc.) | HIGH -- already in @glimmora/ui, needs to be added as direct dep in mentor-portal | mentor-portal |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-resizable-panels | CSS grid with fixed columns | No user resizing; simpler but less flexible; the requirement says "~320px" suggesting approximate, and mentors benefit from resizing to see more evidence or more form context |
| react-resizable-panels | allotment | Similar API but fewer downloads (500K/week vs 2.7M); react-resizable-panels has better SSR docs and v4 is actively maintained by bvaughn |
| Zustand persist for drafts | TanStack Query mutation + debounce | TanStack Query is for server state; drafts are ephemeral client state that should survive page refresh; Zustand persist with localStorage is the established pattern in this codebase |

**Installation:**
```bash
pnpm add react-resizable-panels --filter @glimmora/ui
pnpm add lucide-react --filter @glimmora/mentor-portal
```

## Architecture Patterns

### Recommended Project Structure -- Mentor Portal

```
apps/mentor-portal/src/
├── app/
│   ├── layout.tsx                      # Root layout (exists)
│   ├── globals.css                     # Tailwind theme import (exists)
│   ├── (pre-auth)/                     # Route group: NO AppShell
│   │   ├── page.tsx                    # Mentor landing / login (MP-01, MP-02)
│   │   ├── apply/page.tsx              # Application form (MP-01)
│   │   ├── status/page.tsx             # Application status (MP-02)
│   │   └── onboarding/
│   │       ├── layout.tsx              # Stepper layout wrapper
│   │       ├── profile/page.tsx        # Step 1: Mentor Profile (MP-03)
│   │       ├── expertise/page.tsx      # Step 2: Expertise + Skill Tags (MP-03)
│   │       ├── capacity/page.tsx       # Step 3: Review Capacity (MP-03)
│   │       └── orientation/page.tsx    # Step 4: Code of Conduct (MP-03)
│   └── (app)/                          # Route group: AppShell + Sidebar
│       ├── layout.tsx                  # AppShell layout with mentor sidebar
│       ├── dashboard/page.tsx          # Dashboard (queue summary, metrics, quick actions)
│       ├── reviews/
│       │   ├── page.tsx                # Review queue with 3 tabs (MP-04)
│       │   └── [reviewId]/page.tsx     # 3-panel review detail (MP-07..MP-11)
│       ├── skill-verification/
│       │   └── page.tsx                # Skill tag verification queue (MP-15, MP-16)
│       ├── conversations/
│       │   ├── page.tsx                # Mentor conversations list (MP-17)
│       │   └── [threadId]/page.tsx     # Conversation detail (MP-17)
│       ├── profile/
│       │   └── page.tsx                # Mentor profile + tier + expertise (MP-12..MP-14, MP-19)
│       └── settings/
│           ├── page.tsx                # Settings hub
│           ├── capacity/page.tsx       # Capacity settings (MP-18)
│           └── notifications/page.tsx  # Notification preferences (MP-20)
├── components/
│   ├── providers/                      # Existing (MSWProvider, QueryProvider, Providers)
│   ├── application/                    # MP-01, MP-02 components
│   │   ├── application-form.tsx
│   │   ├── application-status.tsx
│   │   └── index.ts
│   ├── onboarding/                     # MP-03 components
│   │   ├── profile-step.tsx
│   │   ├── expertise-step.tsx
│   │   ├── capacity-step.tsx
│   │   ├── orientation-step.tsx
│   │   └── index.ts
│   ├── dashboard/                      # Dashboard widgets
│   │   ├── queue-summary-widget.tsx
│   │   ├── impact-metrics-widget.tsx
│   │   ├── weekly-activity-widget.tsx
│   │   └── index.ts
│   ├── reviews/                        # Review queue + detail components
│   │   ├── review-queue-table.tsx      # DataTable for queue list
│   │   ├── review-queue-card.tsx       # Mobile-friendly card for queue items
│   │   ├── review-layout.tsx           # 3-panel resizable container
│   │   ├── task-context-panel.tsx      # Left panel content
│   │   ├── review-form.tsx             # Right panel: structured review form
│   │   ├── review-decision-form.tsx    # Decision section (approve/rework/reject)
│   │   ├── sla-countdown.tsx           # SLA timer component
│   │   ├── skip-dialog.tsx             # Skip review dialog (MP-05)
│   │   ├── sla-extension-dialog.tsx    # SLA extension request (MP-06)
│   │   └── index.ts
│   ├── skill-verification/             # MP-15, MP-16 components
│   │   ├── verification-queue.tsx
│   │   ├── verification-detail.tsx
│   │   └── index.ts
│   ├── profile/                        # MP-12..MP-14, MP-19
│   │   ├── tier-progress.tsx
│   │   ├── impact-metrics.tsx
│   │   ├── expertise-manager.tsx
│   │   └── index.ts
│   └── conversations/                  # MP-17
│       ├── conversation-list.tsx
│       ├── conversation-detail.tsx
│       └── index.ts
├── store/
│   ├── app-store.ts                    # Sidebar state (exists)
│   ├── auth-store.ts                   # Mentor auth state (new)
│   └── review-draft-store.ts           # Auto-save drafts (new)
└── lib/
    └── msw/
        ├── handlers/                   # Domain-specific handlers
        │   ├── auth.ts
        │   ├── onboarding.ts
        │   ├── reviews.ts              # Review queue + decisions
        │   ├── skill-verification.ts   # Skill tag verification
        │   ├── profile.ts              # Mentor profile + tier
        │   ├── conversations.ts        # Mentor conversations
        │   ├── dashboard.ts            # Dashboard stats
        │   └── index.ts                # Barrel export
        ├── factories/                  # Mock data factories
        │   ├── common.ts               # randomId, isoNow (shared pattern)
        │   ├── mentor.ts               # MentorProfile, MentorApplication
        │   ├── reviews.ts              # ReviewQueueItem, ReviewDecision
        │   ├── skill-verification.ts   # SkillTagVerification
        │   └── conversations.ts        # MentorConversation
        ├── browser.ts                  # Existing
        └── server.ts                   # Existing
```

### Pattern 1: 3-Panel Resizable Layout

**What:** A horizontal 3-panel layout using `react-resizable-panels` v4 for the review detail page. Left panel (~25% default = ~320px on 1280px screen), center panel (~45% flexible), right panel (~30% default = ~384px).

**When to use:** The review detail page (MP-07..MP-11) only.

**Implementation approach:**

`react-resizable-panels` v4 changed its export names from v2:
- `PanelGroup` is now `Group`
- `PanelResizeHandle` is now `Separator`
- `direction` prop is now `orientation`
- Sizes support percentages (default), pixels, and CSS units

**Confidence:** HIGH -- verified via [npm registry](https://www.npmjs.com/package/react-resizable-panels) and [GitHub README](https://github.com/bvaughn/react-resizable-panels). The v4 API changes were confirmed by the [shadcn/ui v4 compatibility fix](https://github.com/shadcn-ui/ui/issues/9136).

**Step 1: Create wrapper in @glimmora/ui:**

```typescript
// packages/ui/src/components/resizable-panels/resizable-panels.tsx
'use client'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { cn } from '../../lib/utils'
import { forwardRef, type ComponentProps } from 'react'

// Re-export with Glimmora-consistent naming
type PanelGroupProps = ComponentProps<typeof Group>

export function ResizablePanelGroup({ className, ...props }: PanelGroupProps) {
  return (
    <Group
      className={cn('flex h-full w-full', className)}
      {...props}
    />
  )
}

export const ResizablePanel = Panel

export function ResizableHandle({
  className,
  withHandle = true,
  ...props
}: ComponentProps<typeof Separator> & { withHandle?: boolean }) {
  return (
    <Separator
      className={cn(
        'relative flex w-px items-center justify-center bg-border',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
        'hover:bg-brand-primary/30 transition-colors',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-6 w-3 items-center justify-center rounded-sm border border-border bg-bg-card">
          <svg width="6" height="10" viewBox="0 0 6 10" className="text-text-caption">
            <circle cx="1.5" cy="2" r="0.8" fill="currentColor" />
            <circle cx="4.5" cy="2" r="0.8" fill="currentColor" />
            <circle cx="1.5" cy="5" r="0.8" fill="currentColor" />
            <circle cx="4.5" cy="5" r="0.8" fill="currentColor" />
            <circle cx="1.5" cy="8" r="0.8" fill="currentColor" />
            <circle cx="4.5" cy="8" r="0.8" fill="currentColor" />
          </svg>
        </div>
      )}
    </Separator>
  )
}
```

**Step 2: Use in review detail page:**

```typescript
// apps/mentor-portal/src/components/reviews/review-layout.tsx
'use client'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@glimmora/ui'
import { TaskContextPanel } from './task-context-panel'
import { EvidenceViewer } from '@glimmora/ui'
import { ReviewForm } from './review-form'

export function ReviewLayout({ reviewId }: { reviewId: string }) {
  return (
    <div className="h-[calc(100vh-64px)]">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <div className="h-full overflow-y-auto p-4">
            <TaskContextPanel reviewId={reviewId} />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={45} minSize={30}>
          <div className="h-full overflow-y-auto p-4">
            {/* EvidenceViewer from @glimmora/ui DS-38 */}
            <EvidenceViewer evidence={[]} />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
          <div className="h-full overflow-y-auto p-4">
            <ReviewForm reviewId={reviewId} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
```

**Responsive strategy:**
- Desktop (>= 1024px): 3-panel resizable layout
- Tablet (768-1023px): Stack vertically -- task context as collapsible accordion at top, evidence viewer full width, review form below
- Mobile (< 768px): Single column, tabbed navigation between the 3 sections

This responsive collapse happens at the page level (review-layout.tsx), not in the library wrapper. Use a `useMediaQuery` hook or Tailwind's `lg:` breakpoint to conditionally render the resizable layout vs. stacked layout.

### Pattern 2: SLA Countdown Timer (Hydration-Safe)

**What:** A countdown timer showing remaining SLA time per review item.

**The problem:** Server-rendered time will differ from client time, causing hydration mismatch.

**Solution:** Render placeholder on server, hydrate with `useEffect`.

**Confidence:** HIGH -- this is the standard Next.js approach documented at [nextjs.org/docs/messages/react-hydration-error](https://nextjs.org/docs/messages/react-hydration-error).

```typescript
// apps/mentor-portal/src/components/reviews/sla-countdown.tsx
'use client'
import { useState, useEffect } from 'react'
import { Badge } from '@glimmora/ui'

interface SLACountdownProps {
  deadlineIso: string
  className?: string
}

export function SLACountdown({ deadlineIso, className }: SLACountdownProps) {
  const [mounted, setMounted] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
    const deadline = new Date(deadlineIso).getTime()

    function tick() {
      const now = Date.now()
      setRemaining(Math.max(0, deadline - now))
    }

    tick()
    const interval = setInterval(tick, 60_000) // Update every minute
    return () => clearInterval(interval)
  }, [deadlineIso])

  // Server render: show placeholder to avoid hydration mismatch
  if (!mounted || remaining === null) {
    return <span className={className}>--:--</span>
  }

  const hours = Math.floor(remaining / 3_600_000)
  const minutes = Math.floor((remaining % 3_600_000) / 60_000)

  // Urgency thresholds
  const isOverdue = remaining === 0
  const isUrgent = hours < 4
  const isWarning = hours < 12

  const badgeStatus = isOverdue ? 'urgent' : isUrgent ? 'atrisk' : isWarning ? 'inprogress' : 'normal'
  const label = isOverdue ? 'Overdue' : `${hours}h ${minutes}m left`

  return <Badge status={badgeStatus} className={className}>{label}</Badge>
}
```

**Key decisions:**
- Update every 60 seconds (not every second) -- SLA timers are hours-long, minute granularity is sufficient and avoids unnecessary re-renders
- Use `mounted` state pattern to prevent hydration mismatch
- Color coding: Normal (> 12h), Warning/amber (4-12h), Urgent/red (< 4h), Overdue (0)
- Badge component from @glimmora/ui with existing status variants

### Pattern 3: Auto-Save Review Drafts

**What:** Persist in-progress review form state to localStorage so mentors don't lose work on page refresh or accidental navigation.

**Approach:** Zustand persist middleware, keyed by review ID, with debounced updates.

**Confidence:** HIGH -- Zustand persist is already used in this codebase (auth-store, language-store). The debounce pattern is well-established.

```typescript
// apps/mentor-portal/src/store/review-draft-store.ts
'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CriterionEvaluation {
  criterionId: string
  rating: 'met' | 'partially-met' | 'not-met' | null
  comment: string
}

interface ReviewDraft {
  reviewId: string
  criteriaEvaluations: CriterionEvaluation[]
  overallRating: number | null
  effortLevel: 'exceeds' | 'meets' | 'below' | null
  strengthNotes: string
  improvementNotes: string
  learningRecommendation: string
  decision: 'approve' | 'rework' | 'reject' | null
  reworkItems: string[]
  rejectionReason: string
  lastSavedAt: string
}

interface ReviewDraftState {
  drafts: Record<string, ReviewDraft>
  getDraft: (reviewId: string) => ReviewDraft | undefined
  saveDraft: (draft: ReviewDraft) => void
  deleteDraft: (reviewId: string) => void
}

export const useReviewDraftStore = create<ReviewDraftState>()(
  persist(
    (set, get) => ({
      drafts: {},
      getDraft: (reviewId) => get().drafts[reviewId],
      saveDraft: (draft) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [draft.reviewId]: { ...draft, lastSavedAt: new Date().toISOString() },
          },
        })),
      deleteDraft: (reviewId) =>
        set((state) => {
          const { [reviewId]: _, ...rest } = state.drafts
          return { drafts: rest }
        }),
    }),
    {
      name: 'glimmora-mentor-review-drafts',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

**Auto-save hook (debounced):**

```typescript
// apps/mentor-portal/src/hooks/use-auto-save.ts
'use client'
import { useEffect, useRef } from 'react'
import { useReviewDraftStore } from '@/store/review-draft-store'

export function useAutoSave(draft: Parameters<typeof useReviewDraftStore.getState>['0'] extends { saveDraft: (d: infer T) => void } ? T : never) {
  const saveDraft = useReviewDraftStore((s) => s.saveDraft)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      saveDraft(draft)
    }, 1500) // 1.5 second debounce

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [draft, saveDraft])
}
```

**Scope:** One draft per `reviewId`. When the mentor submits a final decision, `deleteDraft(reviewId)` is called to clean up. The "In Progress" tab in the queue shows "Draft saved" indicator with `lastSavedAt` timestamp from the store.

### Pattern 4: Mentor Application + Onboarding (follows Phase 3 pattern)

**What:** Pre-auth application form, application status page, and 4-step onboarding wizard.

**Established pattern (from Phase 3):** Route-based steps under `(pre-auth)/onboarding/`, `Stepper` component from @glimmora/ui, Zustand auth-store for session state.

**No new research needed** -- this directly reuses the women-portal and university-portal onboarding patterns. The only difference is the 4 steps are mentor-specific (Profile, Expertise, Capacity, Orientation) instead of contributor-specific.

### Anti-Patterns to Avoid

- **Don't put `react-resizable-panels` in mentor-portal directly.** Install it in `@glimmora/ui` as a wrapper component -- it will also be needed by Enterprise Portal (Phase 5) for the 4-panel blueprint editor.
- **Don't use `suppressHydrationWarning` for the SLA timer.** Use the `mounted` state pattern instead -- `suppressHydrationWarning` only works one level deep and masks real bugs.
- **Don't auto-save to the server (MSW endpoint) during draft.** Drafts are client-only ephemeral state. Server save happens only on final decision submission. This avoids unnecessary API calls and keeps the mock layer simpler.
- **Don't render `EvidenceViewer` inside the `ResizablePanel` directly without overflow handling.** Each panel must have `overflow-y-auto` on its inner container -- the panel itself is a flex child and won't scroll.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Resizable panel layout | Custom CSS resize + drag handlers | `react-resizable-panels` v4 | Keyboard accessibility, touch support, imperative resize API, layout persistence, SSR support, tested edge cases |
| SLA countdown formatting | Custom time math | `remaining / 3_600_000` for hours, modulo for minutes | Simple math is fine here; a date library (date-fns, dayjs) is overkill for elapsed time formatting |
| Debounced auto-save | Custom debounce implementation | `setTimeout`/`clearTimeout` in useEffect | lodash debounce is unnecessary for a single use case; the useEffect pattern is 8 lines |
| Syntax-highlighted code viewer | Custom highlighting | EvidenceViewer (DS-38) already uses `prism-react-renderer` | Already built and tested in Phase 2 |
| Review queue data table | Custom table with sorting/pagination | DataTable<T> from @glimmora/ui (DS-36) | TanStack Table headless, already built with sorting/pagination/selection |

**Key insight:** The Mentor Portal is primarily a composition exercise. Most visual components already exist in @glimmora/ui. The new work is (a) the resizable panels wrapper, (b) mentor-specific page composition, (c) the review form with decision logic, and (d) the MSW mock data layer.

## Common Pitfalls

### Pitfall 1: react-resizable-panels v4 API Naming

**What goes wrong:** Using v2 API names (`PanelGroup`, `PanelResizeHandle`, `direction`) with v4 package, getting "export not found" errors.
**Why it happens:** The architecture research doc was written with v2 naming. v4 renamed exports to `Group`, `Panel`, `Separator` and `direction` to `orientation`.
**How to avoid:** The @glimmora/ui wrapper re-exports with Glimmora-consistent names (`ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`), abstracting the v4 API. Consumers never import from `react-resizable-panels` directly.
**Warning signs:** TypeScript "not exported" errors when importing from `react-resizable-panels`.

### Pitfall 2: Hydration Mismatch with Time-Based Rendering

**What goes wrong:** SLA countdown renders server-side with server time, client hydration sees different time, React throws hydration error.
**Why it happens:** `new Date()` returns different values on server vs client. Even a few milliseconds difference causes text mismatch.
**How to avoid:** Use `mounted` state pattern: render `--:--` on server, set real time in `useEffect` after mount.
**Warning signs:** Hydration warning in console mentioning time-related text content mismatch.

### Pitfall 3: Overflow in Resizable Panels

**What goes wrong:** Content in panels doesn't scroll, gets clipped, or panels won't resize below content height.
**Why it happens:** `react-resizable-panels` panels are flex children. Without explicit `overflow-y-auto` on the inner container and `h-full` on the panel, content breaks.
**How to avoid:** Each panel's inner content must be wrapped in `<div className="h-full overflow-y-auto">`. The outer `ResizablePanelGroup` must have a fixed height (e.g., `h-[calc(100vh-64px)]`).
**Warning signs:** Content overflows panel boundaries; scrollbar appears on the entire page instead of within a panel.

### Pitfall 4: EvidenceViewer Evidence Type Mismatch

**What goes wrong:** The `@glimmora/ui` EvidenceViewer uses its own local `Evidence` type (CodeEvidence, DocumentEvidence, etc.) that differs from `@glimmora/types` Evidence type.
**Why it happens:** The EvidenceViewer was built in Phase 2 with UI-specific types, while `@glimmora/types` has the API-layer `Evidence` type with `contributorId`, `status`, etc.
**How to avoid:** Create a mapping function `mapApiEvidenceToViewerEvidence(apiEvidence: Evidence[]): ViewerEvidence[]` that transforms API evidence items to the viewer format. This mapping also serves as the privacy boundary -- it strips `contributorId` before rendering.
**Warning signs:** TypeScript type errors when passing API evidence directly to EvidenceViewer.

### Pitfall 5: Zustand Persist Hydration Flash

**What goes wrong:** Review draft store initializes with empty state on server, then flashes to persisted state on client.
**Why it happens:** Zustand persist loads from localStorage only on client. Server render sees the initial (empty) state.
**How to avoid:** Use the `onRehydrateStorage` callback or the `skipHydration` pattern. For this use case, it's acceptable since the review detail page is always client-rendered (interactive form). The `'use client'` directive on the page ensures consistent behavior.
**Warning signs:** Form fields briefly appear empty then fill with saved draft data.

### Pitfall 6: @glimmora/ui Label is <p>, Not <label>

**What goes wrong:** Using `<Label>` from @glimmora/ui for form associations -- it renders a `<p>` element, not an HTML `<label>`.
**Why it happens:** Decision from Phase 3 gap fix. The @glimmora/ui Label component is for typography, not form semantics.
**How to avoid:** Use native `<label>` HTML element for all form field associations (htmlFor/for). Use @glimmora/ui Label only for non-form decorative labels.
**Warning signs:** Clicking label text doesn't focus the associated input.

## Code Examples

### Review Queue with Tabs and SLA Timer

```typescript
// apps/mentor-portal/src/app/(app)/reviews/page.tsx
'use client'
import { Tabs, TabsList, TabsTrigger, TabsContent, PageHeader, DataTable } from '@glimmora/ui'
import { SLACountdown } from '@/components/reviews/sla-countdown'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import type { ReviewQueueItem } from '@glimmora/types'

const pendingColumns: ColumnDef<ReviewQueueItem>[] = [
  { accessorKey: 'milestoneName', header: 'Milestone' },
  { accessorKey: 'domainTags', header: 'Domain', cell: ({ row }) => row.original.domainTags.join(', ') },
  { accessorKey: 'evidenceType', header: 'Evidence Type' },
  {
    accessorKey: 'slaDeadline',
    header: 'SLA',
    cell: ({ row }) => <SLACountdown deadlineIso={row.original.slaDeadline} />,
  },
]
```

### Evidence Type Mapping (API -> Viewer)

```typescript
// apps/mentor-portal/src/lib/evidence-mapper.ts
import type { Evidence as ApiEvidence } from '@glimmora/types'
import type { Evidence as ViewerEvidence } from '@glimmora/ui'

export function mapToViewerEvidence(items: ApiEvidence[]): ViewerEvidence[] {
  return items.map((item) => {
    switch (item.type) {
      case 'code':
        return { type: 'code', language: 'typescript', code: item.content, filename: item.fileName }
      case 'file':
        return { type: 'document', filename: item.fileName ?? 'file', fileSize: formatBytes(item.fileSize), fileType: getFileType(item.fileName), downloadUrl: item.fileUrl ?? '#' }
      case 'url':
        return { type: 'link', url: item.content, title: item.title }
      case 'video-url':
        return { type: 'video', url: item.content, title: item.title }
      case 'text':
        return { type: 'text', content: item.content }
      default:
        return { type: 'text', content: item.content }
    }
  })
  // NOTE: contributorId is never passed to viewer -- blind review enforced
}
```

## New @glimmora/types Needed

The Mentor Portal needs several new types. These should be added to `@glimmora/types` since they define API contracts the backend will implement.

### mentor.ts (new file)

```typescript
// packages/types/src/mentor.ts

import type { MentorTier } from './user'

export type MentorApplicationStatus = 'pending' | 'under-review' | 'approved' | 'rejected' | 'info-requested'

export interface MentorApplication {
  id: string
  fullName: string
  email: string
  linkedInUrl: string
  expertiseDomains: string[]
  yearsExperience: number
  motivation: string
  credentialUrls: string[]
  status: MentorApplicationStatus
  rejectionReason?: string
  submittedAt: string
  reviewedAt?: string
}

export type MentorOnboardingStepId = 'profile' | 'expertise' | 'capacity' | 'orientation'

export interface MentorOnboardingProgress {
  currentStep: MentorOnboardingStepId
  completedSteps: MentorOnboardingStepId[]
  codeOfConductAccepted: boolean
}
```

### review.ts (new file)

```typescript
// packages/types/src/review.ts

export type ReviewStatus = 'pending' | 'in-progress' | 'completed'
export type ReviewDecisionType = 'approve' | 'rework' | 'reject'
export type ReviewUrgency = 'normal' | 'urgent' | 'overdue'
export type CriterionRating = 'met' | 'partially-met' | 'not-met'
export type EffortLevel = 'exceeds' | 'meets' | 'below'

export interface ReviewQueueItem {
  id: string
  taskId: string
  evidencePackId: string
  milestoneName: string
  milestoneDescription: string
  domainTags: string[]
  evidenceType: string
  contributorRole: string  // 'Women Contributor' | 'Student' -- role only, no identity
  submittedAt: string
  slaDeadline: string
  urgency: ReviewUrgency
  status: ReviewStatus
  draftSavedAt?: string
}

export interface CriterionEvaluation {
  criterionId: string
  criterionLabel: string
  rating: CriterionRating | null
  comment: string
}

export interface ReviewDecision {
  id: string
  reviewId: string
  mentorId: string
  decision: ReviewDecisionType
  criteriaEvaluations: CriterionEvaluation[]
  overallRating: number  // 1-5
  effortLevel: EffortLevel
  strengthNotes: string
  improvementNotes: string
  learningRecommendation: string
  reworkItems?: string[]         // Required for 'rework' decision
  rejectionReason?: string       // Required for 'reject' decision
  submittedAt: string
}

export type AppealStatus = 'none' | 'filed' | 'under-review' | 'upheld' | 'overturned'

export interface CompletedReview extends ReviewQueueItem {
  decision: ReviewDecision
  appealStatus: AppealStatus
  appealResolution?: string
}

export interface ReviewSkipRequest {
  reviewId: string
  reason: 'outside-expertise' | 'conflict-of-interest' | 'capacity-temporary'
}

export interface SLAExtensionRequest {
  reviewId: string
  reason: string
  requestedHours: number  // max 24
}
```

### skill-verification.ts (new file)

```typescript
// packages/types/src/skill-verification.ts

export type VerificationDecision = 'verify-stated' | 'verify-lower' | 'cannot-verify'
export type EvidenceQuality = 'strong' | 'adequate' | 'insufficient'

export interface SkillTagVerificationRequest {
  id: string
  skillTagName: string
  skillCategory: string
  claimedLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  contributorRole: string  // Role only, no identity
  evidenceItems: string[]  // Evidence descriptions
  selfAssessment: string
  submittedAt: string
}

export interface SkillTagVerificationDecision {
  requestId: string
  mentorId: string
  evidenceQuality: EvidenceQuality
  confirmedLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
  decision: VerificationDecision
  comments: string
  decidedAt: string
}
```

### mentor-metrics.ts (new file)

```typescript
// packages/types/src/mentor-metrics.ts

import type { MentorTier } from './user'

export interface MentorImpactMetrics {
  totalReviews: number
  averageReviewTimeHours: number
  reworkRate: number            // 0-1 percentage
  appealsOverturnedRate: number // 0-1 percentage
  contributorsImpacted: number
  skillTagsVerified: number
  qualityImprovementRate: number // 0-1 percentage
}

export interface MentorTierProgress {
  currentTier: MentorTier
  nextTier: MentorTier | null
  progressPercentage: number
  requirements: TierRequirement[]
}

export interface TierRequirement {
  label: string
  current: number
  target: number
  met: boolean
}

export interface MentorWeeklyActivity {
  reviewsCompleted: number
  reviewsApproved: number
  reviewsRejected: number
  reviewsReworked: number
  averageReviewTimeHours: number
  skillTagsVerified: number
}

export interface MentorCapacitySettings {
  reviewsPerWeek: number
  preferredReviewTypes: string[]
  turnaroundCommitmentHours: number
  availability: 'weekdays' | 'weekends' | 'both'
  isPaused: boolean
  pauseReason?: string
  pauseDuration?: '1-week' | '2-weeks' | '1-month'
}
```

### index.ts updates

```typescript
// Add to packages/types/src/index.ts
export type { MentorApplicationStatus, MentorApplication, MentorOnboardingStepId, MentorOnboardingProgress } from './mentor'
export type { ReviewStatus, ReviewDecisionType, ReviewUrgency, CriterionRating, EffortLevel, ReviewQueueItem, CriterionEvaluation, ReviewDecision, AppealStatus, CompletedReview, ReviewSkipRequest, SLAExtensionRequest } from './review'
export type { VerificationDecision, EvidenceQuality, SkillTagVerificationRequest, SkillTagVerificationDecision } from './skill-verification'
export type { MentorImpactMetrics, MentorTierProgress, TierRequirement, MentorWeeklyActivity, MentorCapacitySettings } from './mentor-metrics'
```

## MSW Endpoint Inventory

### Auth & Onboarding
| Method | Endpoint | Purpose | Handler File |
|--------|----------|---------|--------------|
| POST | /api/mentor/apply | Submit mentor application (MP-01) | auth.ts |
| GET | /api/mentor/application-status | Get application status (MP-02) | auth.ts |
| POST | /api/auth/login | Mentor login | auth.ts |
| GET | /api/mentor/onboarding | Get onboarding progress (MP-03) | onboarding.ts |
| PATCH | /api/mentor/onboarding/:step | Complete onboarding step (MP-03) | onboarding.ts |

### Review Queue & Decisions
| Method | Endpoint | Purpose | Handler File |
|--------|----------|---------|--------------|
| GET | /api/mentor/reviews?status=pending\|in-progress\|completed | Get review queue by tab (MP-04) | reviews.ts |
| GET | /api/mentor/reviews/:reviewId | Get review detail (MP-07) | reviews.ts |
| GET | /api/mentor/reviews/:reviewId/evidence | Get evidence pack for review (MP-07, MP-08) | reviews.ts |
| POST | /api/mentor/reviews/:reviewId/decision | Submit review decision (MP-09, MP-10, MP-11) | reviews.ts |
| POST | /api/mentor/reviews/:reviewId/skip | Skip a review (MP-05) | reviews.ts |
| POST | /api/mentor/reviews/:reviewId/extend-sla | Request SLA extension (MP-06) | reviews.ts |

### Profile & Metrics
| Method | Endpoint | Purpose | Handler File |
|--------|----------|---------|--------------|
| GET | /api/mentor/profile | Get mentor profile (MP-12) | profile.ts |
| PATCH | /api/mentor/profile | Update mentor profile (MP-19) | profile.ts |
| GET | /api/mentor/metrics | Get impact metrics (MP-13) | profile.ts |
| GET | /api/mentor/tier | Get tier + progression (MP-12) | profile.ts |
| GET | /api/mentor/expertise | Get expertise skill tags (MP-14) | profile.ts |
| PATCH | /api/mentor/expertise | Update expertise areas (MP-19) | profile.ts |

### Skill Tag Verification
| Method | Endpoint | Purpose | Handler File |
|--------|----------|---------|--------------|
| GET | /api/mentor/skill-verifications?status=pending\|verified\|all | Get verification queue (MP-15) | skill-verification.ts |
| GET | /api/mentor/skill-verifications/:id | Get verification detail (MP-15) | skill-verification.ts |
| POST | /api/mentor/skill-verifications/:id/decision | Submit verification decision (MP-16) | skill-verification.ts |

### Conversations
| Method | Endpoint | Purpose | Handler File |
|--------|----------|---------|--------------|
| GET | /api/mentor/conversations | Get conversations list (MP-17) | conversations.ts |
| GET | /api/mentor/conversations/:threadId | Get conversation detail (MP-17) | conversations.ts |
| POST | /api/mentor/conversations/:threadId/reply | Send reply (MP-17) | conversations.ts |

### Dashboard & Settings
| Method | Endpoint | Purpose | Handler File |
|--------|----------|---------|--------------|
| GET | /api/mentor/dashboard | Dashboard summary stats | dashboard.ts |
| GET | /api/mentor/weekly-activity | This week's activity (MP-13) | dashboard.ts |
| GET | /api/mentor/capacity | Get capacity settings (MP-18) | profile.ts |
| PATCH | /api/mentor/capacity | Update capacity settings (MP-18) | profile.ts |
| GET | /api/mentor/notifications/preferences | Get notification prefs (MP-20) | profile.ts |
| PATCH | /api/mentor/notifications/preferences | Update notification prefs (MP-20) | profile.ts |

**Total: ~25 endpoints across 6 handler files.**

**Composition with Phase 3 handlers:** The mentor portal MSW handlers are entirely separate from women-portal and university-portal handlers. There is no shared handler code. However, the factory utilities (`randomId`, `isoNow` from `factories/common.ts`) should be replicated in the mentor-portal's own factories directory (copy pattern, not import -- each portal is independent).

## EvidenceViewer Integration

### Current State

The `EvidenceViewer` component (DS-38) in `@glimmora/ui`:
- Accepts `evidence: Evidence[]` where `Evidence` is a union type (`CodeEvidence | DocumentEvidence | LinkEvidence | VideoEvidence | TextEvidence`)
- Groups evidence by type and renders tabs (only showing tabs with items)
- Has NO contributor identity fields by design -- blind review enforced at TypeScript level
- Uses `prism-react-renderer` for syntax highlighting
- Uses `@glimmora/ui` Tabs internally
- Accepts `className` for outer container styling

### Integration in 3-Panel Center

The EvidenceViewer fits directly in the center panel with no modifications needed. The integration points are:

1. **Data mapping:** API evidence (`@glimmora/types` Evidence) must be mapped to viewer evidence (`@glimmora/ui` Evidence union type). The mapping function strips `contributorId`, `status`, and other API fields -- keeping only display data.

2. **Sizing:** The EvidenceViewer uses `w-full` and expands to fill its container. Inside the center panel with `overflow-y-auto`, it will scroll naturally.

3. **Multi-item display:** Each evidence type tab already supports multiple items (renders a list). A single task submission can have multiple code files, multiple documents, etc. -- the viewer handles this.

4. **No Mentor-specific props needed.** The EvidenceViewer is read-only and display-only. All mentor interaction (evaluation, ratings, decisions) happens in the right panel (ReviewForm). The viewer doesn't need callbacks or interactive elements.

### What the Center Panel Actually Renders

```tsx
<div className="h-full overflow-y-auto p-4 space-y-4">
  {/* Optional: Download all evidence button */}
  <div className="flex justify-end">
    <Button variant="outline" size="sm">
      <Download className="h-4 w-4 mr-1.5" /> Download All
    </Button>
  </div>

  {/* Evidence viewer -- fills remaining space */}
  <EvidenceViewer evidence={mappedEvidence} />
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-resizable-panels v2 (PanelGroup, direction) | v4 (Group, Panel, Separator, orientation) | 2024 Q4 | Must use v4 naming in wrapper; architecture doc code examples are outdated |
| Individual @radix-ui packages | Unified radix-ui package | 2024 | Already handled in Phase 1; use `radix-ui` not `@radix-ui/*` |
| Zustand v4 persist | Zustand v5 persist | 2024 | Already on v5; createJSONStorage pattern is the same |

**Deprecated/outdated:**
- Architecture research doc shows `import { PanelGroup } from 'react-resizable-panels'` -- this is v2 syntax. v4 uses `Group`.
- Architecture research doc shows `direction="horizontal"` -- v4 uses `orientation="horizontal"`.
- The planned `ResizablePanels` export name in the architecture doc can be kept as `ResizablePanelGroup` for consistency with the underlying library naming.

## Open Questions

1. **Layout persistence across sessions**
   - What we know: `react-resizable-panels` supports `onLayoutChanged` callback and `defaultLayout` prop. The `autoSaveId` prop on v4 Group component auto-persists to localStorage.
   - What's unclear: Whether mentors will want their panel sizes remembered, or whether the default 25/45/30 split is always appropriate.
   - Recommendation: Use `autoSaveId="mentor-review-layout"` on the Group to automatically persist panel sizes. Zero implementation cost. Can be removed if unwanted.

2. **Responsive collapse breakpoints**
   - What we know: Tablet support is mentioned in the UX flows (Flow 10 says "Web browser (desktop + tablet), mobile app (review queue)").
   - What's unclear: Exact breakpoint for switching from 3-panel to stacked layout. Tailwind `lg:` (1024px) seems right.
   - Recommendation: Use `lg:` breakpoint. Below 1024px, switch to stacked/tabbed layout. This is a page-level concern, not a library concern.

3. **Code of Conduct acceptance tracking**
   - What we know: MP-03 Step 4 requires orientation + code of conduct acceptance.
   - What's unclear: Is this a one-time checkbox or does it need to be re-accepted on policy updates?
   - Recommendation: Implement as one-time checkbox with `codeOfConductAccepted: boolean` and `acceptedAt: string` in onboarding state. Re-acceptance can be added later if needed.

## Sources

### Primary (HIGH confidence)
- [npm: react-resizable-panels](https://www.npmjs.com/package/react-resizable-panels) -- v4.6.5 confirmed, 2.7M weekly downloads, last published within days
- [GitHub: react-resizable-panels README](https://github.com/bvaughn/react-resizable-panels) -- v4 API: Group, Panel, Separator exports; orientation prop; pixel/percentage/CSS unit support
- [Next.js: react-hydration-error docs](https://nextjs.org/docs/messages/react-hydration-error) -- useEffect mount pattern for client-only rendering
- Existing codebase: `@glimmora/ui` EvidenceViewer (DS-38) -- reviewed source at `packages/ui/src/components/evidence-viewer/evidence-viewer.tsx`
- Existing codebase: `@glimmora/types` Evidence types -- reviewed at `packages/types/src/evidence.ts`
- Existing codebase: Zustand persist pattern -- verified in `apps/university-portal/src/store/auth-store.ts` and `apps/women-portal/src/store/language-store.ts`
- Existing codebase: MSW handler pattern -- verified in `apps/women-portal/src/lib/msw/handlers/`

### Secondary (MEDIUM confidence)
- [shadcn/ui issue #9136](https://github.com/shadcn-ui/ui/issues/9136) -- Confirmed v4 API name changes (PanelGroup->Group, PanelResizeHandle->Separator, direction->orientation); fix merged in PR #9461
- [react-resizable-panels SSR demo](https://github.com/bvaughn/react-resizable-panels-demo-ssr) -- Next.js SSR compatibility confirmed; cookie-based layout persistence for avoiding flicker

### Tertiary (LOW confidence)
- Web search results for auto-save patterns -- Multiple approaches exist; our choice (Zustand persist + debounce) is well-established but not "the one right answer"

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries verified via npm/codebase, versions confirmed
- Architecture: HIGH -- 3-panel pattern verified with react-resizable-panels v4 docs; existing codebase patterns directly reusable
- Types: HIGH -- derived from UX flow document 10 (every screen detailed) + existing @glimmora/types patterns
- MSW endpoints: HIGH -- systematically mapped from 20 requirements to REST endpoints
- Pitfalls: HIGH -- v4 API changes confirmed via shadcn/ui issue; hydration pattern is standard Next.js guidance

**Research date:** 2026-02-26
**Valid until:** 2026-03-26 (30 days -- stable libraries, no fast-moving concerns)
