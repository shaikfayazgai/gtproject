# Phase 2: Design System Completion - Research

**Researched:** 2026-02-26
**Domain:** React component library (Radix UI, charting, layout, governance-specific)
**Confidence:** HIGH

## Summary

Phase 2 adds 37 components (DS-11 through DS-47) to the existing `@glimmora/ui` library. The existing codebase establishes a clear pattern: `'use client'` directive per file, CVA for variant management, `cn()` for class merging, Radix primitives imported from the unified `radix-ui` package via namespaces (e.g., `import { Dialog as RadixDialog } from 'radix-ui'`), and `forwardRef` for ref forwarding. Storybook 10 with `@storybook/nextjs` framework and `@storybook/addon-a11y` only (no addon-essentials).

The unified `radix-ui@1.4.3` package already exposes namespaces for every Radix primitive needed: `DropdownMenu`, `ContextMenu`, `Popover`, `Tabs`, `Accordion`, `Slider`, `Avatar`, `Progress`, `Toast`, `ScrollArea`, and `Collapsible`. No additional Radix packages are needed. Three new npm packages are required: `react-day-picker` (DatePicker), `cmdk` (Combobox), and `@tanstack/react-table` (Table). For charting, `recharts@2.15.x` with a `react-is` pnpm override is the recommended approach, avoiding the v3 Redux/immer bloat. Simple visualizations (Progress Ring, Sparkline, Activity Heatmap) should be hand-built with SVG -- they are too simple to justify a library dependency.

**Primary recommendation:** Follow the established Phase 1 component pattern exactly. Most Phase 2 components are straightforward Radix wrappers with CVA variants. Build charts as custom SVG components. Use TanStack Table for the headless Table component. Build in dependency order: primitives first, then composed components (AppShell depends on Sidebar + TopBar), then governance-specific and data viz.

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| radix-ui | 1.4.3 | All interactive primitives (DropdownMenu, ContextMenu, Popover, Tabs, Accordion, Slider, Avatar, Progress, Toast, ScrollArea, Collapsible) | Installed |
| motion | 12.34.3 | Slide-out panel animation, skeleton shimmer | Installed |
| lucide-react | 0.475.0 | Icons for all components | Installed |
| class-variance-authority | 0.7.1 | Component variant management | Installed |
| tailwind-merge + clsx | 3.5.0 / 2.1.1 | Class name utilities | Installed |

### New Dependencies (To Install)
| Library | Version | Purpose | Confidence |
|---------|---------|---------|------------|
| react-day-picker | ^9.13.2 | DS-25 DatePicker | HIGH -- peer dep `react >=16.8.0`, no conflicts |
| cmdk | ^1.1.1 | DS-27 Combobox/Command Palette | HIGH -- peer dep `react ^18 \|\| ^19`, individual @radix-ui deps resolve via pnpm hoisting from unified package |
| @tanstack/react-table | ^8.21.3 | DS-36 Table (sorting, pagination, row selection) | HIGH -- peer dep `react >=16.8`, headless, zero styling opinions |
| recharts | ^2.15.4 | DS-44 Bar Chart only | MEDIUM -- needs `react-is` pnpm override for React 19 |
| react-is | ^19.2.4 | Recharts peer dep for React 19 | HIGH -- must match React version |
| prism-react-renderer | ^2.4.1 | DS-38 Evidence Viewer code syntax highlighting | HIGH -- peer dep `react >=16.0.0`, lightweight |

