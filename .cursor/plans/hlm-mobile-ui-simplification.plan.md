---
name: hlm-mobile-ui-simplification
overview: Deliver mobile-first UI simplification with iterative review-revise quality loop until execution-ready.
todos:
  - id: phase-a-control-reduction
    content: Reduce visible controls and remove duplicated action surfaces.
    status: completed
  - id: phase-b-mobile-density
    content: Improve space usage and target density for phone-first flows.
    status: completed
  - id: phase-c-task-first-flow
    content: Simplify funnel to pick-context-calculate with fewer detours.
    status: completed
  - id: phase-d-hardening
    content: Run full gates, complexity checks, and SLOC review notes.
    status: completed
isProject: false
---

# HLM Mobile UI Simplification Plan

## Parent Plan Link

- Master roadmap:
[hlm-master-plan.plan.md](hlm-master-plan.plan.md)

## Goal

- Deliver a mobile-first UI that uses fewer visible controls, denser
layout, and shorter hand-entry flow while preserving scoring contracts.

## Current Status Dashboard

- Owner: `project-owner`
- OverallStatus: `completed`
- PlanClass: `historical-archive`
- ProgressPercent: `100`
- ActivePhase: `Phase_D_Hardening_Completed`
- Focus:
  - `Phase B density optimization completed with mobile-safe constraints.`
  - `Phase C task-first simplification completed with fewer persistent controls.`
- RisksAndBlockers:
  - `none`
- NextActions:
  - `none`
- ExitGateCheck:
  - Unit: `pass`
  - Integration: `pass`
  - Regression: `pass`
  - Spike: `not-applicable`
  - FullSuite: `pass`
  - Complexity: `pass`
  - SLOCReview: `pass-with-notes`
- ValidationEvidence:
  - `All mobile simplification phase todos are marked completed.`
  - `Execution evidence and gate notes are documented below.`
  - `No pending actions remain; this plan is traceability-only.`
- LastUpdated: `2026-03-16`

## Execution Evidence

- Phase A implementation landed in:
  - [public/index.html](02product/01_coding/project/hlm/public/index.html)
  - [public/appEventWiring.js](02product/01_coding/project/hlm/public/appEventWiring.js)
  - [public/appStateActions.js](02product/01_coding/project/hlm/public/appStateActions.js)
  - [public/appRefs.js](02product/01_coding/project/hlm/public/appRefs.js)
  - [public/styles-components.css](02product/01_coding/project/hlm/public/styles-components.css)
- TDD evidence:
  - [tests/unit/appStateActions.test.js](02product/01_coding/project/hlm/tests/unit/appStateActions.test.js)
- Gate evidence:
  - `npm test`: pass
  - `npm run quality:complexity`: pass
  - `cloc --by-file` run for touched files with notes captured in risk register.
- Additional Phase B/C slice evidence:
  - `public/styles-base.css` and `public/styles-components.css` density updates.
  - `public/appStateActions.js` primary CTA now reflects tile count stage.
  - `public/index.html` picker secondary actions reduced via "更多" disclosure.
  - `tests/unit/appStateActions.test.js` extended for CTA stage transitions.
  - `public/appEventWiring.js` opens picker directly when preview slot is tapped.
  - `public/appStateActions.js` now shows remaining tile count in footer hint.
  - `npm test` rerun after latest slice with all suites passing.
  - `npm run quality:complexity` rerun with pass result.
  - `cloc --by-file` rerun and SLOC exceptions recorded for legacy UI files.
  - `public/index.html` now declares rel="icon" to avoid favicon 404 noise.
  - `tests/unit/indexStylesheetLinks.test.js` covers favicon link presence.

## Scope Lock

- In scope:
  - home/picker/context/result/info interaction simplification.
  - button-count reduction with progressive disclosure.
  - layout density optimization for phone screens first.
- Out of scope:
  - scoring logic semantics and fan evaluation rules.
  - domain contract changes outside UI input orchestration.

## Target Files

