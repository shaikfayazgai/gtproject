# Phase 6: Admin Panel - Research

**Researched:** 2026-02-27
**Domain:** Admin panel UI — platform oversight, user management, dispute resolution, reports, APG configuration
**Confidence:** HIGH (entirely based on existing codebase patterns + locked CONTEXT.md decisions)

## Summary

The admin panel is the platform's control surface for administrators, providing oversight of all entities created in Phases 1-5. The `apps/admin-panel/` app already exists with scaffolding: Next.js 15.5, MSW dual-runtime, TanStack Query, Zustand, providers, and a canary page proving the full toolchain works. The admin panel runs on port 3005.

The implementation follows the exact same patterns as `enterprise-portal` and `mentor-portal`: AppShell + Sidebar layout, `DataTable<T>` with TanStack Table column definitions, GradientCard KPI rows, `ResizablePanelGroup` for multi-panel views (dispute detail), Zustand persist for auth, and MSW handlers/factories for mock data.

The main work is: (1) adding ~15 new TypeScript interfaces to `@glimmora/types`, (2) building the admin's route structure with 5 main sections, (3) creating MSW factories for the admin's broader data scope (6 user types, disputes, reports, audit log), (4) implementing the dispute 3-panel layout (reusing the mentor review pattern), and (5) adding PDF/CSV export for reports.

**Primary recommendation:** Reuse every established pattern directly. No new UI framework components needed in `@glimmora/ui`. The admin panel is a composition of patterns already proven across 4 portals — the novelty is in the breadth of data and the dispute/audit-log domain logic, not in new UI primitives.

## Standard Stack

### Core (already in admin-panel/package.json or needs adding)

| Library | Version | Purpose | Status in admin-panel |
|---------|---------|---------|----------------------|
| Next.js | ^15.3.3 | App Router, RSC | Already installed |
| React | ^19.1.0 | UI framework | Already installed |
| TypeScript | ^5.8.3 | Type safety | Already installed |
| @glimmora/ui | workspace:* | Design system components | Already installed |
| @glimmora/types | workspace:* | Shared type definitions | Already installed |
| @glimmora/config | workspace:* | Tailwind theme, TS config | Already installed |
| @tanstack/react-query | ^5.90.21 | Server state, polling | Already installed |
| @tanstack/react-query-devtools | ^5.91.3 | Query debugging | Already installed |
| msw | ^2.12.10 | API mocking | Already installed |
| zustand | ^5.0.11 | Client state (auth, UI) | Already installed |

### Needs Adding to admin-panel/package.json

| Library | Version | Purpose | Why Needed |
|---------|---------|---------|------------|
| @tanstack/react-table | ^8.21.3 | DataTable column defs (pnpm strict) | ColumnDef import needed directly |
| lucide-react | ^0.575.0 | Icons | Every portal needs this as direct dep |
| date-fns | ^4.1.0 | Date formatting (audit timestamps) | Admin is heavily timestamp-oriented |
| recharts | ^2.15.4 | Charts in reports/analytics | Report builder charts |
| @react-pdf/renderer | ^4.3.2 | PDF export for reports | Report PDF generation |

### Installation

```bash
cd apps/admin-panel
pnpm add @tanstack/react-table@^8.21.3 lucide-react@^0.575.0 date-fns@^4.1.0 recharts@^2.15.4 @react-pdf/renderer@^4.3.2
```

## Architecture Patterns

### Existing Scaffolding (already in apps/admin-panel/)