### Dependencies Considered and Rejected
| Library | Reason Rejected |
|---------|-----------------|
| recharts@3.7.0 | Brings @reduxjs/toolkit, immer, react-redux, reselect as dependencies. Massive bundle bloat for 1 bar chart component. v2.15.x is sufficient. |
| @uiw/react-heat-map | DS-47 heatmap is a simple colored grid. Custom SVG is ~40 lines. No library needed. |
| react-activity-calendar | Same rationale as above. Adds date-fns dependency (though react-day-picker already brings it). |
| shiki | 250KB+ with WASM. Only needed for VS Code-quality highlighting. prism-react-renderer is 10x lighter for client-side use. |
| @visx/* | Modular but low-level D3 wrappers. Doesn't support React 19 in peer deps (only up to ^18). |
| react-pdf / @react-pdf/renderer | Heavy. DS-38 document tab should use an iframe with the browser's native PDF viewer, not a React PDF renderer. |

### Installation Command
```bash
pnpm add react-day-picker cmdk @tanstack/react-table recharts@^2.15.4 react-is prism-react-renderer --filter @glimmora/ui
```

### Required pnpm Override (root package.json)
```json
{
  "pnpm": {
    "overrides": {
      "react-is": "^19.2.4"
    }
  }
}
```
This ensures recharts uses react-is@19 matching the installed React 19.2.4.

## Architecture Patterns

### Component File Pattern (Established in Phase 1)
Every component follows this exact structure:
```
packages/ui/src/components/
  [component-name]/
    [component-name].tsx          # Component implementation
    [component-name].stories.tsx  # Storybook stories
    index.ts                      # Re-export (optional, Phase 1 uses direct paths)
```

### Pattern 1: Radix Primitive Wrapper (Majority of DS-11..DS-27)
**What:** Import Radix namespace from `radix-ui`, re-export compound parts with Tailwind styling via CVA.
**When to use:** All components backed by a Radix primitive.
**Example:**
```typescript
// Source: Existing dialog.tsx pattern
'use client'
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui'
import { cn } from '../../lib/utils'

export const DropdownMenu = RadixDropdownMenu.Root
export const DropdownMenuTrigger = RadixDropdownMenu.Trigger

export function DropdownMenuContent({ className, sideOffset = 4, ...props }: RadixDropdownMenu.DropdownMenuContentProps) {
  return (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[180px] bg-bg-card border border-border rounded-card shadow-card p-1',
          className
        )}
        {...props}
      />
    </RadixDropdownMenu.Portal>
  )
}
// ... more sub-components
```

### Pattern 2: Custom Component with CVA Variants (Badge, Tag, Card, KPI Card)
**What:** Pure Tailwind component with CVA for variant-driven styling, no Radix dependency.
**When to use:** Components that are styled containers without interactive primitives.
**Example:**
```typescript
'use client'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-body font-medium uppercase tracking-wider',
  {
    variants: {
      status: {
        urgent: 'bg-status-urgent/10 text-status-urgent',
        normal: 'bg-status-neutral/10 text-status-neutral',
        inprogress: 'bg-status-inprogress/10 text-status-inprogress',
        done: 'bg-status-success/10 text-status-success',
        atrisk: 'bg-status-warning/10 text-status-warning',
      },
    },
    defaultVariants: { status: 'normal' },
  }
)

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, status, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ status }), className)} {...props} />
  )
)
Badge.displayName = 'Badge'
```

### Pattern 3: Composed Layout Component (AppShell, Sidebar, TopBar)
**What:** Client components that compose other components. AppShell is a layout shell combining Sidebar + TopBar + content area.
**When to use:** Layout components that manage UI state (sidebar collapse).
**Example:**
```typescript
'use client'
import { useState, createContext, useContext, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface AppShellContextValue {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

const AppShellContext = createContext<AppShellContextValue>({
  sidebarCollapsed: false,
  toggleSidebar: () => {},
})

export const useAppShell = () => useContext(AppShellContext)

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  return (
    <AppShellContext.Provider value={{ sidebarCollapsed, toggleSidebar: () => setSidebarCollapsed(p => !p) }}>
      <div className="flex h-screen bg-bg-app">
        {children}
      </div>
    </AppShellContext.Provider>
  )
}
```

### Pattern 4: SVG Data Visualization (Progress Ring, Sparkline, Heatmap)
**What:** Custom SVG components using only React + Tailwind CSS variables for colors.
**When to use:** Simple visualizations that don't need axes, tooltips, or interactivity beyond hover.
**Example:**
```typescript
'use client'
import { cn } from '../../lib/utils'

interface ProgressRingProps {
  value: number // 0-100
  size?: number
  strokeWidth?: number
  className?: string
}

export function ProgressRing({ value, size = 64, strokeWidth = 4, className }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <svg width={size} height={size} className={cn('transform -rotate-90', className)}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none"
        stroke="var(--color-hover)" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none"
        stroke="var(--color-brand-primary)" strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" className="transition-all duration-500" />
    </svg>
  )
}
```

### Pattern 5: Headless + Styled Table (TanStack Table)
**What:** TanStack Table provides the logic (sorting, pagination, row model). We render with Tailwind-styled HTML table.
**When to use:** DS-36 Table component.
**Example:**
```typescript
'use client'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { cn } from '../../lib/utils'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  pageSize?: number
}

export function DataTable<T>({ columns, data, pageSize = 10 }: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  return (
    <div className="rounded-card border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-bg-dashboard">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}
                  className="px-4 py-3 text-left text-xs font-body font-medium text-text-caption uppercase tracking-wider cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}>
                  <span className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && <ChevronUp className="h-3 w-3" />}
                    {header.column.getIsSorted() === 'desc' && <ChevronDown className="h-3 w-3" />}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-t border-border hover:bg-hover transition-colors">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-3 text-sm font-body text-text-body">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### Pattern 6: Animated Slide-Out Panel (motion)
**What:** Use motion's AnimatePresence for enter/exit animations on the slide-out panel.
**When to use:** DS-33 Slide-Out Panel.
**Example:**
```typescript
'use client'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface SlideOutPanelProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function SlideOutPanel({ open, onClose, children, className }: SlideOutPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'fixed right-0 top-0 h-full w-[380px] bg-bg-card shadow-card-hover z-50 p-6',
              className
            )}
          >
            <button onClick={onClose} className="absolute right-4 top-4 text-text-caption hover:text-text-body">
              <X className="h-4 w-4" />
            </button>
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
```

### Storybook Story Pattern (Established)
```typescript
import type { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta<typeof Component> = {
  title: 'Design System/[Component Name]',
  component: Component,
  parameters: { layout: 'padded' },  // or 'centered'
}
export default meta
type Story = StoryObj<typeof Component>

export const Default: Story = { /* ... */ }
export const AllVariants: Story = { render: () => (/* multi-variant showcase */) }
```

### Radix UI Namespace Reference (from radix-ui@1.4.3)
All available as `import { [Name] } from 'radix-ui'`:

| Namespace | Used For |
|-----------|----------|
| `DropdownMenu` | DS-11 |
| `ContextMenu` | DS-12 |
| `Popover` | DS-13 |
| `Tabs` | DS-14, DS-38 |
| `Accordion` | DS-15 |
| `Slider` | DS-16 |
| `Avatar` | DS-17 |
| `Toast` | DS-20 |
| `Progress` | DS-21 |
| `ScrollArea` | DS-36 (table scroll), DS-38 (evidence viewer) |
| `Collapsible` | DS-30 (sidebar collapse) |
| `Separator` | Various |
| `VisuallyHidden` | Accessibility labels |

### Anti-Patterns to Avoid
- **Installing individual @radix-ui/react-* packages:** The unified `radix-ui` package is already installed. Never add `@radix-ui/react-dialog` as a direct dependency.
- **Using Radix Portal for animated components:** The Slide-Out Panel should NOT use Radix Dialog/Portal. Use motion's AnimatePresence directly for full animation control.
- **Server Components for interactive UI:** Every component in `@glimmora/ui` must have `'use client'` at the top. The barrel `index.ts` must NOT have `'use client'`.
- **Using `React.FC`:** The codebase uses `forwardRef` with explicit types, not `React.FC`.
- **Grey skeleton shimmer:** DS-23 specifies warm `#F0E4DA` shimmer, not the typical grey. This maps to the existing `hover` color token.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dropdown/context menu keyboard navigation | Custom menu system | Radix DropdownMenu/ContextMenu | Focus management, arrow keys, typeahead, sub-menus, screen reader announcements |
| Date picker calendar logic | Custom calendar grid | react-day-picker v9 | Date math, locale support, keyboard nav, WCAG compliance, Jalali calendar support |
| Table sorting/pagination state | Custom sort + paginate hooks | @tanstack/react-table | Sort stability, multi-column sort, page state management, row selection model |
| Command palette search/filtering | Custom search with keyboard nav | cmdk | Fuzzy search, keyboard shortcuts, aria-listbox pattern, nested groups |
| Code syntax tokenization | Custom regex tokenizer | prism-react-renderer | Language grammars, token classification, theme support |
| Toast queueing/auto-dismiss | Custom toast state manager | Radix Toast (with Provider) | Viewport management, swipe-to-dismiss, pause-on-hover, accessible announcements |
| Accordion open/close state | Custom collapse with state | Radix Accordion | Single/multiple open modes, keyboard nav, animated height |