- [public/index.html](02product/01_coding/project/hlm/public/index.html)
- [public/styles-base.css](02product/01_coding/project/hlm/public/styles-base.css)
- [public/styles-components.css](02product/01_coding/project/hlm/public/styles-components.css)
- [public/styles-modals.css](02product/01_coding/project/hlm/public/styles-modals.css)
- [public/styles-responsive.css](02product/01_coding/project/hlm/public/styles-responsive.css)
- [public/appEventWiring.js](02product/01_coding/project/hlm/public/appEventWiring.js)
- [public/uiRenderers.js](02product/01_coding/project/hlm/public/uiRenderers.js)
- [public/appStateActions.js](02product/01_coding/project/hlm/public/appStateActions.js)
- [tests/unit/tilePickerState.test.js](02product/01_coding/project/hlm/tests/unit/tilePickerState.test.js)
- [tests/integration/mobilePickerFlow.test.js](02product/01_coding/project/hlm/tests/integration/mobilePickerFlow.test.js)
- [tests/unit/indexStylesheetLinks.test.js](02product/01_coding/project/hlm/tests/unit/indexStylesheetLinks.test.js)

## Delivery Phases

### Phase A: Control Reduction

- Remove duplicated global actions and keep one action center in picker.
- Keep delete action visible only when a slot is selected.
- Collapse pattern controls to primary + secondary disclosure.

#### Exit Criteria

- Visible primary controls on phone home screen are <= 3.
- Duplicate undo/clear actions are removed from one surface.
- Unit and integration tests for picker interactions pass.

### Phase B: Mobile Density

- Increase picker grid density for phone while preserving touch safety.
- Reduce vertical spacing and card padding without hurting readability.
- Keep sticky footer compact and legible with safe-area behavior.

#### Exit Criteria

- Hand-entry viewport shows more actionable content above fold.
- Tap targets remain touch-safe (>= 40px effective target).
- Integration tests for picker and modal flows pass.

### Phase C: Task-First Flow

- Prioritize flow as `pick tiles -> set context -> calculate`.
- Keep context editing secondary and non-blocking.
- Preserve selected-slot editing behavior with clear affordance.

#### Exit Criteria

- 14-tile entry flow uses fewer steps than baseline.
- Users can complete one full run without opening non-essential controls.
- Regression tests pass for unchanged scoring outcomes.

### Phase D: Hardening and Release Gate

- Run full quality and test gates with guardrail checks.
- Record complexity and SLOC notes for touched files.
- Resolve blockers before release recommendation.

#### Exit Criteria

- `npm run test:unit` pass
- `npm run test:integration` pass
- `npm run test:regression` pass
- `npm test` pass
- `npm run quality:complexity` pass
- `cloc <touched-file>` reviewed

## Metrics and Evidence

- ButtonCountPrimary: target <= 3 on phone home.
- HandEntryTapCount: target reduce by >= 20 percent from baseline.
- FlowCompletionPath: one dominant path with no dead-end step.
- Evidence must include:
  - before/after control inventory from DOM sections.
  - test command outputs for all required gates.
  - guardrail notes for complexity and SLOC.

## TDD and Guardrails

- Apply TDD per slice:
  1. write failing tests,
  2. implement minimum passing change,
  3. refactor,
  4. rerun affected tests.
- Keep function size and complexity guardrails from master plan.
- Keep line width and comment quality requirements from master policy.

## Code Quality Risk Register

- Risk: UI event wiring grows beyond single-responsibility boundaries.
  - Mitigation: split handlers by feature and keep glue-only functions.
- Risk: Renderer functions exceed size/complexity thresholds.
  - Mitigation: extract helpers and enforce `quality:complexity` gate.
- Risk: CSS density tweaks reduce accessibility tap safety.
  - Mitigation: keep minimum touch target >= 40px and verify in tests.
- Risk: duplicate controls reappear across home and picker surfaces.
  - Mitigation: maintain control inventory check per phase exit review.

## Review-Revise Iteration Loop

- Review checklist each pass:
  - plan structure completeness,
  - cross-plan consistency with master status and dependencies,
  - command/path executability,
  - phase exit criteria clarity and measurability.
- If any check fails, revise and start next pass.
- Stop only when one full pass has zero unresolved findings.

## Dependency Gate Rule

- Mobile simplification coding starts only after the UI/UX child plan
marks final-hardening gate as cleared, or master plan explicitly
approves parallel start with documented risk acceptance.

## Rollback and Risk Control

- Land each phase in isolated change sets.
- If mobile density harms usability, rollback only Phase B changes.
- Never couple UI simplification with scoring semantics updates.

