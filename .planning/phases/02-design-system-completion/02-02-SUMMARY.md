---
phase: 02-design-system-completion
plan: 02
subsystem: ui
tags: [react, tanstack-table, motion, cva, tailwind, layout, appshell, datatable, sidebar]

# Dependency graph
requires:
  - phase: 02-01
    provides: Avatar (Sidebar/TopBar), Badge, Tabs, Progress
  - phase: 02-04
    provides: Sparkline (KPI Stat Card embed)
  - phase: 01-03
    provides: Component patterns (CVA, cn, forwardRef, Radix), Storybook config
provides:
  - DS-28 Card (compound: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
  - DS-29 GradientCard (primary terracotta-gold, nature forest-teal)
  - DS-30 Sidebar (collapsible, terracotta active accent, avatar bottom area)
  - DS-31 TopBar (breadcrumb, search, actions, primaryAction)
  - DS-32 AppShell (context provider for sidebar collapse state)
  - DS-33 SlideOutPanel (380px right panel, 200ms ease-out animation)
  - DS-34 PageHeader (title, subtitle, breadcrumb, actions)
  - DS-35 EmptyState (icon, title, description, CTA)
  - DS-36 DataTable (TanStack react-table, sorting, pagination, row selection)
  - DS-37 KPIStatCard (Miller Display 36px numbers, trend badge, Sparkline embed)
affects: [02-03, 03-portal-pages, 04-feature-pages, 05-complex-pages]

# Tech tracking
tech-stack:
  added: ["@tanstack/react-table"]
  patterns:
    - "AppShell context pattern: useAppShell() provides sidebarCollapsed/toggleSidebar"
    - "Compound card pattern: Card + CardHeader + CardTitle + CardDescription + CardContent + CardFooter"
    - "Gradient variants via CVA: primary (terracotta-gold) and nature (forest-teal)"
    - "DataTable generic component: DataTable<T> with ColumnDef<T> from TanStack"

key-files:
  created:
    - packages/ui/src/components/card/card.tsx
    - packages/ui/src/components/gradient-card/gradient-card.tsx
    - packages/ui/src/components/sidebar/sidebar.tsx
    - packages/ui/src/components/top-bar/top-bar.tsx
    - packages/ui/src/components/app-shell/app-shell.tsx
    - packages/ui/src/components/slide-out-panel/slide-out-panel.tsx
    - packages/ui/src/components/page-header/page-header.tsx
    - packages/ui/src/components/empty-state/empty-state.tsx
    - packages/ui/src/components/data-table/data-table.tsx
    - packages/ui/src/components/kpi-stat-card/kpi-stat-card.tsx
  modified:
    - packages/ui/src/index.ts
    - packages/ui/package.json
    - pnpm-lock.yaml

key-decisions:
  - "AppShell uses React context (not prop drilling) for sidebar state sharing between Sidebar/TopBar"
  - "DataTable uses generic <T> type parameter with TanStack ColumnDef for type-safe columns"
  - "KPIStatCard value is string|number to support formatted values like '92%' or '3.2d'"
  - "Sidebar active indicator uses border-l-2 border-brand-primary (terracotta left accent)"

patterns-established:
  - "AppShell context: createContext + useAppShell hook for cross-component layout state"
  - "Compound component: Card sub-components exported individually for composability"
  - "Generic data component: DataTable<T> pattern for type-safe reusable tables"
  - "Gradient card via CVA variants: bg-gradient-to-r with brand color tokens"

# Metrics
duration: 8min
completed: 2026-02-26
---

# Phase 2 Plan 2: Layout & Structure Components Summary

**10 layout/structure components (Card, GradientCard, Sidebar, TopBar, AppShell, SlideOutPanel, PageHeader, EmptyState, DataTable, KPIStatCard) with TanStack Table, motion animations, and AppShell context pattern**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-26T09:58:16Z
- **Completed:** 2026-02-26T10:05:58Z
- **Tasks:** 2
- **Files modified:** 33

## Accomplishments

- Built all 10 layout/structure components (DS-28 through DS-37) with full Storybook coverage
- AppShell + Sidebar + TopBar compose into a complete portal shell with collapsible sidebar via React context
- DataTable with TanStack react-table: sorting by column headers, pagination with page controls, optional row selection with styled checkboxes, warm header background
- KPIStatCard renders Miller Display numbers at 36px with trend badges and optional Sparkline embed from 02-04
- SlideOutPanel with motion/react 200ms ease-out slide animation and AnimatePresence exit support

## Task Commits

Each task was committed atomically:

1. **Task 1: Card, GradientCard, SlideOutPanel, PageHeader, EmptyState + TanStack install** - `59e7dee` (feat)
2. **Task 2: Sidebar, TopBar, AppShell, DataTable, KPIStatCard + barrel exports** - `f9680fb` (feat)

## Files Created/Modified

- `packages/ui/src/components/card/card.tsx` - Compound card with 6 sub-components (Card, Header, Title, Description, Content, Footer)
- `packages/ui/src/components/gradient-card/gradient-card.tsx` - CVA gradient variants (primary/nature)
- `packages/ui/src/components/slide-out-panel/slide-out-panel.tsx` - 380px right panel with motion/react animation
- `packages/ui/src/components/page-header/page-header.tsx` - Title, subtitle, breadcrumb, actions layout
- `packages/ui/src/components/empty-state/empty-state.tsx` - Centered icon + title + description + CTA
- `packages/ui/src/components/app-shell/app-shell.tsx` - Context provider for sidebar collapsed state
- `packages/ui/src/components/sidebar/sidebar.tsx` - Collapsible sidebar with terracotta active accent
- `packages/ui/src/components/top-bar/top-bar.tsx` - Top action bar with breadcrumb and sidebar toggle
- `packages/ui/src/components/data-table/data-table.tsx` - Generic DataTable<T> with TanStack react-table
- `packages/ui/src/components/kpi-stat-card/kpi-stat-card.tsx` - KPI display with trend badge and Sparkline
- `packages/ui/src/index.ts` - Barrel exports updated with all 10 new components
- `packages/ui/package.json` - @tanstack/react-table added as dependency
- 10 Storybook story files demonstrating all component variants
- 10 index.ts barrel export files

## Decisions Made

- **AppShell context pattern:** Used React createContext + useAppShell hook rather than prop drilling for sidebar state. Sidebar and TopBar both consume the same context, allowing the collapse toggle to work from either component.
- **DataTable generic type:** DataTable<T> accepts ColumnDef<T, unknown>[] for type-safe column definitions. This avoids `any` while remaining flexible for any data shape.
- **KPIStatCard value typing:** Used `string | number` for the value prop to support both raw numbers (847) and formatted strings ("92%", "3.2d") without a separate formatter.
- **Sidebar active indicator:** Terracotta left-border accent (`border-l-2 border-brand-primary`) on active nav item, matching the brand's warm earth palette.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 10 layout/structure components complete and type-checked
- Full turbo build passes across all 5 portal workspaces
- Ready for 02-03 (remaining DS components) to complete the design system
- Portal page development (Phase 3+) can now compose AppShell + Sidebar + TopBar + DataTable + Cards for full layouts

---
*Phase: 02-design-system-completion*
*Completed: 2026-02-26*