**Key insight:** Radix covers the accessibility and keyboard interaction layer. CVA covers the variant styling layer. The component author's job is solely connecting Radix primitives to Tailwind classes via the warm token palette. Do not re-implement any interactive behavior that Radix already provides.

## Common Pitfalls

### Pitfall 1: Radix Namespace Import Confusion
**What goes wrong:** Importing `Slot` directly instead of `SlotPrimitive.Slot`, or using `DialogContent` as a bare import instead of `RadixDialog.Content`.
**Why it happens:** The unified `radix-ui` package exports namespaces, not individual components. `import { Slot } from 'radix-ui'` gives you the namespace, not the component.
**How to avoid:** Always follow the pattern: `import { [Name] as Radix[Name] } from 'radix-ui'`, then use `Radix[Name].Root`, `Radix[Name].Content`, etc. Exception: `Slot` is imported as `SlotPrimitive` and used as `SlotPrimitive.Slot`.
**Warning signs:** TypeScript error "Property 'Root' does not exist on type..."

### Pitfall 2: Missing Portal for Floating UI
**What goes wrong:** Dropdown, Popover, Toast content renders inside the trigger's stacking context, clipped by `overflow: hidden`.
**Why it happens:** Forgetting `<Radix[Name].Portal>` wrapper around content.
**How to avoid:** Every floating component (DropdownMenu, ContextMenu, Popover, Toast, Select) must wrap its content in the corresponding `.Portal` component.
**Warning signs:** Menu/popover appears but is cut off or positioned wrong.

