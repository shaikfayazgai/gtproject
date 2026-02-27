---
phase: 05-enterprise-portal
plan: 02
subsystem: ui, state
tags: [zustand, resizable-panels, blueprint-editor, otp, accordion, anonymized-team-card, enterprise]

# Dependency graph
requires:
  - phase: 05-enterprise-portal
    provides: Enterprise types (Blueprint, SOWClause, BlueprintTask, BlueprintMilestone, BlueprintPhase), OTPInput in @glimmora/ui, MSW handlers infrastructure, enterprise auth store
  - phase: 02-design-system-completion
    provides: ResizablePanelGroup wrapper with autoSaveId, AnonymizedTeamCard, Badge, Tag, Accordion, Card, Checkbox, Select, TextInput, Dialog
provides:
  - Zustand editor-store with selectedClauseId/selectedTaskId/selectedMilestoneId for cross-panel synchronization
  - 4-panel Blueprint Editor layout (ResizablePanelGroup with autoSaveId='blueprint-editor')
  - SOW Context Panel with clause type badges, confidence scores, interactive selection
  - Task Tree Panel with phase>milestone>task hierarchy and clause-linked highlighting
  - Team Pool Panel with AnonymizedTeamCard and skill matching (Matched/Partial Match)
  - Project Settings Panel with editable milestone budget, payment trigger, target week
  - OTPConfirmationDialog reusable component in components/shared/
  - Blueprint Approval page with 4-item pre-launch checklist and OTP gate
  - MSW blueprint handlers (GET/PATCH/POST approve with OTP validation)
  - Blueprint factory with deterministic IDs for cross-panel synchronization
affects: [05-03-project-dashboard, 05-04-evidence-payment, 05-05-compliance-settings]

# Tech tracking
tech-stack:
  added: []
  patterns: [4-panel synchronized selection via Zustand selectors, OTP confirmation dialog pattern, pre-launch checklist gate, deterministic MSW factory IDs for cross-component linking]

key-files:
  created:
    - apps/enterprise-portal/src/store/editor-store.ts
    - apps/enterprise-portal/src/app/(app)/sow/[sowId]/editor/page.tsx
    - apps/enterprise-portal/src/app/(app)/sow/[sowId]/approve/page.tsx
    - apps/enterprise-portal/src/components/sow/blueprint-editor/editor-layout.tsx
    - apps/enterprise-portal/src/components/sow/blueprint-editor/sow-context-panel.tsx
    - apps/enterprise-portal/src/components/sow/blueprint-editor/task-tree-panel.tsx
    - apps/enterprise-portal/src/components/sow/blueprint-editor/team-pool-panel.tsx
    - apps/enterprise-portal/src/components/sow/blueprint-editor/project-settings-panel.tsx
    - apps/enterprise-portal/src/components/sow/blueprint-editor/index.ts
    - apps/enterprise-portal/src/components/sow/blueprint-approval.tsx
    - apps/enterprise-portal/src/components/shared/otp-confirmation-dialog.tsx
    - apps/enterprise-portal/src/components/shared/index.ts
    - apps/enterprise-portal/src/lib/msw/factories/blueprint.ts
    - apps/enterprise-portal/src/lib/msw/handlers/blueprint.ts
  modified:
    - apps/enterprise-portal/src/lib/msw/handlers/index.ts
    - apps/enterprise-portal/src/components/sow/index.ts

key-decisions:
  - "Blueprint factory uses deterministic clause IDs (clause-001..clause-006) matching task clauseIds for cross-panel synchronization"
  - "All 4 panels use Zustand selectors (useEditorStore((s) => s.field)) -- never full store subscription -- to prevent unnecessary re-renders"
  - "OTPConfirmationDialog in components/shared/ is reusable for both blueprint approval (05-02) and payment release (05-05)"
  - "MilestoneSettingsCard is a private sub-component within ProjectSettingsPanel for per-milestone editing"

patterns-established:
  - "4-panel synchronized selection: Zustand store holds selectedClauseId, panels subscribe via selectors, scrollIntoView for highlighted items"
  - "OTP confirmation dialog: OTPInput from @glimmora/ui composed inside Dialog, accepts onConfirm async callback, shows error/loading states"
  - "Pre-launch checklist gate: N checkbox items must all be checked before action button is enabled"
  - "Mock team pool: local array of anonymous team members with skill arrays, matched against clause-linked task skills"

# Metrics
duration: 8min
completed: 2026-02-27
---

# Phase 5 Plan 2: Blueprint Editor and Approval Summary

**4-panel synchronized Blueprint Editor with Zustand clause-selection state, SOW context/task tree/team pool/settings panels, OTP confirmation dialog, and pre-launch checklist approval flow**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-27T05:00:37Z
- **Completed:** 2026-02-27T05:08:05Z
- **Tasks:** 2
- **Files modified:** 16

