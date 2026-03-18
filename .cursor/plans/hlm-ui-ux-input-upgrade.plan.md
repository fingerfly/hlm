---
name: hlm-ui-ux-input-upgrade
overview: Deliver phased UI/UX input improvements with TDD-first
  implementation, security guardrails, and explicit release gates.
todos:
  - id: phase0-baseline
    content: Lock baseline metrics and ensure no rule-engine contract drift.
    status: completed
  - id: phase1-editable-slots
    content: Implement in-place slot editing with replace and delete flows.
    status: completed
  - id: phase2-pattern-actions
    content: Implement single/pair/pung/chow quick actions with hard guards.
    status: completed
  - id: phase3-real-tile-images
    content: Integrate real tile visuals with robust fallback behavior.
    status: completed
  - id: final-hardening
    content: Run full tests, complexity checks, and release-readiness review.
    status: completed
isProject: false
---

# HLM UI/UX Input Upgrade Plan

## Parent Plan Link

- Master roadmap:
  [hlm-master-plan.plan.md](hlm-master-plan.plan.md)

## Scope Lock

- Delivery model: phased.
- Visual target: real tile images first.
- Rule-engine input contract remains canonical tile codes only.
- Do not alter scoring semantics in this plan.

## Architecture Boundaries

- Domain modules stay untouched:
  - [src/app/evaluateCapturedHand.js](02product/01_coding/project/hlm/src/app/evaluateCapturedHand.js)
  - [src/app/manualTileInput.js](02product/01_coding/project/hlm/src/app/manualTileInput.js)
- UI modules in scope:
  - [public/app.js](02product/01_coding/project/hlm/public/app.js)
  - [public/appEventWiring.js](02product/01_coding/project/hlm/public/appEventWiring.js)
  - [public/appRefs.js](02product/01_coding/project/hlm/public/appRefs.js)
  - [public/appStateActions.js](02product/01_coding/project/hlm/public/appStateActions.js)
  - [public/tileAssets.js](02product/01_coding/project/hlm/public/tileAssets.js)
  - [public/uiRenderers.js](02product/01_coding/project/hlm/public/uiRenderers.js)
  - [public/index.html](02product/01_coding/project/hlm/public/index.html)
  - [public/styles-components.css](02product/01_coding/project/hlm/public/styles-components.css)
  - [src/app/tilePatternActions.js](02product/01_coding/project/hlm/src/app/tilePatternActions.js)
  - [src/app/tilePickerState.js](02product/01_coding/project/hlm/src/app/tilePickerState.js)

## Current Status Dashboard

- Owner: `project-owner`
- OverallStatus: `completed`
- PlanClass: `historical-archive`
- ProgressPercent: `100`
- ActivePhase: `Phase_4_Final_Hardening_Completed`
- CompletedPhases:
  - `Phase 0: Baseline`
  - `Phase 1: Editable Slots`
  - `Phase 2: Pattern Actions`
  - `Phase 3: Real Tile Images`
- Focus:
  - `Full quality gates have been executed for implemented UI/UX scope.`
  - `No regressions detected in picker flow and tile action guards.`
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
  - `All UI/UX phase todos in frontmatter are marked completed.`
  - `Implementation evidence and tests are documented below.`
  - `No pending actions remain; this plan is traceability-only.`
- LastUpdated: `2026-03-16`

## Security and Safety Baseline

- Render tile labels and dynamic values with `textContent`, not unsafe HTML.
- Restrict tile action inputs to canonical tile set allowlist.
- Keep tile-image assets local and version-controlled; no runtime remote URLs.
- Preserve accessibility on failure: missing image must degrade to text label.
- Treat any pre-existing unrelated failing test as release blocker until
  triaged and resolved or explicitly approved in master-plan blocker notes.
- Keep behavior deterministic:
  - no random UI decisions in action selection,
  - no network dependency in tile rendering path.

## Phase Plan

### Phase 0: Baseline

- Record baseline tap count for representative hand-entry flows.
- Confirm test baselines and known blocker status.
- Lock acceptance criteria for all phases.

#### Exit Criteria

