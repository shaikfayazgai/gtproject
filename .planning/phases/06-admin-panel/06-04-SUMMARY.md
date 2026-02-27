---
phase: "06-admin-panel"
plan: "04"
subsystem: "dispute-resolution"
tags: ["disputes", "safety-case", "resizable-panels", "audit-trail", "evidence-viewer"]
dependency-graph:
  requires: ["06-01"]
  provides: ["dispute-queue", "dispute-detail-3-panel", "safety-case-protocol", "dispute-audit-trail"]
  affects: ["06-05"]
tech-stack:
  added: []
  patterns: ["3-panel-resizable-layout", "safety-case-protocol", "per-entity-audit-trail"]
key-files:
  created:
    - "apps/admin-panel/src/app/(app)/disputes/page.tsx"
    - "apps/admin-panel/src/app/(app)/disputes/[disputeId]/page.tsx"
    - "apps/admin-panel/src/app/(app)/disputes/safety/page.tsx"
    - "apps/admin-panel/src/app/(app)/disputes/safety/[caseId]/page.tsx"
    - "apps/admin-panel/src/components/disputes/dispute-queue-table.tsx"
    - "apps/admin-panel/src/components/disputes/dispute-detail-layout.tsx"
    - "apps/admin-panel/src/components/disputes/case-context-panel.tsx"
    - "apps/admin-panel/src/components/disputes/evidence-messages-panel.tsx"
    - "apps/admin-panel/src/components/disputes/decision-form-panel.tsx"
    - "apps/admin-panel/src/components/disputes/dispute-audit-trail.tsx"
    - "apps/admin-panel/src/components/disputes/safety-case-view.tsx"
    - "apps/admin-panel/src/components/disputes/safety-case-list.tsx"
    - "apps/admin-panel/src/components/disputes/index.ts"
    - "apps/admin-panel/src/lib/msw/factories/dispute.ts"
    - "apps/admin-panel/src/lib/msw/handlers/disputes.ts"
  modified:
    - "apps/admin-panel/src/lib/msw/handlers/index.ts"
decisions:
  - id: "06-04-01"
    decision: "orientation='horizontal' used on ResizablePanelGroup (not direction), matching mentor-portal pattern"
  - id: "06-04-02"
    decision: "Safety case decision form removes 'dismissed' via isSafetyCase prop filtering ALL_DECISION_OPTIONS"
  - id: "06-04-03"
    decision: "Safety case audit trail always visible below 3-panel layout (not behind tab as in regular disputes)"
  - id: "06-04-04"
    decision: "CaseContextPanel handles both regular disputes and safety cases via optional privacy/access restriction props"
metrics:
  duration: "8 min"
  completed: "2026-02-27"
---

# Phase 6 Plan 4: Dispute Resolution and Safety Case Protocol Summary

**One-liner:** 3-panel dispute review with 5 decision types, Safety Case protocol with privacy indicators and evidence preservation, per-dispute audit trail

## What Was Built

### Dispute Queue (AP-11)
- DataTable at `/disputes` with type/severity/status filtering via Select components
- 13 mock disputes across all 5 types (payment, quality, conduct, technical, safety)
- Sorted by severity descending (critical first), then created ascending (oldest first)
- Safety Cases link prominently visible in page header with count badge

### Dispute Detail with 3-Panel Layout (AP-12)
- 3-panel ResizablePanelGroup layout at `/disputes/[disputeId]` mirroring mentor review pattern
- Left panel (25%): CaseContextPanel with classification, project info, parties (contributor anonymized), key dates, SLA deadline
- Center panel (45%): EvidenceMessagesPanel with Evidence and Messages sub-tabs, admin can send messages
- Right panel (30%): DecisionFormPanel with 5 decision types and conditional financial resolution
- Tabs for Case Review (3-panel) vs Audit Trail
- Resolution banner shown when dispute is resolved

### Safety Case Protocol (AP-13)
- Dedicated `/disputes/safety` section with card-based list (not dense table)
- Enhanced visual treatment: `bg-status-urgent/5` subtle background, more whitespace (p-6)
- Privacy Restricted Badge with Shield icon on every safety case card
- Evidence Preserved indicator with CheckCircle icon
- Safety Case detail page with access restriction notices
- Decision form removes 'dismissed' option (safety cases cannot be dismissed)
- Privacy Impact Assessment textarea added for safety case decisions
- "Safety Case decisions are permanent and fully audited" warning text
- Audit trail always visible below 3-panel layout (not behind a tab)
- Access restriction list rendered from SafetyCase.accessRestrictions

### Per-Dispute Audit Trail (AP-14)
- Vertical timeline (border-l-2 pattern) with chronological entries
- Each entry shows timestamp, actor, action badge, and details
- Actions covered: created, evidence_submitted, assigned, message_sent, decision_made, escalated, resolved, status_changed, case_viewed
- 10 mock audit entries per dispute covering full lifecycle

### MSW Infrastructure
- Dispute factory with 13 disputes, 3 safety cases, evidence, messages, and audit entries
- Safety routes defined BEFORE parameterized :id routes to prevent path shadowing
- 9 MSW handlers covering all CRUD operations

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **orientation vs direction prop**: Used `orientation="horizontal"` on ResizablePanelGroup matching the mentor-portal pattern (not `direction` as mentioned in plan context)
2. **Safety case filtering**: Decision form uses `isSafetyCase` prop to filter out 'dismissed' from the static ALL_DECISION_OPTIONS array
3. **Safety audit trail placement**: Audit trail rendered always-visible below 3-panel layout for safety cases, while regular disputes keep it behind a tab
4. **Shared CaseContextPanel**: Same component handles both regular disputes and safety cases via optional `privacyRestricted`, `accessRestrictions`, and `evidencePreserved` props

## Architecture Notes

- The 3-panel layout pattern (25/45/30 split) is now used in both mentor-portal and admin-panel, establishing it as a platform-wide review pattern
- Safety Case visual treatment is achieved through CSS class differences (`bg-status-urgent/5`, more padding) rather than separate components, maximizing reuse
- EvidenceViewer from @glimmora/ui is integrated for text/log evidence, while dispute-specific evidence items (with submitter badges and file attachments) are rendered with custom components

## Next Phase Readiness

Plan 06-05 (Platform Audit Log, APG Config, Reports) can proceed -- this plan provides:
- Dispute audit trail pattern that can be extended for platform-wide audit log
- MSW handler patterns for remaining admin endpoints
