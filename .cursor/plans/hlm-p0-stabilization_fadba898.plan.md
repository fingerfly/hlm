---
name: hlm-p0-stabilization
overview: Close the two P0 gaps by enforcing VisionResult contract in the runtime path and wiring provider timeout/retry through the VLM factory for deterministic fast-fail behavior.
todos:
  - id: p0-contract-enforcement
    content: Integrate VisionResult normalization into evaluateCapturedHand with compatibility mapping and safe failure handling.
    status: completed
  - id: p0-factory-timeout-wiring
    content: Forward timeout/retry options from vlmClientFactory to DeepSeek and Ollama clients.
    status: completed
  - id: p0-test-updates
    content: Add/adjust integration and spike tests to prove contract enforcement and fast-fail timeout behavior.
    status: completed
  - id: p0-verify
    content: Run targeted suites then full npm test, plus cloc check on touched files.
    status: completed
isProject: false
---

# HLM P0 Stabilization Plan

## Current Status Dashboard

- Owner: `project-owner`
- OverallStatus: `completed`
- PlanClass: `historical-archive`
- ProgressPercent: `100`
- ActivePhase: `P0_Stabilization_Completed`
- Focus:
  - `P0 contract enforcement and factory timeout wiring are complete.`
  - `Track serves as stable prerequisite for UI/UX and migration work.`
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
  - `All P0 todos in plan frontmatter are marked completed.`
  - `Master plan lists P0 stabilization as completed prerequisite.`
  - `No pending actions remain; this plan is traceability-only.`
- LastUpdated: `2026-03-16`

## Goal

- Make runtime recognition output contract-safe before scoring.
- Make VLM provider timeout/retry settings actually effective from factory config.

## Scope (P0 Only)

- Contract enforcement path: `[src/app/evaluateCapturedHand.js](02product/01_coding/project/hlm/src/app/evaluateCapturedHand.js)`, `[src/contracts/visionResult.js](02product/01_coding/project/hlm/src/contracts/visionResult.js)`, and compatibility boundary `[src/vision/pipeline.js](02product/01_coding/project/hlm/src/vision/pipeline.js)`.
- Fast-fail wiring path: `[src/spike/vlm/vlmClientFactory.js](02product/01_coding/project/hlm/src/spike/vlm/vlmClientFactory.js)`.
- Test paths in scope:
  - `[tests/integration/evaluateCapturedHand.test.js](02product/01_coding/project/hlm/tests/integration/evaluateCapturedHand.test.js)`
  - `[tests/unit/visionResult.test.js](02product/01_coding/project/hlm/tests/unit/visionResult.test.js)`
  - `[tests/spike/vlmClientFactory.test.js](02product/01_coding/project/hlm/tests/spike/vlmClientFactory.test.js)`

## Implementation Steps

### 1) Enforce recognition contract in evaluator choke point

- In `[src/app/evaluateCapturedHand.js](02product/01_coding/project/hlm/src/app/evaluateCapturedHand.js)`, normalize recognition output immediately after confirmed-tile merge and before `need_human_confirm` / scoring branching.
- Add a compatibility adapter:
  - runtime `missingIndices` -> contract `uncertainIndices` for validation input.
  - contract-normalized output -> preserve existing runtime fields (`missingIndices`, `tileCodes`) to avoid broad downstream breakage.
- Add explicit handling for contract-invalid / failed recognition path to avoid accidental scoring on malformed recognition data.

### 2) Keep producer boundary compatibility stable

- Keep `[src/vision/pipeline.js](02product/01_coding/project/hlm/src/vision/pipeline.js)` output backward-compatible (`missingIndices` + `tileCodes`) for this P0.
- Defer any full-field migration (`uncertainIndices` only) to a later non-P0 cleanup pass.
- P0 decision: do **not** perform broad pipeline field migration in this pass.

### 3) Wire timeout/retry through VLM factory

- In `[src/spike/vlm/vlmClientFactory.js](02product/01_coding/project/hlm/src/spike/vlm/vlmClientFactory.js)`, pass through:
  - `deepseek.timeoutMs`, `deepseek.retries` to `createDeepSeekClient`.
  - `ollama.timeoutMs`, `ollama.retries` to `createOllamaClient`.
- Preserve existing defaults in provider clients; factory should only forward when configured.

### 4) Test-first coverage updates

- Update/add tests in:
  - `[tests/integration/evaluateCapturedHand.test.js](02product/01_coding/project/hlm/tests/integration/evaluateCapturedHand.test.js)`
  - `[tests/unit/visionResult.test.js](02product/01_coding/project/hlm/tests/unit/visionResult.test.js)`
  - `[tests/spike/vlmClientFactory.test.js](02product/01_coding/project/hlm/tests/spike/vlmClientFactory.test.js)`
- Assertions to add:
  - evaluator does not score malformed recognition payloads.
  - normalized recognition still exposes `missingIndices` and `tileCodes` compatibility fields.
  - timeout/retry wiring is effective (e.g., `retries: 0` causes single-attempt timeout path with one fetch invocation).

### 5) Verification gates (fast-build-quick-fail)

- Run impacted suites first:
  - `npm run test:integration`
- Then full gate:
  - `npm test`
- Run `cloc --by-file --csv --quiet <touched files>` and verify SLOC target on changed program files.

## Review-Fix-Repeat Gate (Plan Readiness)

- Review pass checklist:
  - all referenced paths exist,
  - all commands exist in `package.json` scripts,
  - no ambiguous scope wording remains in P0 steps.
- Fix pass action:
  - patch plan wording/scope until each checklist item is explicit and executable.
- Repeat condition:
  - rerun path/command validation until checklist is fully green.

## Acceptance Criteria

- `normalizeVisionResult` actively protects main evaluation flow.
- `createVlmClient` honors per-provider timeout/retry config.
- P0 tests pass in targeted suites and in full `npm test`.
- No regressions in existing recognition-to-scoring behavior for accepted cases.

## Definition of Ready

- P0 scope is explicit and bounded.
- Execution order is deterministic (contract path first, factory wiring second, tests third, full verify last).
- Validation commands and target files are concrete.

