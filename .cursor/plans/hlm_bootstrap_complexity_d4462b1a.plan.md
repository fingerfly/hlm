---
name: hlm-bootstrap-complexity
overview: |
  (Completed 2026-04-09.) Split public/app.js bootstrap into focused modules
  and upgraded scripts/quality-complexity.js to brace-aware function-size
  detection under TDD and full-gate validation.
todos:
  - id: link-master-track
    content: Link this child plan into master queue, index, and status dashboard.
    status: completed
  - id: tdd-bootstrap-extraction
    content: |
      Write fail-first tests and extract public/app.js responsibilities into focused modules while preserving behavior.
    status: completed
  - id: tdd-complexity-parser
    content: |
      Write fail-first tests and implement brace-depth-aware function-size detection in scripts/quality-complexity.js.
    status: completed
  - id: full-gates-and-closeout
    content: |
      Run full test + complexity + cloc gates, then close child and master plan statuses consistently.
    status: completed
isProject: false
---

# HLM Bootstrap + Complexity Guardrail Plan

## Parent

- [hlm-master-plan.plan.md](hlm-master-plan.plan.md)

## Objective

- Reduce bootstrap coupling in `public/app.js` without behavior drift.
- Make complexity gate detection accurate for modern JS function forms.
- Keep all existing quality gates green under TDD-first execution.

## Scope

- In scope:
  - Refactor [public/app.js](../public/app.js) into smaller cooperating modules.
  - Replace heuristic function-size logic in
    [scripts/quality-complexity.js](../scripts/quality-complexity.js) with
    brace-depth-aware scanning.
  - Add tests in [tests/unit/](../tests/unit/).
- Out of scope:
  - No scoring-rule behavior changes.
  - No visual redesign or copy changes.
  - No CI topology changes.

## Review -> Fix Findings (Iteration 1)

1. Child plan was created outside workspace canonical location (`~/.cursor`),
   violating active-plan storage policy.
2. Master plan had no track/todo/index/dashboard linkage for this child plan.
3. Child plan lacked explicit parent/dependency/readiness metadata used by
   other HLM child plans.

## Fixes Applied (Iteration 1)

- Canonical child plan created at
  `.cursor/plans/hlm_bootstrap_complexity_d4462b1a.plan.md`.
- Added `parentPlan`, `dependsOn`, `status: ready_for_execution`, and explicit
  todo list for execution slices.
- Prepared master-linkage actions as the first todo.

## Review -> Fix Findings (Iteration 2)

1. Master-link task was still listed as pending in child todos after linkage.
2. Needed explicit validation evidence that links/status are synchronized.

## Fixes Applied (Iteration 2)

- Marked `link-master-track` todo as `completed`.
- Verified master track id, child-plan links, and active-phase fields align with
  this child plan's readiness state.

## Validation Evidence (Iteration 2 — pre-execution snapshot)

- Child plan file exists in workspace:
  `.cursor/plans/hlm_bootstrap_complexity_d4462b1a.plan.md`.
- Global duplicate removed from `~/.cursor/plans`.
- Master plan linked this child under `track-bootstrap-complexity-hardening`
  (queue later advanced to **completed**; see execution closeout).

## Execution closeout (2026-04-09)

- Frontmatter todos: all **completed** (`link-master-track`,
  `tdd-bootstrap-extraction`, `tdd-complexity-parser`,
  `full-gates-and-closeout`).
- Master plan: `track-bootstrap-complexity-hardening` **completed**;
  `Active TrackId: none` (maintenance); index + dashboard + `TrackTodoStatus`
  aligned.
- Delivered modules: `public/appSplash.js`,
  `public/desktopContextInlineMount.js`, `public/roundSetupDomSync.js`,
  `public/roundSetupBindings.js`, `public/escapeKeyModalWiring.js`,
  `public/wizardCalculateHint.js`; `public/app.js` remains orchestration
  root.
- Complexity: `scripts/lib/jsCodeCharMask.js`,
  `scripts/lib/jsFunctionBodyScan.js`, `scripts/quality-complexity.js`
  (line width + brace-aware body spans; main-module guard).
- Tests: new/updated unit tests under `tests/unit/` (bootstrap + scanner).
- Gates verified: `npm run test:unit`, `npm run test:regression`,
  `npm run test:integration`, `npm test`, `npm run quality:complexity`,
  `cloc` on touched program files.

## Implementation Slices

1. Bootstrap modularization (`public/app.js`):
   - Extract splash lifecycle.
   - Extract desktop context-inline mount.
   - Extract round/dealer highlight + score-rule bindings.
   - Extract Escape-close policy and discarder visibility sync.
   - Keep `public/app.js` as composition/orchestration root.
2. Complexity scanner hardening (`scripts/quality-complexity.js`):
   - Preserve line-width check.
   - Add scanner states for comments/strings/template literals.
   - Count function body size by matching brace depth for declarations,
     expressions, arrows, and object/class-style methods.
   - Preserve output format (`file:line`) expected by current workflow.

## Test Strategy (TDD)

- Fail-first unit tests for extracted bootstrap modules and orchestration
  invariants.
- Fail-first unit tests for function-size detector edge cases:
  - declaration/expression/arrow/method
  - nested blocks
  - braces inside strings/comments/template literals
  - multiline signatures

## Gates

- `npm run test:unit`
- `npm run test:regression`
- `npm run test:integration`
- `npm test`
- `npm run quality:complexity`
- `cloc <each touched program file>`

## Completion Verdict

- Status: **completed** (2026-04-09).
- Scope delivered without scoring-rule, visual, or CI-topology changes.
- Follow-up: run `npm test` and `npm run quality:complexity` after future
  edits to bootstrap or complexity scanner code paths.
