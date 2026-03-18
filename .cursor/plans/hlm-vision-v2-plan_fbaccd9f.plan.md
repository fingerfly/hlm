---
name: hlm-vision-v2-plan
overview: Refactor HLM recognition into a candidate-based, human-confirmable Vision V2 flow while keeping scoring pipeline stable and test-first.
todos:
  - id: phase1-contract-tests
    content: Define Vision V2 contract with failing tests first, then implement minimal contract validation/normalization.
    status: completed
  - id: phase2-recognizer-gate
    content: Upgrade recognizer and confidence gate to Top-K + uncertainty output using strict TDD loops.
    status: completed
  - id: phase3-app-confirm-flow
    content: Add confirmable app flow with human slot overrides and integration coverage.
    status: completed
  - id: phase4-demo-ui
    content: Implement uncertain-slot confirmation loop in demo UI while preserving one-click demo regression path.
    status: completed
  - id: phase5-spike-reliability
    content: Harden spike reliability via provider health checks, timeout/retry policy, and failure diagnostics tests.
    status: completed
  - id: fast-build-quick-fail
    content: Apply fast-build-quick-fail pipeline gates so failures surface at the earliest possible stage.
    status: completed
  - id: full-verification
    content: Run complete unit/integration/regression/spike suites and confirm green before claiming completion.
    status: completed
isProject: false
---

# HLM Vision V2 Refactor Plan

## Current Status Dashboard

- Owner: `project-owner`
- OverallStatus: `completed`
- PlanClass: `historical-archive`
- ProgressPercent: `100`
- ActivePhase: `Phase_5_Spike_Reliability_Completed`
- Focus:
  - `Vision V2 contract, confirm flow, and reliability track are complete.`
  - `Track remains stable and serves as baseline for downstream plans.`
- RisksAndBlockers:
  - `none`
- NextActions:
  - `none`
- ExitGateCheck:
  - Unit: `pass`
  - Integration: `pass`
  - Regression: `pass`
  - Spike: `retired-track`
  - FullSuite: `pass`
  - Complexity: `pass`
  - SLOCReview: `pass-with-notes`
- ValidationEvidence:
  - `All Vision V2 todos in plan frontmatter are marked completed.`
  - `Master plan lists Vision V2 as completed prerequisite.`
  - `No pending actions remain; this plan is traceability-only.`
- LastUpdated: `2026-03-16`

## Goal

- Build a candidate-based Vision V2 flow that supports human confirmation and never blocks scoring.
- Keep scoring and rule behavior stable by preserving the current rule-engine interface.
- Execute with TDD and fast-build-quick-fail discipline to reduce debugging cost.

## Execution Baseline Rules

- `TDD-first`: each code change begins with a failing test, then minimal implementation, then refactor.
- `Systematic debugging`: rely on evidence (logs, outputs, generated artifacts), not assumptions.
- `Never claim done early`: completion requires full test pass and practical verification.
- `Modular construction`: prefer small cooperating modules over monolithic changes.
- `Clean workspace`: no unnecessary files; delete temporary artifacts after use.
- `Test placement`: keep test scripts under `tests/`.
- `Safety fallback`: if recognition confidence is insufficient, force human-confirm path instead of hard fail.
- `Review-Fix-Repeat`: after each phase, review output, fix gaps immediately, then re-verify before advancing.

## Fast-Build-Quick-Fail Strategy

- Fail as early as possible at the cheapest layer:
  - Contract/unit failures first
  - Module integration failures second
  - End-to-end and spike reliability failures last
- Gate progression by phase:
  - A phase does not proceed unless its target tests are green.
- Use command sequence for quick feedback:
  - `npm run test:unit` / `npm run test:integration` / `npm run test:regression` (run only impacted suite first)
  - `npm test` (full local gate across all suites)
- Build policy:
  - stop-on-first-red, fix immediately, re-run impacted scope, then resume.

## Codebase Baseline

- Recognition pipeline entry: `02product/01_coding/project/hlm/src/vision/pipeline.js`
- Confidence gate: `02product/01_coding/project/hlm/src/vision/confidenceGate.js`
- App orchestration: `02product/01_coding/project/hlm/src/app/evaluateCapturedHand.js`
- Demo UI entry: `02product/01_coding/project/hlm/public/app.js`
- Spike/provider components:
  - `02product/01_coding/project/hlm/src/spike/vlm/deepseekClient.js`
  - `02product/01_coding/project/hlm/src/spike/vlm/ollamaClient.js`
  - `02product/01_coding/project/hlm/src/spike/vlm/providerHealth.js`