The admin-panel app already has:
- `src/app/layout.tsx` — Root layout with Providers, metadata
- `src/app/globals.css` — Tailwind v4 theme import
- `src/components/providers/Providers.tsx` — MSWProvider + QueryProvider
- `src/components/providers/MSWProvider.tsx` — Browser SW init
- `src/components/providers/QueryProvider.tsx` — QueryClient with staleTime: 60s
- `src/lib/msw/browser.ts` — setupWorker
- `src/lib/msw/server.ts` — setupServer
- `src/lib/msw/handlers.ts` — Stub with /api/health and /api/tasks
- `src/store/app-store.ts` — Sidebar Zustand store (not persist)
- `instrumentation.ts` — MSW server-side init (at project root, NOT in src/)
- `public/mockServiceWorker.js` — Service worker file
- `next.config.ts` — transpilePackages configured
- `tsconfig.json` — Extends @glimmora/config, path alias @/*
- Port: 3005

### Recommended Directory Structure

```
apps/admin-panel/src/
├── app/
│   ├── layout.tsx                          # (exists) Root layout
│   ├── globals.css                         # (exists) Theme import
│   ├── (pre-auth)/
│   │   ├── layout.tsx                      # Centered card layout
│   │   └── page.tsx                        # Login / redirect
│   └── (app)/
│       ├── layout.tsx                      # AppShell + Sidebar + TopBar
│       ├── dashboard/
│       │   └── page.tsx                    # AP-01: Platform overview + alerts
│       ├── users/
│       │   ├── page.tsx                    # AP-02/03: User list (all 6 types)
│       │   ├── [userId]/
│       │   │   └── page.tsx               # AP-04: 6-tab user detail
│       │   └── verification-queue/
│       │       └── page.tsx               # AP-05: Pending verifications
│       ├── projects/
│       │   ├── page.tsx                   # AP-07: Project list
│       │   └── [projectId]/
│       │       └── page.tsx               # AP-08/09/10: 10-tab project admin view
│       ├── disputes/
│       │   ├── page.tsx                   # AP-11: Dispute queue
│       │   ├── [disputeId]/
│       │   │   └── page.tsx               # AP-12/13/14: Dispute detail (3-panel)
│       │   └── safety/
│       │       └── page.tsx               # AP-15: Safety Case protocol
│       ├── reports/
│       │   ├── page.tsx                   # AP-16: Report types list
│       │   └── builder/
│       │       └── page.tsx               # AP-17: Custom report builder
│       ├── content/
│       │   ├── skills/
│       │   │   └── page.tsx               # AP-19: Skill taxonomy management
│       │   └── announcements/
│       │       └── page.tsx               # AP-20: Platform announcements
│       ├── apg-config/
│       │   └── page.tsx                   # AP-21: APG configuration (Super Admin)
│       └── audit-log/
│           └── page.tsx                   # AP-23: Platform audit log
├── components/
│   ├── dashboard/
│   │   ├── stats-grid.tsx                 # 6 GradientCard KPIs
│   │   ├── pending-actions-card.tsx       # Verification, disputes, escalations
│   │   └── system-alert-feed.tsx          # Alert feed with dismiss + deep-link
│   ├── users/
│   │   ├── user-list-table.tsx            # DataTable with type filter
│   │   ├── user-detail-tabs.tsx           # 6-tab component
│   │   ├── user-profile-tab.tsx
│   │   ├── user-activity-tab.tsx
│   │   ├── user-projects-tab.tsx
│   │   ├── user-payments-tab.tsx
│   │   ├── user-podl-tab.tsx
│   │   ├── user-audit-tab.tsx
│   │   ├── verification-queue-table.tsx
│   │   └── user-action-dialog.tsx         # Confirm + reason field
│   ├── projects/
│   │   ├── project-list-table.tsx
│   │   ├── project-admin-tabs.tsx         # 10-tab component
│   │   ├── admin-intervention-log.tsx
│   │   ├── apg-activity-tab.tsx
│   │   └── freeze-dialog.tsx
│   ├── disputes/
│   │   ├── dispute-queue-table.tsx
│   │   ├── dispute-detail-layout.tsx      # 3-panel (ResizablePanelGroup)
│   │   ├── case-context-panel.tsx
│   │   ├── evidence-messages-panel.tsx
│   │   ├── decision-form-panel.tsx
│   │   ├── dispute-audit-trail.tsx
│   │   └── safety-case-view.tsx
│   ├── reports/
│   │   ├── report-type-card.tsx
│   │   ├── report-builder-form.tsx
│   │   └── report-pdf-document.tsx
│   ├── content/
│   │   ├── skill-taxonomy-tree.tsx
│   │   └── announcements-form.tsx
│   ├── apg-config/
│   │   └── config-card.tsx                # Inline-edit config cards
│   ├── audit-log/
│   │   └── audit-log-table.tsx            # DataTable with filters
│   └── dev/
│       └── role-switcher.tsx              # DevTools overlay
├── store/
│   ├── app-store.ts                       # (exists) Sidebar state
│   └── auth-store.ts                      # Admin auth with adminRole field
├── lib/
│   └── msw/
│       ├── browser.ts                     # (exists)
│       ├── server.ts                      # (exists)
│       ├── handlers.ts                    # (exists — needs restructuring)
│       ├── handlers/
│       │   ├── index.ts                   # Aggregate all handlers
│       │   ├── auth.ts
│       │   ├── dashboard.ts
│       │   ├── users.ts
│       │   ├── projects.ts
│       │   ├── disputes.ts
│       │   ├── reports.ts
│       │   ├── content.ts
│       │   ├── apg-config.ts
│       │   └── audit-log.ts
│       └── factories/
│           ├── common.ts                  # randomId, isoNow, isoPast, isoFuture
│           ├── user.ts                    # 6 user type generators
│           ├── project.ts                 # Projects in various states
│           ├── dispute.ts                 # 5 dispute types, decisions, safety cases
│           ├── report.ts                  # Report data, metrics
│           ├── audit-log.ts              # Audit entries
│           └── system-alert.ts           # Alert feed data
```

### Pattern 1: AppShell + Sidebar Layout

**What:** Standard sidebar navigation layout reused across all portals
**Source:** `apps/enterprise-portal/src/app/(app)/layout.tsx`
**Confidence:** HIGH — directly observed in codebase

```typescript
// apps/admin-panel/src/app/(app)/layout.tsx
'use client'
import { AppShell, Sidebar, TopBar } from '@glimmora/ui'
import type { SidebarNavItem } from '@glimmora/ui'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, FolderKanban, Scale,
  FileText, BookOpen, Bot, ScrollText, Settings, Shield,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { adminRole } = useAuthStore()

  const navItems: SidebarNavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, active: pathname === '/dashboard' },
    { label: 'Users', href: '/users', icon: <Users className="h-5 w-5" />, active: pathname.startsWith('/users') },
    { label: 'Projects', href: '/projects', icon: <FolderKanban className="h-5 w-5" />, active: pathname.startsWith('/projects') },
    { label: 'Disputes', href: '/disputes', icon: <Scale className="h-5 w-5" />, active: pathname.startsWith('/disputes') },
    { label: 'Reports', href: '/reports', icon: <FileText className="h-5 w-5" />, active: pathname.startsWith('/reports') },
    { label: 'Content', href: '/content/skills', icon: <BookOpen className="h-5 w-5" />, active: pathname.startsWith('/content') },
    { label: 'APG Config', href: '/apg-config', icon: <Bot className="h-5 w-5" />, active: pathname.startsWith('/apg-config') },
    { label: 'Audit Log', href: '/audit-log', icon: <ScrollText className="h-5 w-5" />, active: pathname.startsWith('/audit-log') },
  ]

  return (
    <AppShell>
      <Sidebar navItems={navItems} logo={...} bottomContent={...} />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar breadcrumb={<span className="text-sm font-body text-text-caption">Admin Panel</span>} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </AppShell>
  )
}
```

### Pattern 2: Auth Store with Admin Role

**What:** Zustand persist store with adminRole enum for Super Admin gating
**Source:** `apps/enterprise-portal/src/store/auth-store.ts` (pattern), CONTEXT.md (role spec)
**Confidence:** HIGH

```typescript
// apps/admin-panel/src/store/auth-store.ts
'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AdminRole = 'standard_admin' | 'super_admin'

interface AdminUser {
  id: string
  displayName: string
  email: string
  adminRole: AdminRole
}

interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  adminRole: AdminRole
  setUser: (user: AdminUser) => void
  setAdminRole: (role: AdminRole) => void  // For DevTools role switcher
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      adminRole: 'standard_admin',
      setUser: (user) => set({ user, isAuthenticated: true, adminRole: user.adminRole }),
      setAdminRole: (adminRole) => set({ adminRole }),
      logout: () => set({ user: null, isAuthenticated: false, adminRole: 'standard_admin' }),
    }),
    {
      name: 'glimmora-admin-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

### Pattern 3: Dispute Detail 3-Panel Layout

**What:** ResizablePanelGroup for dispute review — mirrors mentor review layout
**Source:** `apps/mentor-portal/src/components/review-detail/review-layout.tsx`
**Confidence:** HIGH — direct pattern reuse

```typescript
// Same pattern as ReviewLayout but with dispute-specific panels:
// Left: Case context + parties (25%)
// Center: Evidence/messages (45%)
// Right: Decision form with 5 decision types (30%)
<ResizablePanelGroup orientation="horizontal" autoSaveId="admin-dispute-layout">
  <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
    <CaseContextPanel dispute={dispute} />
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={45} minSize={30}>
    <EvidenceMessagesPanel dispute={dispute} />
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
    <DecisionFormPanel disputeId={dispute.id} />
  </ResizablePanel>
</ResizablePanelGroup>
```

### Pattern 4: DataTable with Column Definitions

**What:** Generic DataTable component with typed columns
**Source:** `apps/enterprise-portal/src/components/payments/payment-history-table.tsx`
**Confidence:** HIGH

Key points:
- Import `ColumnDef` from `@tanstack/react-table` (direct dep, pnpm strict)
- Use `useMemo` for column array when columns are static
- Badge status mapping for enum values
- DataTable supports: `pageSize`, `enableSorting`, `enableSelection`, pagination built-in
- No client-side filtering currently in DataTable — admin will need search/filter ABOVE the table (TextInput + Select filters), then filter the data array before passing to DataTable

### Pattern 5: GradientCard KPI Dashboard

**What:** Dashboard top-row KPI cards
**Source:** `apps/enterprise-portal/src/app/(app)/dashboard/page.tsx`
**Confidence:** HIGH

- Two variants available: `gradient="primary"` (brown-gold) and `gradient="nature"` (forest-teal)
- Third card often uses inline `style={{ background: 'linear-gradient(135deg, #4A6741 0%, #3A8FA0 100%)' }}`
- Admin dashboard: 6 KPI cards in `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (3 columns, not 4 — more cards)

### Pattern 6: PDF Export (Dynamic Import)

**What:** @react-pdf/renderer used via dynamic import in event handlers only
**Source:** `apps/enterprise-portal/src/components/compliance/esg-export-form.tsx`
**Confidence:** HIGH — CRITICAL CONSTRAINT

```typescript
// NEVER import @react-pdf/renderer at top level
// ALWAYS dynamic import inside event handler
async function handleExportPDF() {
  setExporting(true)
  try {
    const res = await fetch('/api/admin/reports/...')
    const data = await res.json()

    const { pdf } = await import('@react-pdf/renderer')
    const { ReportPDF } = await import('./report-pdf-document')

    const blob = await pdf(<ReportPDF data={data} />).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${Date.now()}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } finally {
    setExporting(false)
  }
}
```

### Pattern 7: MSW Handler + Factory Organization

**What:** Handlers in handlers/ directory, factories in factories/ directory
**Source:** `apps/enterprise-portal/src/lib/msw/handlers/` + `factories/`
**Confidence:** HIGH

- handlers.ts (barrel): `export { handlers } from './handlers/index'`
- handlers/index.ts: imports and spreads all handler arrays
- Each handler file: `import { http, HttpResponse, delay } from 'msw'` + factory imports
- Factories: pure functions returning typed mock data, using `randomId(prefix)`, `isoNow()`, `isoPast(hours)`, `isoFuture(hours)` from `common.ts`

### Pattern 8: TanStack Query Polling

**What:** refetchInterval for near-real-time data
**Source:** `apps/mentor-portal/src/components/application/application-status.tsx`
**Confidence:** HIGH

```typescript
// Conditional polling — stop when data reaches terminal state
const { data } = useQuery<DashboardData>({
  queryKey: ['admin-dashboard'],
  queryFn: async () => { ... },
  refetchInterval: 30_000,  // 30s polling for dashboard stats
})
```

CONTEXT.md says: "last-updated timestamp + manual refresh button" — so polling with manual override, not WebSocket.

### Anti-Patterns to Avoid

- **Top-level @react-pdf/renderer imports:** Will crash Next.js SSR. ALWAYS use `await import()` inside event handlers.
- **@glimmora/ui Label is a `<p>` element, not `<label>`:** Use native HTML `<label>` for form accessibility.
- **Missing @tanstack/react-table direct dep:** ColumnDef import will fail under pnpm strict mode without it.
- **Button variant="outline":** Does not exist. Use `variant="secondary"` for cancel/back buttons.
- **Inline mock data in handlers:** Use factory functions in factories/ directory for consistency and reusability.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Data table with sort/paginate | Custom table component | `DataTable<T>` from @glimmora/ui | Built-in pagination, sorting, selection |
| Sidebar navigation | Custom sidebar | `AppShell` + `Sidebar` from @glimmora/ui | Collapse state, nav items, bottom content |
| Multi-panel resizable layout | CSS flex with drag handles | `ResizablePanelGroup` from @glimmora/ui | Persistence via autoSaveId, handles, min/max |
| Status badges | Colored spans | `Badge` from @glimmora/ui (5 status variants) | Consistent typography, color tokens |
| PDF generation | Custom canvas/jsPDF | @react-pdf/renderer (dynamic import) | React component model, professional layout |
| Date formatting | Manual string manipulation | date-fns | Timezone-safe, locale-aware |
| Client state persistence | localStorage manually | Zustand persist middleware | Handles serialization, hydration edge cases |

**Key insight:** The admin panel's complexity is in data breadth, not UI novelty. Every visual pattern has been built at least once in Phases 1-5.

## @glimmora/types Gap Analysis

### Types That Already Exist (reusable)

| Type | File | Admin Relevance |
|------|------|-----------------|
| `User`, `UserRole`, `ContributorProfile`, `MentorProfile`, `EnterpriseUser` | user.ts | User management views |
| `Project`, `ProjectStatus`, `ProjectHealthStatus`, `ProjectMilestone` | project.ts | Project admin view |
| `Task`, `TaskStatus`, `TaskPriority` | task.ts | Project task list |
| `SOW`, `SOWStatus` | sow.ts | Project SOW context |
| `Evidence`, `EvidencePack`, `EvidenceStatus` | evidence.ts | Dispute evidence |
| `PoDL`, `PoDLCredential` | podl.ts | User PoDL tab |
| `SkillGenome`, `SkillNode` | skill-genome.ts | Skill taxonomy |
| `APGActivity` | api.ts | APG activity log |
| `PaymentRecord` | enterprise.ts | Payment disputes |
| `ReviewDecision`, `ReviewQueueItem` | mentor.ts | Review-related disputes |
| `ESGReportData` | enterprise.ts | Report reference |
| `StudentProfile`, `AlumniProfile` | student.ts | Student user views |
| `APIResponse<T>` | api.ts | All API responses |

### Types That Need Adding to @glimmora/types

New file: `packages/types/src/admin.ts`

```typescript
// ---- Admin Auth ----
export type AdminRole = 'standard_admin' | 'super_admin'

export interface AdminUser {
  id: string
  displayName: string
  email: string
  avatarUrl?: string
  adminRole: AdminRole
  isActive: boolean
  createdAt: string
  lastLoginAt: string
}

// ---- Platform Dashboard ----
export interface PlatformStats {
  totalActiveUsers: number
  activeProjects: number
  pendingReviews: number
  openDisputes: number
  paymentsHeld: number
  paymentsHeldCurrency: string
  systemHealthScore: number
  verificationQueueCount: number
  pendingEscalations: number
}

export type SystemAlertSeverity = 'info' | 'warning' | 'critical'
export type SystemAlertEntityType = 'user' | 'project' | 'dispute' | 'payment' | 'system'

export interface SystemAlert {
  id: string
  severity: SystemAlertSeverity
  title: string
  message: string
  entityType: SystemAlertEntityType
  entityId?: string
  entityHref?: string
  createdAt: string
  dismissedAt?: string
}

// ---- User Management ----
export type AdminUserType =
  | 'woman-contributor'
  | 'community-support-lead'
  | 'student-contributor'
  | 'alumni-contributor'
  | 'enterprise-requester'
  | 'mentor-reviewer'

export type UserAccountStatus = 'active' | 'suspended' | 'pending_verification' | 'deactivated'

export interface AdminUserListItem {
  id: string
  displayName: string
  email: string
  userType: AdminUserType
  accountStatus: UserAccountStatus
  createdAt: string
  lastActiveAt: string
  projectCount: number
  podlCount: number
}

export interface VerificationQueueItem {
  id: string
  userId: string
  userName: string
  userType: AdminUserType
  verificationType: 'identity' | 'organization' | 'university' | 'mentor_credentials'
  submittedAt: string
  documentsCount: number
}

export type AdminActionType =
  | 'suspend'
  | 'reactivate'
  | 'approve_verification'
  | 'reject_verification'
  | 'force_password_reset'
  | 'modify_tier'

export interface AdminAction {
  actionType: AdminActionType
  reason: string
  performedBy: string
  performedAt: string
}

// ---- Disputes ----
export type DisputeType = 'payment' | 'quality' | 'conduct' | 'technical' | 'safety'
export type DisputeSeverity = 'low' | 'medium' | 'high' | 'critical'
export type DisputeStatus = 'open' | 'under_review' | 'awaiting_evidence' | 'resolved' | 'escalated'
export type DisputeDecisionType =
  | 'resolved_favor_requester'
  | 'resolved_favor_contributor'
  | 'partial_resolution'
  | 'escalated_to_safety'
  | 'dismissed'

export interface Dispute {
  id: string
  type: DisputeType
  severity: DisputeSeverity
  status: DisputeStatus
  title: string
  description: string
  projectId: string
  projectName: string
  requesterId: string
  requesterName: string
  contributorSeed: string
  createdAt: string
  updatedAt: string
  assignedAdminId?: string
  isSafetyCase: boolean
}

export interface DisputeEvidence {
  id: string
  disputeId: string
  submittedBy: 'requester' | 'contributor' | 'admin' | 'system'
  type: 'text' | 'file' | 'screenshot' | 'log'
  content: string
  fileUrl?: string
  submittedAt: string
}

export interface DisputeMessage {
  id: string
  disputeId: string
  senderRole: 'requester' | 'contributor' | 'admin'
  content: string
  sentAt: string
}

export interface DisputeDecision {
  disputeId: string
  decisionType: DisputeDecisionType
  summary: string
  detailedReasoning: string
  financialResolution?: {
    refundAmount?: number
    additionalPayment?: number
    currency: string
  }
  adminId: string
  decidedAt: string
}

// ---- Safety Case (extends Dispute) ----
export interface SafetyCase extends Dispute {
  isSafetyCase: true
  type: 'safety'
  severity: 'critical'
  privacyRestricted: boolean
  evidencePreserved: boolean
  accessRestrictions: string[]
}

// ---- Admin Interventions (Projects) ----
export type InterventionType =
  | 'project_freeze'
  | 'project_unfreeze'
  | 'contributor_reassignment'
  | 'milestone_override'
  | 'payment_hold'
  | 'payment_release'
  | 'escalation_created'

export interface AdminIntervention {
  id: string
  projectId: string
  interventionType: InterventionType
  reason: string
  details?: string
  performedBy: string
  performedAt: string
  isImmutable: true
}

// ---- Reports ----
export type ReportType = 'platform_overview' | 'user_activity' | 'project_delivery' | 'financial' | 'skill_growth'

export interface ReportConfig {
  type: ReportType
  title: string
  description: string
  dateRange: { from: string; to: string }
  filters?: Record<string, string>
}

export interface PlatformReportData {
  reportType: ReportType
  generatedAt: string
  dateRange: { from: string; to: string }
  metrics: Record<string, number | string>
  chartData?: Array<Record<string, unknown>>
}

// ---- Skill Taxonomy ----
export interface SkillTaxonomyTag {
  id: string
  name: string
  category: string
  parentId?: string
  isActive: boolean
  usageCount: number
  createdAt: string
  updatedAt: string
}

// ---- APG Configuration (Super Admin) ----
export type APGConfigDomain = 'thresholds' | 'auto_approval_rules' | 'escalation_triggers'

export interface APGConfigEntry {
  id: string
  domain: APGConfigDomain
  key: string
  label: string
  value: string | number | boolean
  description: string
  updatedBy: string
  updatedAt: string
}

// ---- Platform Audit Log ----
export type AuditActionCategory =
  | 'user_management'
  | 'project_intervention'
  | 'dispute_resolution'
  | 'content_management'
  | 'apg_configuration'
  | 'system'

export interface PlatformAuditEntry {
  id: string
  timestamp: string
  actorId: string
  actorName: string
  actionCategory: AuditActionCategory
  actionType: string
  affectedEntityType: 'user' | 'project' | 'dispute' | 'config' | 'content'
  affectedEntityId: string
  reason: string
  metadata?: Record<string, unknown>
  isImmutable: true
}

// ---- Platform Announcements ----
export type AnnouncementAudience = 'all' | 'contributors' | 'enterprise' | 'mentors' | 'admins'
export type AnnouncementStatus = 'draft' | 'published' | 'archived'

export interface PlatformAnnouncement {
  id: string
  title: string
  content: string
  audience: AnnouncementAudience
  status: AnnouncementStatus
  publishedAt?: string
  createdBy: string
  createdAt: string
}
```

Then update `packages/types/src/index.ts` to export all admin types.

## Components from @glimmora/ui — Available vs Missing

### Available (no changes needed)

| Component | Used For (Admin) |
|-----------|-----------------|
| `AppShell`, `Sidebar`, `TopBar` | Main layout |
| `DataTable` | User list, project list, dispute queue, audit log |
| `GradientCard` | Dashboard KPIs (6 cards) |
| `Badge` (5 statuses: urgent, normal, inprogress, done, atrisk) | Status everywhere |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | User detail (6 tabs), project detail (10 tabs) |
| `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter` | Config cards, report cards |
| `Button` (primary, secondary, ghost, destructive) | Actions |
| `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter` | Confirmation dialogs |
| `TextInput`, `Textarea`, `Select` | Filters, forms, reason fields |
| `PageHeader` | Every page title |
| `Spinner`, `Skeleton` | Loading states |
| `EmptyState` | Empty lists |
| `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` | Dispute 3-panel layout |
| `APGFeed` | APG activity in project detail |
| `EvidenceViewer` | Dispute evidence display |
| `Accordion` | Mobile fallback for panels |
| `Progress`, `ProgressRing` | Report metrics |
| `BarChart`, `Sparkline` | Dashboard charts |
| `Tag` | Skill tags in taxonomy |
| `Tooltip`, `Popover` | Info overlays |
| `DropdownMenu` | Action menus on table rows |
| `DatePicker` | Report date range |
| `Switch` | Toggle settings |
| `Combobox` | Search/filter dropdowns |

### Not Available (build in admin-panel, NOT in @glimmora/ui)

| Component | Where to Build | Why Not in DS |
|-----------|---------------|---------------|
| `RoleSwitcherOverlay` | `components/dev/role-switcher.tsx` | Dev-only tool, not a DS component |
| Search + filter bar above DataTable | Each page's component | Composition of existing primitives (TextInput + Select + Button) |
| Confirmation dialog with reason field | `components/users/user-action-dialog.tsx` | Admin-specific composition |

**Key finding:** No new @glimmora/ui components needed. The admin portal is a composition layer over existing DS components.

## MSW Factory Organization

### Complexity Assessment

The admin panel has the broadest mock data requirements of any portal because it oversees ALL entity types:

| Data Domain | Mock Items Needed | Complexity |
|-------------|-------------------|------------|
| Users (6 types) | ~3-5 per type = ~24 users | HIGH — each type has different fields |
| Projects (various states) | ~8-10 projects | MEDIUM — reuse enterprise factory pattern |
| Disputes (5 types) | ~10-15 disputes | HIGH — novel, includes safety cases |
| System alerts | ~5-8 alerts | LOW |
| Reports data | ~5 report datasets | MEDIUM |
| Audit log entries | ~20-30 entries | MEDIUM — many action types |
| Skill taxonomy | ~30-50 tags | LOW |
| APG config | ~10-15 entries | LOW |
| Verification queue | ~5-8 items | LOW |

### Recommended Factory Structure

```
factories/
├── common.ts           # randomId, isoNow, isoPast, isoFuture (copy from mentor/enterprise pattern)
├── user.ts             # createMockWomanContributor(), createMockStudent(), ... createMockUserList()
├── project.ts          # createMockAdminProject(), createMockAdminProjectList()
├── dispute.ts          # createMockDispute(type), createMockSafetyCase(), createMockDisputeList()
├── report.ts           # createMockPlatformReport(type), createMockReportChartData()
├── audit-log.ts        # createMockAuditEntries()
├── system-alert.ts     # createMockAlerts()
├── skill-taxonomy.ts   # createMockTaxonomy()
└── apg-config.ts       # createMockAPGConfig()
```

Each factory follows the existing pattern: pure functions returning typed objects, no external state.

### User Factory Approach

Since admin sees ALL user types, the user factory needs to generate mock data for each type with type-appropriate fields:

```typescript
// factories/user.ts
export function createMockAdminUserList(): AdminUserListItem[] {
  return [
    // Women contributors
    { id: 'u-w01', displayName: 'Contributor A', userType: 'woman-contributor', accountStatus: 'active', ... },
    { id: 'u-w02', displayName: 'Contributor B', userType: 'woman-contributor', accountStatus: 'suspended', ... },
    // Students
    { id: 'u-s01', displayName: 'Student A', userType: 'student-contributor', accountStatus: 'active', ... },
    // ... etc for all 6 types
  ]
}
```

## Project Admin View: 10-Tab vs Enterprise 7-Tab

### Enterprise 7-Tab View (existing)

File: `apps/enterprise-portal/src/components/projects/project-detail-tabs.tsx`

| Tab | Component |
|-----|-----------|
| Overview | ProjectOverview |
| Timeline | TimelineView |
| Evidence Packs | EvidencePackReview |
| Rework Requests | ReworkRequestsList |
| Escalation Centre | EscalationsList |
| Payment Release | BulkPaymentRelease |
| Team Summary | TeamSummaryGrid |

### Admin 10-Tab View (new)

| Tab | Component | Notes |
|-----|-----------|-------|
| Overview | ProjectOverview (can reuse enterprise pattern) | Same structure |
| Timeline | TimelineView (reuse pattern) | Same |
| Evidence Packs | EvidencePackReview (reuse pattern) | Same |
| Rework Requests | ReworkRequestsList (reuse pattern) | Same |
| Escalation Centre | EscalationsList (reuse pattern) | Same |
| Payment Release | BulkPaymentRelease (reuse pattern) | Admin can override holds |
| Team Summary | TeamSummaryGrid (reuse pattern) | Admin sees full contributor IDs |
| **APG Activity Log** | **New: APGActivityTab** | Uses APGFeed from @glimmora/ui |
| **Admin Interventions** | **New: AdminInterventionLog** | Immutable DataTable of interventions |
| **Freeze/Unfreeze** | **New: FreezeTab** | Freeze button + reason field + history |

**Composition strategy:** Build admin's `ProjectAdminTabs` component that follows the exact same pattern as enterprise's `ProjectDetailTabs` but with 10 tabs instead of 7. The first 7 tabs can reuse the same component structure (new files that follow the same patterns, not direct imports from enterprise — they're in different apps under pnpm strict).

## Report Export: CSV + PDF

### CSV Export Pattern

CSV export doesn't exist yet in the codebase. It should be implemented as a utility:

```typescript
// Simple CSV export utility — no library needed
function exportCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell =>
      typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : String(cell)
    ).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
```

### PDF Export Pattern

Follow the established pattern from `apps/enterprise-portal/src/components/compliance/esg-export-form.tsx`:

1. Fetch report data from MSW API
2. Dynamic import `@react-pdf/renderer` and the PDF document component
3. Generate blob, trigger download

### 5 Report Types

| Report Type | Data Source | PDF Template |
|-------------|------------|--------------|
| Platform Overview | PlatformStats + trends | Summary page with KPIs |
| User Activity | User counts per type, growth | Charts + tables |
| Project Delivery | Project statuses, completion rates | Timeline + metrics |
| Financial | Payments, fees, disputes | Tables + totals |
| Skill Growth | Skill taxonomy usage, PoDL issuance | Tree + progression |

### Custom Report Builder

The custom report builder is a form-driven UI:
- Select report type (dropdown)
- Select date range (DatePicker)
- Select filters (user type, project status, etc.)
- Preview button (shows data in DataTable)
- Export CSV / Export PDF buttons

## Safety Case Protocol — UI Differences

Per CONTEXT.md: "Safety Case section should feel noticeably more serious in visual treatment than regular disputes — not alarming, but gravity-appropriate (more whitespace, clearer privacy indicators)."

### UI Distinctions from Regular Disputes

| Aspect | Regular Dispute | Safety Case |
|--------|-----------------|-------------|
| Route | `/admin/disputes/[id]` | `/admin/disputes/safety` (dedicated section) |
| Visual treatment | Standard card/panel styling | Additional whitespace, `bg-status-urgent/5` subtle background on header |
| Privacy indicator | None | Visible "Privacy Restricted" Badge with Shield icon |
| Evidence | Standard evidence viewer | "Evidence Preserved" indicator + access restriction notice |
| Access restriction | Any admin | Super Admin gating possible (visible-but-locked for standard) |
| Audit trail | Standard dispute audit | Enhanced audit with access tracking |
| Decision types | All 5 decision types | Subset: resolved, escalated (no dismiss option) |

### Implementation Notes

- Safety Case page is a dedicated route `/admin/disputes/safety`, not mixed into the regular queue
- Uses the same 3-panel layout (ResizablePanelGroup) but with different panel content
- Privacy indicators: use Badge with `status="urgent"` + Shield icon from lucide-react
- The dedicated page lists only safety cases (filtered view)
- Individual safety case detail at `/admin/disputes/safety/[id]`

## Super Admin Gating Pattern

Per CONTEXT.md: Visible-but-locked with message, DevTools role-switcher overlay.

```typescript
// Reusable gating component
function SuperAdminGate({ children }: { children: React.ReactNode }) {
  const { adminRole } = useAuthStore()

  if (adminRole !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Shield className="h-12 w-12 text-text-caption" />
        <Heading level="h3">Super Admin Access Required</Heading>
        <Body className="text-text-caption text-center max-w-md">
          This section is restricted to Super Admin users. Contact your platform
          administrator if you need access.
        </Body>
      </div>
    )
  }

  return <>{children}</>
}
```

Used on: APG Configuration page, Admin Role Management section.

### DevTools Role Switcher

Small floating overlay (bottom-left, like MSW devtools) visible only in development:

```typescript
// components/dev/role-switcher.tsx — conditional render on NODE_ENV
function RoleSwitcherOverlay() {
  const { adminRole, setAdminRole } = useAuthStore()
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-bg-card border border-border rounded-card shadow-lg p-3">
      <Caption className="mb-2">DevTools: Admin Role</Caption>
      <div className="flex gap-2">
        <Button size="sm" variant={adminRole === 'standard_admin' ? 'primary' : 'secondary'}
          onClick={() => setAdminRole('standard_admin')}>Standard</Button>
        <Button size="sm" variant={adminRole === 'super_admin' ? 'primary' : 'secondary'}
          onClick={() => setAdminRole('super_admin')}>Super Admin</Button>
      </div>
    </div>
  )
}
```

## Common Pitfalls

### Pitfall 1: Client-Side Filtering Not Built Into DataTable

**What goes wrong:** Trying to add search/filter to DataTable component itself.
**Why it happens:** DataTable in @glimmora/ui has sorting + pagination but NOT column filtering or global search.
**How to avoid:** Build filter/search controls ABOVE the DataTable. Filter the data array in the parent component before passing to `<DataTable columns={columns} data={filteredData} />`. Use `useMemo` to memoize filtered results.
**Warning signs:** Looking for `getFilteredRowModel` in DataTable — it's not there.

### Pitfall 2: @react-pdf/renderer Top-Level Import

**What goes wrong:** Importing at module level causes SSR crash.
**Why it happens:** @react-pdf/renderer uses browser APIs not available during SSR.
**How to avoid:** ALWAYS use `await import('@react-pdf/renderer')` inside event handlers.
**Warning signs:** Any `import { ... } from '@react-pdf/renderer'` at file top.

### Pitfall 3: MSW handlers.ts vs handlers/ Directory

**What goes wrong:** The admin-panel already has a `handlers.ts` file with inline mock data.
**Why it happens:** It was set up as a scaffold, not production structure.
**How to avoid:** Replace the flat `handlers.ts` with a `handlers/` directory structure (matching enterprise/mentor pattern). Update the barrel import in `browser.ts` and `server.ts`.
**Warning signs:** All mock data in a single file growing unmanageably large.

### Pitfall 4: Button variant="outline" Does Not Exist

**What goes wrong:** TypeScript error on non-existent variant.
**Why it happens:** Common assumption from other UI libraries.
**How to avoid:** Use `variant="secondary"` for cancel/back actions, `variant="ghost"` for subtle actions.

### Pitfall 5: @glimmora/ui Label Is Not a Form Label

**What goes wrong:** Using `<Label>` from @glimmora/ui for form inputs — it renders `<p>` not `<label>`.
**Why it happens:** Label component is for display text, not form association.
**How to avoid:** Use native HTML `<label>` element for form inputs.

### Pitfall 6: Missing Direct Dependencies Under pnpm Strict

**What goes wrong:** Import errors at runtime for libraries that are transitive deps.
**Why it happens:** pnpm strict mode doesn't hoist. @tanstack/react-table, lucide-react, date-fns, recharts all need to be direct deps.
**How to avoid:** Add all imported packages to package.json before importing them.

### Pitfall 7: Audit Log Immutability

**What goes wrong:** Making audit log entries editable/deletable.
**Why it happens:** Standard CRUD patterns applied to what should be append-only.
**How to avoid:** Audit log DataTable should have NO action column, NO edit/delete buttons. Read-only with search/filter only.

## Code Examples

### MSW Handler with Factories

```typescript
// handlers/users.ts
import { http, HttpResponse, delay } from 'msw'
import { createMockAdminUserList, createMockVerificationQueue } from '../factories/user'

export const userHandlers = [
  http.get('/api/admin/users', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    let users = createMockAdminUserList()
    if (type) users = users.filter(u => u.userType === type)
    return HttpResponse.json({ data: users, meta: { page: 1, pageSize: 20, total: users.length, totalPages: 1 } })
  }),

  http.get('/api/admin/users/verification-queue', async () => {
    await delay(300)
    return HttpResponse.json(createMockVerificationQueue())
  }),

  http.post('/api/admin/users/:userId/suspend', async ({ request }) => {
    await delay(200)
    const { reason } = await request.json() as { reason: string }
    return HttpResponse.json({ success: true, auditEntryId: 'audit-001' })
  }),
]
```

### Admin Action Confirmation Dialog

```typescript
// components/users/user-action-dialog.tsx
'use client'
import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose,
  Button, Textarea,
} from '@glimmora/ui'

interface UserActionDialogProps {
  actionLabel: string
  actionDescription: string
  onConfirm: (reason: string) => Promise<void>
  trigger: React.ReactNode
  destructive?: boolean
}

export function UserActionDialog({
  actionLabel, actionDescription, onConfirm, trigger, destructive,
}: UserActionDialogProps) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleConfirm() {
    if (!reason.trim()) return
    setSubmitting(true)
    try {
      await onConfirm(reason)
      setOpen(false)
      setReason('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{actionLabel}</DialogTitle>
          <DialogDescription>{actionDescription}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label className="block text-sm font-medium text-text-body mb-1">
            Reason (required)
          </label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Provide a reason for this action..."
            rows={3}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant={destructive ? 'destructive' : 'primary'}
            disabled={!reason.trim() || submitting}
            onClick={handleConfirm}
          >
            {submitting ? 'Processing...' : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Dashboard with Polling + Manual Refresh

```typescript
// Pattern for admin dashboard stats
const { data, isLoading, dataUpdatedAt, refetch } = useQuery<PlatformStats>({
  queryKey: ['admin-platform-stats'],
  queryFn: async () => {
    const res = await fetch('/api/admin/dashboard/stats')
    if (!res.ok) throw new Error('Failed to fetch stats')
    return res.json()
  },
  refetchInterval: 30_000, // 30s polling
})

// Manual refresh button
<Button variant="ghost" size="sm" onClick={() => refetch()}>
  <RefreshCw className="h-4 w-4 mr-1" />
  Refresh
</Button>
<Caption>Last updated: {dataUpdatedAt ? format(dataUpdatedAt, 'HH:mm:ss') : '--'}</Caption>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Route groups not needed | `(pre-auth)` and `(app)` route groups | Next.js 13+ | Clean separation of layouts |
| MSW v1 with `rest` | MSW v2 with `http`/`HttpResponse` | 2024 | Already using v2 in codebase |
| TanStack Query v4 callbacks | TanStack Query v5 return-based refetchInterval | 2024 | Conditional polling via function |
| Manual sidebar state | AppShell context in @glimmora/ui | Phase 2 | Sidebar collapse is handled |

## Open Questions

1. **Should admin types be in a separate file or merged?**
   - Recommendation: Single `packages/types/src/admin.ts` file. It's large (~180 lines) but cohesive. Export all from index.ts.
   - Confidence: HIGH

2. **DataTable global search/filter**
   - The current DataTable doesn't have built-in filtering. The admin portal has heavy filtering needs (user type filter, dispute type + severity filter, audit log search).
   - Recommendation: Build filter UI above DataTable in each page component. Filter the data array with `useMemo` before passing to DataTable. If filtering becomes a repeated pattern, consider adding `getFilteredRowModel` to DataTable in a future iteration — but for now, keep it simple.
   - Confidence: HIGH

3. **Audit log pagination with large datasets**
   - DataTable currently uses client-side pagination (all data loaded, paginated in browser).
   - For the audit log (potentially thousands of entries), MSW should return paginated responses and the frontend should pass page params to the API.
   - Recommendation: Use standard `APIResponse<T>` with `meta.page/pageSize/total` for audit log endpoint. Implement server-side pagination pattern (fetch per page).
   - Confidence: MEDIUM — this is the first portal to need server-side pagination with MSW

## Sources

### Primary (HIGH confidence)
- Codebase files directly examined:
  - `packages/types/src/*.ts` — all 18 type files
  - `packages/ui/src/index.ts` — all 51 component exports
  - `packages/ui/src/components/sidebar/sidebar.tsx` — SidebarNavItem interface
  - `packages/ui/src/components/data-table/data-table.tsx` — DataTableProps, no filter model
  - `packages/ui/src/components/gradient-card/gradient-card.tsx` — two gradient variants
  - `packages/ui/src/components/badge/badge.tsx` — 5 status variants
  - `apps/admin-panel/` — existing scaffolding (package.json, layout, providers, MSW, Zustand)
  - `apps/enterprise-portal/src/app/(app)/layout.tsx` — AppShell pattern
  - `apps/enterprise-portal/src/store/auth-store.ts` — Zustand persist auth pattern
  - `apps/enterprise-portal/src/app/(app)/dashboard/page.tsx` — GradientCard KPI pattern
  - `apps/enterprise-portal/src/components/projects/project-detail-tabs.tsx` — 7-tab pattern
  - `apps/enterprise-portal/src/components/payments/payment-history-table.tsx` — DataTable+ColumnDef
  - `apps/enterprise-portal/src/components/sow/sow-archive-table.tsx` — DataTable with actions
  - `apps/enterprise-portal/src/components/compliance/esg-export-form.tsx` — PDF dynamic import
  - `apps/enterprise-portal/src/components/compliance/esg-report-pdf.tsx` — PDF document pattern
  - `apps/enterprise-portal/src/lib/msw/handlers/projects.ts` — handler pattern
  - `apps/enterprise-portal/src/lib/msw/factories/project.ts` — factory pattern
  - `apps/enterprise-portal/src/lib/msw/factories/common.ts` — utility functions
  - `apps/mentor-portal/src/components/review-detail/review-layout.tsx` — 3-panel ResizablePanel
  - `apps/mentor-portal/src/components/review-detail/review-form-panel.tsx` — decision form pattern
  - `apps/mentor-portal/src/store/auth-store.ts` — Role-based auth store
  - `apps/mentor-portal/src/components/application/application-status.tsx` — refetchInterval

### Secondary (MEDIUM confidence)
- CONTEXT.md decisions (user-locked choices from discuss-phase)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already in use across 4 portals, versions verified in package.json
- Architecture: HIGH — every pattern directly observed in codebase with file references
- Types gap analysis: HIGH — all 18 existing type files read, gaps identified by comparison to requirements
- Pitfalls: HIGH — all based on actual codebase constraints (DataTable API, Label element type, pnpm strict mode)
- MSW factories: HIGH — factory pattern well-established, admin scope is larger but same approach
- Safety Case protocol: MEDIUM — UI distinction is clear from CONTEXT.md but specific privacy UI patterns haven't been built before in this codebase

**Research date:** 2026-02-27
**Valid until:** 2026-03-27 (stable — all based on locked codebase patterns, no external library changes expected)