- Baseline tap metrics are captured and stored in work notes.
- Known blocker list is synced with master plan dashboard.
- TDD command list for this track is confirmed.

### Phase 1: Editable Slots

- Add `editingIndex` slot mode in picker state.
- Enable click-to-edit in tile preview.
- Replace-on-pick when editing; append when not editing.
- Add delete-selected-slot flow and selected-slot visual cue.

#### Exit Criteria

- Any slot can be edited in at most two interactions.
- Existing undo/clear behavior remains unchanged.
- Unit and integration gates pass for this phase.

### Phase 2: Pattern Actions

- Add pure helper for single/pair/pung/chow candidates and validation.
- Enforce hard guards:
  - remaining slots,
  - max four copies per tile,
  - chow only for suited tiles,
  - chow range in 1..9,
  - atomic reject on any invalid candidate.

#### Exit Criteria

- Invalid pattern actions never mutate state partially.
- Disabled actions are consistent with guard evaluation.
- Unit and integration gates pass for this phase.

### Phase 3: Real Tile Images

- Add image mapping layer and renderer integration.
- Keep `data-tile-code` canonical for all interactions.
- Add fallback behavior and accessibility labels.

#### Exit Criteria

- Image-mode picker/preview is fully usable.
- Missing image paths always fallback to text labels.
- Accessibility labels remain present for interactive tiles.
- Unit and integration gates pass for this phase.

## TDD and Gates

- Per phase sequence:
  1) write failing tests,
  2) implement minimal pass,
  3) refactor for clarity/complexity,
  4) run phase gates.
- Gate commands:
  - `npm run test:unit`
  - `npm run test:integration`
- Completion gates:
  - `npm run test:regression`
  - `npm test`
  - `npm run quality:complexity`
  - `cloc <touched-file>`

## Security Verification Cases

- Verify no unsafe HTML rendering path introduced in UI updates.
- Verify tile actions reject any non-canonical tile code input.
- Verify missing image asset path does not break event wiring.
- Verify no remote URL is used by tile-image mapping.

## Release Blockers

- Any unresolved blocker in master dashboard `Blocked` section.
- Any failed test or complexity gate.
- Any unresolved fallback/a11y regression in image mode.
- Any failed security verification case.

## Rollback and Change Control

- Land each phase as an isolated change-set for reversible rollout.
- If a phase introduces instability, rollback that phase only.
- Do not couple UI phase changes with scoring-engine modifications.

## Current Implementation Evidence

- Quick action logic module exists:
  - [src/app/tilePatternActions.js](02product/01_coding/project/hlm/src/app/tilePatternActions.js)
- Tile image and label mapping module exists:
  - [public/tileAssets.js](02product/01_coding/project/hlm/public/tileAssets.js)
- Wiring and render touchpoints are active in:
  - [public/app.js](02product/01_coding/project/hlm/public/app.js)
  - [public/appStateActions.js](02product/01_coding/project/hlm/public/appStateActions.js)
  - [public/uiRenderers.js](02product/01_coding/project/hlm/public/uiRenderers.js)
- Phase-aligned tests are present:
  - [tests/unit/tilePatternActions.test.js](02product/01_coding/project/hlm/tests/unit/tilePatternActions.test.js)
  - [tests/unit/tileAssets.test.js](02product/01_coding/project/hlm/tests/unit/tileAssets.test.js)
  - [tests/integration/mobilePickerFlow.test.js](02product/01_coding/project/hlm/tests/integration/mobilePickerFlow.test.js)
- HTML shell hardening includes explicit favicon declaration to reduce
  browser-noise false alarms:
  - [public/index.html](02product/01_coding/project/hlm/public/index.html)
  - [tests/unit/indexStylesheetLinks.test.js](02product/01_coding/project/hlm/tests/unit/indexStylesheetLinks.test.js)

## Ready-to-Release Checklist

- Scope and boundaries are explicit.
- Security baseline is explicit and testable.
- TDD order and commands are explicit.
- Phase exit conditions are explicit and reviewable.
- Final hardening gates are recorded as pass for this child track.