### Pitfall 3: react-day-picker CSS Not Loading in Storybook
**What goes wrong:** DatePicker renders unstyled or with broken layout.
**Why it happens:** Storybook doesn't automatically import the react-day-picker CSS.
**How to avoid:** Import `react-day-picker/style.css` in the DatePicker component file, then override CSS variables with the warm palette. Alternatively, use the `classNames` prop with Tailwind classes.
**Warning signs:** Calendar renders as plain text or with wrong spacing.

### Pitfall 4: recharts react-is Version Mismatch
**What goes wrong:** Build warnings or runtime errors because recharts bundles `react-is@18.x` but the app uses React 19.
**Why it happens:** recharts@2.15.x has `react-is: "^18.3.1"` as a dependency (not peer dep).
**How to avoid:** Add pnpm override in root `package.json`: `"pnpm": { "overrides": { "react-is": "^19.2.4" } }`.
**Warning signs:** Console warnings about mismatched React versions or `react-is` returning wrong results.

### Pitfall 5: AppShell Context Not Available
**What goes wrong:** `useAppShell()` returns default values or throws because AppShell provider isn't in the component tree.
**Why it happens:** Using Sidebar or TopBar outside of AppShell wrapper.
**How to avoid:** AppShell must be the outermost layout wrapper. In Storybook, create a decorator that wraps stories in AppShell. In Next.js, AppShell goes in the root layout.
**Warning signs:** Sidebar collapse button does nothing, sidebar state doesn't persist.

### Pitfall 6: Storybook ESM-Only Config
**What goes wrong:** Adding new Storybook addons that aren't ESM-compatible causes build failures.
**Why it happens:** Storybook 10 is ESM-only. The config uses `@storybook/nextjs` framework and only `@storybook/addon-a11y`.
**How to avoid:** Do not add `@storybook/addon-essentials` or any CJS-only addons. If new addons are needed, verify ESM compatibility first.
**Warning signs:** Storybook build fails with "require is not defined" or module resolution errors.

### Pitfall 7: cmdk Radix Dependency Version Drift
**What goes wrong:** cmdk's internal @radix-ui/react-dialog@^1.1.6 conflicts with the version used by radix-ui@1.4.3.
**Why it happens:** cmdk depends on individual Radix packages which may resolve to different versions than what the unified package uses internally.
**How to avoid:** After installing cmdk, verify that pnpm resolves @radix-ui/react-dialog to the same version used by radix-ui. Check `pnpm ls @radix-ui/react-dialog`. If different versions appear, add a pnpm override.
**Warning signs:** Multiple copies of @radix-ui/react-dialog in the bundle, or dialog focus management breaks inside cmdk.

### Pitfall 8: Motion AnimatePresence Key Requirement
**What goes wrong:** Exit animation doesn't play, component just disappears.
**Why it happens:** AnimatePresence children must have a unique `key` prop, and the component must be conditionally rendered (not just hidden via CSS).
**How to avoid:** Always use conditional rendering (`{open && <motion.div key="panel" ...>`}), never `display: none`.
**Warning signs:** Entry animation works but exit doesn't.