## Accomplishments
- Zustand editor-store with selectedClauseId, selectedTaskId, selectedMilestoneId, and blueprintDirty state -- all panels subscribe via selectors for efficient re-rendering
- 4-panel ResizablePanelGroup layout with autoSaveId='blueprint-editor' for persistent panel sizes (25/30/22/23 default split), with mobile Accordion fallback below lg breakpoint
- SOW Context Panel showing clauses grouped by type with Badge indicators, confidence percentages, linked task counts, and interactive clause selection with highlight + deselect toggle
- Task Tree Panel with collapsible phase>milestone>task hierarchy, clause-linked task highlighting (border-brand-primary bg-brand-primary/5), opacity dimming for unlinked tasks, and auto-scrollIntoView
- Team Pool Panel with AnonymizedTeamCard components filtered by clause-linked skill requirements, Matched/Partial Match badges, and skill tag display
- Project Settings Panel with editable project name, total budget/timeline display, and per-milestone budget allocation, payment trigger mode Select, and target week inputs
- OTPConfirmationDialog reusable component composing OTPInput from @glimmora/ui inside Dialog, with error/loading states and cancel button (variant="secondary")
- Blueprint Approval page with project summary card, 4-item pre-launch checklist (all must be checked), and OTP confirmation gate before project activation
- MSW blueprint handlers: GET returns blueprint + intelligence with deterministic IDs, PATCH saves, POST approve validates 6-digit OTP length

## Task Commits

Each task was committed atomically:

1. **Task 1: Zustand editor-store, 4-panel layout, SOW context + task tree panels, MSW blueprint endpoints** - `e00bbd8` (feat)
2. **Task 2: Team pool panel, project settings, OTP confirmation dialog, blueprint approval** - `fb84fb9` (feat)

## Files Created/Modified
- `apps/enterprise-portal/src/store/editor-store.ts` - Zustand store with selection state and dirty tracking
- `apps/enterprise-portal/src/app/(app)/sow/[sowId]/editor/page.tsx` - Blueprint Editor page with save/approve flow
- `apps/enterprise-portal/src/app/(app)/sow/[sowId]/approve/page.tsx` - Blueprint Approval page
- `apps/enterprise-portal/src/components/sow/blueprint-editor/editor-layout.tsx` - 4-panel ResizablePanelGroup + mobile Accordion
- `apps/enterprise-portal/src/components/sow/blueprint-editor/sow-context-panel.tsx` - Panel 1: SOW clauses with selection
- `apps/enterprise-portal/src/components/sow/blueprint-editor/task-tree-panel.tsx` - Panel 2: Task tree with clause highlighting
- `apps/enterprise-portal/src/components/sow/blueprint-editor/team-pool-panel.tsx` - Panel 3: Anonymized team cards with skill matching
- `apps/enterprise-portal/src/components/sow/blueprint-editor/project-settings-panel.tsx` - Panel 4: Budget/timeline/payment settings
- `apps/enterprise-portal/src/components/sow/blueprint-editor/index.ts` - Barrel export for all editor panels
- `apps/enterprise-portal/src/components/sow/blueprint-approval.tsx` - Pre-launch checklist + OTP approval
- `apps/enterprise-portal/src/components/shared/otp-confirmation-dialog.tsx` - Reusable OTP dialog
- `apps/enterprise-portal/src/components/shared/index.ts` - Shared component barrel
- `apps/enterprise-portal/src/lib/msw/factories/blueprint.ts` - Deterministic blueprint and intelligence factories
- `apps/enterprise-portal/src/lib/msw/handlers/blueprint.ts` - GET/PATCH/POST blueprint handlers
- `apps/enterprise-portal/src/lib/msw/handlers/index.ts` - Added blueprint handlers to handler array
- `apps/enterprise-portal/src/components/sow/index.ts` - Added BlueprintApproval export

## Decisions Made
- **Deterministic factory IDs:** Blueprint factory uses stable clause IDs (clause-001..006) and task IDs (task-001..010) so clauseIds arrays in tasks can reference specific clauses for cross-panel synchronization testing
- **Zustand selectors everywhere:** All panel components use `useEditorStore((s) => s.field)` selector pattern instead of `useEditorStore()` to prevent full-store re-renders when unrelated state changes
- **OTPConfirmationDialog as shared component:** Placed in components/shared/ (not in sow/) because it will be reused for payment release in Plan 05-05
- **MilestoneSettingsCard as private component:** Extracted milestone editing into a sub-component within project-settings-panel.tsx for clean local state management per milestone

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Blueprint Editor complete with synchronized 4-panel layout ready for user interaction
- OTPConfirmationDialog available for reuse in payment release flow (Plan 05-05)
- Blueprint MSW handlers serve GET/PATCH/POST endpoints with deterministic data
- Editor-store available for any future panels that need selection synchronization
- No blockers for Plans 05-03 through 05-06

---
*Phase: 05-enterprise-portal*
*Completed: 2026-02-27*
