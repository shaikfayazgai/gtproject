# Phase 6: Admin Panel - Context

**Gathered:** 2026-02-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Platform oversight control surface for administrators. Covers: live platform monitoring, full user lifecycle management across all 6 user types, project intervention, dispute resolution (including Safety Case protocol), reports/analytics, skill taxonomy management, content management, and APG configuration. No new end-user capabilities — this phase is entirely the admin control layer over everything built in Phases 1–5.

</domain>

<decisions>
## Implementation Decisions

### Dashboard Layout + Information Hierarchy
- Clean ops layout matching design system — GradientCard KPIs at top (total active users, active projects, pending reviews, disputes open, payments held, system health)
- Pending action counts (verification queue, disputes, escalations) take top visual priority — admins come to act
- System alert feed: inline with per-alert dismiss button + deep-link to relevant entity (user, project, dispute)
- Stats refresh: last-updated timestamp + manual refresh button — communicates data freshness without live animation noise

### User Management Navigation + Actions
- Single unified user list with sidebar/filter-bar type filter (Women Contributor / Community Support Lead / Student / Alumni / Enterprise Requester / Mentor) — allows cross-type searches and combined views
- User detail opens as full-page navigation (`/admin/users/[userId]`) — 6-tab depth requires full page real estate, not a slide-out
- State-changing actions (suspend, reactivate, approve, reject) require a confirmation dialog with a mandatory reason field — reason is written to audit log
- Verification queue: count surfaced as a dashboard action item + dedicated page at `/admin/users/verification-queue`

### Dispute Resolution Queue UX
- Filtered queue list (ticket-system style) — admins work linearly, filter by type (Payment / Quality / Conduct / Technical / Safety) and severity
- Safety Case: dedicated section at `/admin/disputes/safety` — highest-severity protocol (full privacy protection, evidence preservation) warrants its own workflow, not mixed into the regular queue
- Dispute detail: 3-panel layout (left: case context + parties involved; center: evidence/messages; right: decision form with 5 decision types) — mirrors mentor review UX already in the codebase
- Audit trail: per-dispute Audit Log tab (case-specific history) AND platform-wide `/admin/audit-log` (all admin actions, immutable, for AP-23 compliance)

### Super Admin Gating
- Restricted sections (APG Configuration AP-21, Admin Role Management AP-22) are visible in the sidebar but locked with a clear message: "Super Admin access required" — visible-but-locked avoids confusion when someone is told to find a feature that's invisibly hidden
- Auth store role: `adminRole: 'standard_admin' | 'super_admin'` (string enum, consistent with portal conventions)
- DevTools role-switcher overlay: toggle between Standard Admin and Super Admin without logging out — valuable for demo/handoff to backend team
- APG Configuration: configuration cards with inline editing — one card per domain (Thresholds / Auto-Approval Rules / Escalation Triggers), each with an Edit button that switches to form mode

### Claude's Discretion
- Exact dashboard KPI card gradient assignments (which variant for which stat)
- Sidebar menu item ordering and grouping within admin nav
- Exact filter/search component placement in user list
- Loading skeleton patterns and empty states throughout
- Progress bar and spinner usage during async admin actions
- Exact column definitions for data tables (users list, disputes list, reports)

</decisions>

<specifics>
## Specific Ideas

- The dispute 3-panel layout should feel intentional — mirrors the mentor review codebase pattern, which admins will recognize if they've seen the mentor portal during handoff demos
- DevTools role-switcher is a small dev overlay (similar in spirit to MSW devtools) — not part of the production UI, just a dev aid
- Safety Case section should feel noticeably more serious in visual treatment than regular disputes — not alarming, but gravity-appropriate (more whitespace, clearer privacy indicators)
- The platform-wide audit log (AP-23) should be a DataTable with timestamp, actor, action type, affected entity, and reason columns — searchable and filterable

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-admin-panel*
*Context gathered: 2026-02-27*