## Code Examples

### react-day-picker with Warm Theme (DS-25)
```typescript
// Source: https://daypicker.dev/start + https://daypicker.dev/docs/styling
'use client'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { cn } from '../../lib/utils'

interface DatePickerProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
}

export function DatePicker({ selected, onSelect, className }: DatePickerProps) {
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      animate
      className={cn('rdp-warm', className)}
      classNames={{
        root: 'font-body text-text-body',
        day_button: 'rounded-inner hover:bg-hover',
        selected: 'bg-brand-primary text-white hover:bg-brand-primary/90',
        today: 'font-bold text-brand-primary',
        chevron: 'text-brand-primary',
      }}
    />
  )
}
```

### cmdk Combobox (DS-27)
```typescript
// Source: https://cmdk.paco.me/
'use client'
import { Command } from 'cmdk'
import { Search } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ComboboxProps {
  placeholder?: string
  children: React.ReactNode
  className?: string
}

export function Combobox({ placeholder = 'Search...', children, className }: ComboboxProps) {
  return (
    <Command className={cn('rounded-card border border-border bg-bg-card shadow-card', className)}>
      <div className="flex items-center border-b border-border px-3">
        <Search className="h-4 w-4 text-text-caption mr-2" />
        <Command.Input
          placeholder={placeholder}
          className="flex h-10 w-full bg-transparent text-sm font-body text-text-body placeholder:text-text-disabled outline-none"
        />
      </div>
      <Command.List className="max-h-[300px] overflow-y-auto p-1">
        <Command.Empty className="py-6 text-center text-sm text-text-caption font-body">
          No results found.
        </Command.Empty>
        {children}
      </Command.List>
    </Command>
  )
}

export function ComboboxGroup({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group heading={heading} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-body [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-text-caption [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
      {children}
    </Command.Group>
  )
}

export function ComboboxItem({ children, onSelect, ...props }: Command.CommandItemProps) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="relative flex cursor-pointer select-none items-center rounded-inner px-3 py-2 text-sm font-body text-text-body hover:bg-hover data-[selected=true]:bg-hover outline-none"
      {...props}
    >
      {children}
    </Command.Item>
  )
}
```

### Recharts Bar Chart with Warm Palette (DS-44)
```typescript
// Source: https://recharts.github.io/en-US/api/BarChart
'use client'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '../../lib/utils'

interface BarChartProps {
  data: Array<Record<string, unknown>>
  dataKey: string
  xAxisKey: string
  height?: number
  className?: string
}

export function BarChart({ data, dataKey, xAxisKey, height = 300, className }: BarChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fontFamily: 'var(--font-body)', fill: 'var(--color-text-caption)' }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fontFamily: 'var(--font-body)', fill: 'var(--color-text-caption)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-inner)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--color-text-body)',
            }}
          />
          <Bar dataKey={dataKey} fill="var(--color-brand-primary)" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

### Sparkline with Raw SVG (DS-46)
```typescript
'use client'
import { cn } from '../../lib/utils'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  className?: string
}

export function Sparkline({ data, width = 120, height = 32, className }: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg
      width={width}
      height={height}
      className={cn('inline-block', className)}
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-brand-primary)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
```

### Activity Heatmap with Custom SVG Grid (DS-47)
```typescript
'use client'
import { cn } from '../../lib/utils'

interface HeatmapData {
  date: string
  count: number
}

interface ActivityHeatmapProps {
  data: HeatmapData[]
  weeks?: number
  className?: string
}

const CELL_SIZE = 12
const GAP = 2
const DAYS = 7

function getIntensityColor(count: number, maxCount: number): string {
  if (count === 0) return 'var(--color-hover)'
  const ratio = count / maxCount
  if (ratio <= 0.25) return 'var(--color-brand-sand)'
  if (ratio <= 0.5) return 'var(--color-brand-primary)'
  if (ratio <= 0.75) return 'var(--color-brand-forest)'
  return 'var(--color-status-success)'
}