## Delivery Roadmap

### Phase 1 - Vision V2 Contract (TDD)

**Goal**

- Define and validate the recognition contract for `Top-K + uncertainIndices`.

**Primary Files**

- `src/contracts/`*
- `tests/unit/*contract*.test.js`

**Steps**

- Write failing tests for 14-slot constraints and candidate shape.
- Implement minimal validation/normalization.
- Refactor for readability with no behavior drift.

**Exit Criteria**

- Contract tests green; invalid payloads fail with deterministic error messages.

### Phase 2 - Recognizer + Confidence Gate Upgrade (TDD)

**Goal**

- Produce per-slot Top-K candidates and robust uncertainty decisions.

**Primary Files**

- `src/vision/recognizer.js`
- `src/vision/confidenceGate.js`
- `src/vision/pipeline.js`
- `tests/unit/*recognizer*.test.js`, `tests/unit/*confidenceGate*.test.js`

**Steps**

- Add failing tests for vote aggregation, tie-break behavior, and uncertainty logic.
- Implement Top-K extraction and uncertainty scoring.
- Keep adapter compatibility in `pipeline.js` for existing consumers.

**Exit Criteria**

- New recognizer/gate tests green; existing pipeline behavior remains backward compatible.

### Phase 3 - Confirmable App Orchestration (TDD + Integration)

**Goal**

- Support `need_human_confirm -> user_override -> re-evaluate -> score` flow.

**Primary Files**

- `src/app/evaluateCapturedHand.js`
- `tests/integration/evaluateCapturedHand*.test.js`

**Steps**

- Add failing integration tests for confirm flow transitions.
- Extend request handling for user-confirmed tile overrides.
- Preserve current successful path when all slots are confident.

**Exit Criteria**

- Integration tests show confirm flow works and no rule-engine regression is introduced.

### Phase 4 - Demo UI Confirmation Loop

**Goal**

- Enable operator correction of uncertain slots directly in demo.

**Primary Files**

- `public/app.js`
- optionally `public/index.html` (only if controls are needed)

**Steps**

- Render uncertain slots with candidate buttons.
- Allow manual override if candidates are wrong.
- Keep one-click demo path for regression comparison.

**Exit Criteria**

- Demo can complete scoring after targeted human corrections.

### Phase 5 - Spike Reliability Hardening (Fast-Fail Gate)

**Goal**

- Separate model capability from provider/network instability during evaluation.

**Primary Files**

- `src/spike/vlm/deepseekClient.js`
- `src/spike/vlm/ollamaClient.js`
- `src/spike/vlm/providerHealth.js`
- `tests/spike/`*

**Steps**

- Add/adjust timeout/retry tests and provider health prechecks.
- Standardize error normalization and diagnostics payloads.
- Ensure unhealthy providers fail early with actionable messages.

**Exit Criteria**

- Spike tests green; timeout/network/provider errors are classified deterministically.

## Verification Gates

- During development:
  - targeted tests for changed area must pass before moving phase.
- Before completion claim:
  - `npm test`
  - integration + regression recheck in test logs
- If any gate fails:
  - stop, fix, and rerun from smallest impacted scope to full suite.

## Review-Fix-Repeat Loop

- Per-phase loop:
  - Review: compare implementation against phase goal, steps, and exit criteria.
  - Fix: resolve all critical/major gaps before advancing.
  - Repeat: rerun targeted tests until phase exit criteria are fully green.
- Loop stop conditions:
  - phase exit criteria passed,
  - no open critical/major findings,
  - no unresolved ambiguity in contract/state transitions.
- Escalation:
  - if the same failure repeats twice, add a focused diagnostic test first, then re-implement.

## Definition of Ready

- Phase goals are specific, testable, and mapped to concrete files.
- Referenced commands match repo scripts and are runnable as-is.
- Fast-build-quick-fail order is explicit and phase-gated.
- Global completion gate is explicit: `npm test`.
- Fallback behavior for low confidence is explicitly defined (human-confirm path).

## Practical Execution Notes

- Prefer editing existing files; add new files only with clear need.
- If `CHANGELOG.md` is updated, date must be today's date.
- Keep temporary files/scripts out of final tree.
- Keep modules small and composable to support incremental debugging.