export function ActivityHeatmap({ data, weeks = 20, className }: ActivityHeatmapProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1)
  const totalCells = weeks * DAYS

  return (
    <svg
      width={weeks * (CELL_SIZE + GAP)}
      height={DAYS * (CELL_SIZE + GAP)}
      className={cn('inline-block', className)}
    >
      {Array.from({ length: totalCells }, (_, i) => {
        const week = Math.floor(i / DAYS)
        const day = i % DAYS
        const entry = data[i]
        return (
          <rect
            key={i}
            x={week * (CELL_SIZE + GAP)}
            y={day * (CELL_SIZE + GAP)}
            width={CELL_SIZE}
            height={CELL_SIZE}
            rx={2}
            fill={entry ? getIntensityColor(entry.count, maxCount) : 'var(--color-hover)'}
          >
            {entry && <title>{`${entry.date}: ${entry.count}`}</title>}
          </rect>
        )
      })}
    </svg>
  )
}
```

### Evidence Viewer Code Tab (DS-38 partial)
```typescript
// Source: https://github.com/FormidableLabs/prism-react-renderer
'use client'
import { Highlight, themes } from 'prism-react-renderer'
import { cn } from '../../lib/utils'

interface CodeViewerProps {
  code: string
  language: string
  className?: string
}

export function CodeViewer({ code, language, className }: CodeViewerProps) {
  return (
    <Highlight theme={themes.github} code={code} language={language}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className={cn('p-4 rounded-inner bg-bg-dashboard overflow-x-auto text-sm font-mono', className)}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="leading-relaxed">
              <span className="inline-block w-8 text-right mr-4 text-text-disabled select-none">{i + 1}</span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
```

## Build Order / Dependency Graph

Components must be built in dependency order. Some Phase 2 components depend on others:

### Wave 1: Independent Primitives (No Internal Dependencies)
These can be built in any order, in parallel:
- DS-11: Dropdown Menu
- DS-12: Context Menu
- DS-13: Popover
- DS-14: Tabs
- DS-15: Accordion
- DS-16: Slider
- DS-17: Avatar
- DS-18: Badge/Status Chip
- DS-19: Tag
- DS-20: Toast/Notification
- DS-21: Progress Bar
- DS-22: Spinner/Loader
- DS-23: Skeleton
- DS-25: Date Picker
- DS-28: Card

### Wave 2: Components Depending on Wave 1
- DS-24: File Upload (may use Progress Bar DS-21, Spinner DS-22)
- DS-27: Combobox/Command Palette (standalone, but test with Popover)
- DS-26: Stepper (uses internal state only)
- DS-29: Gradient Card (variant of Card DS-28)
- DS-33: Slide-Out Panel (standalone, uses motion)
- DS-34: Page Header (standalone)
- DS-35: Empty State (standalone)
- DS-45: Progress Ring (standalone SVG)
- DS-46: Sparkline (standalone SVG)
- DS-47: Activity Heatmap (standalone SVG)

### Wave 3: Components Depending on Wave 2
- DS-30: Sidebar (uses Avatar DS-17)
- DS-31: Top Action Bar (uses Avatar DS-17, Breadcrumb logic)
- DS-36: Table (uses Badge DS-18 in examples, standalone as component)
- DS-37: KPI Stat Card (uses Sparkline DS-46, Gradient Card DS-29 optionally)
- DS-44: Bar Chart (uses recharts, standalone)

### Wave 4: Composed Components
- DS-32: AppShell (composes Sidebar DS-30 + TopBar DS-31)
- DS-43: Timeline Bar (standalone, but tests may use Card DS-28)

### Wave 5: Governance-Specific (Most Complex, Depend on Primitives)
- DS-38: Evidence Viewer (uses Tabs DS-14, CodeViewer, Card DS-28, ScrollArea)
- DS-39: PoDL Credential Card (uses Card DS-28, Badge DS-18, Avatar DS-17)
- DS-40: APG Activity Feed (uses Avatar DS-17, Badge DS-18, Accordion DS-15)
- DS-41: Skill Genome Panel (uses Tag DS-19, Progress Bar DS-21, Card DS-28)
- DS-42: Anonymized Team Card (uses Avatar DS-17 anonymous mode, Card DS-28)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| framer-motion package | motion package (import from `motion/react`) | 2024 Q4 | Already using correct package name in this project |
| react-day-picker v8 (date-fns as peer dep) | react-day-picker v9 (date-fns bundled, CSS variables) | 2024 | v9 has simpler API, built-in CSS variables |
| @radix-ui/react-* individual packages | `radix-ui` unified package | 2025 Q1 | Already using unified package in this project |
| Recharts v2 (lodash, victory-vendor) | Recharts v3 (Redux toolkit, no lodash) | 2025 | Stick with v2.15.x to avoid Redux bundle cost |
| Storybook 8 with addon-essentials | Storybook 10 ESM-only | 2025 | Already on Storybook 10 in this project |

**Deprecated/outdated patterns to avoid:**
- `import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'` -- Use unified package instead
- `import { motion } from 'framer-motion'` -- Package renamed to `motion`, import from `motion/react`
- `React.FC<Props>` -- Use `forwardRef` with explicit generic types

## Open Questions

1. **cmdk + Radix Dialog version alignment**
   - What we know: cmdk@1.1.1 depends on @radix-ui/react-dialog@^1.1.6. The unified radix-ui@1.4.3 bundles @radix-ui/react-dialog@1.1.15 (seen in pnpm store). Version ^1.1.6 satisfies 1.1.15.
   - What's unclear: Whether pnpm correctly deduplicates the individual package with the one bundled inside the unified package, or installs a second copy.
   - Recommendation: Install cmdk, then run `pnpm ls @radix-ui/react-dialog` to verify single resolution. Add pnpm override if needed.
   - Confidence: MEDIUM -- likely fine, but verify after install.

2. **Recharts v2 vs v3 long-term**
   - What we know: v3 is the actively maintained version with Redux deps. v2.15.x still works with React 19 via override. Only DS-44 (Bar Chart) uses Recharts.
   - What's unclear: Whether recharts v2 will continue receiving maintenance patches.
   - Recommendation: Use v2 for now (lighter bundle). If v2 stops receiving fixes, migration to v3 is straightforward since the component API is mostly the same.
   - Confidence: HIGH for immediate use, MEDIUM for long-term.

3. **Evidence Viewer PDF/Document Tab**
   - What we know: prism-react-renderer handles code. Video can use a simple iframe.
   - What's unclear: PDF preview is complex. react-pdf adds significant weight.
   - Recommendation: For Phase 2, the Document tab should render a download link and file metadata (name, size, type). If inline PDF preview is needed later, use an iframe with the browser's native PDF viewer (`<iframe src={pdfUrl} />`). Do not install a PDF rendering library in Phase 2.
   - Confidence: HIGH for the recommended approach.

4. **Avatar Anonymous Mode Shape Generation**
   - What we know: DS-17 and DS-42 need generated abstract shapes instead of photos/initials for blind review.
   - What's unclear: Best approach for deterministic shape generation from a seed (user ID hash).
   - Recommendation: Use SVG with a simple deterministic pattern: hash the user ID to select from 6-8 predefined abstract SVG shapes and assign a color from the palette. This avoids any library dependency and keeps the bundle minimal.
   - Confidence: HIGH -- simple implementation, no library needed.

## Sources

### Primary (HIGH confidence)
- radix-ui@1.4.3 installed package -- verified all namespace exports from `dist/index.d.ts`
- npm registry -- verified versions, peer deps, and dependencies for all recommended packages
- Existing codebase (`packages/ui/src/`) -- verified established patterns from Phase 1 components
- react-day-picker official docs (daypicker.dev) -- styling, API, CSS variables

### Secondary (MEDIUM confidence)
- Recharts migration guide (github wiki) -- v3 breaking changes, dependency changes
- cmdk GitHub issues -- React 19 compatibility status, resolved in v1.1.1
- shadcn/ui changelog -- unified radix-ui package migration patterns
- motion.dev docs -- AnimatePresence API for slide animations

### Tertiary (LOW confidence)
- recharts v2 long-term maintenance status -- no official deprecation announcement found
- cmdk + unified radix-ui deduplication behavior -- logic suggests it works, but not explicitly tested

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages verified via npm registry for version, peer deps, React 19 compatibility
- Architecture: HIGH -- patterns derived directly from existing Phase 1 codebase
- Pitfalls: HIGH -- based on verified dependency analysis and documented issues
- Build order: MEDIUM -- logical dependency analysis, but some components may have undiscovered dependencies
- Data visualization approach: MEDIUM -- recommendation to build simple charts as SVG is sound, but may need refinement during implementation

**Research date:** 2026-02-26
**Valid until:** 2026-03-26 (30 days -- ecosystem is stable, no major version changes expected)
