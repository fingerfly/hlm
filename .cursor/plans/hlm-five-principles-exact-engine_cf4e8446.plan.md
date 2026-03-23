---
name: hlm-five-principles-exact-engine
overview: >
  Implement a decomposition-aware exact scoring path in HLM to enforce all
  five Guobiao counting principles under the current project baseline
  (minWinningFan=1), with comprehensive unit/regression/integration coverage.
todos:
  - id: capture-baseline-behavior
    content: Add characterization tests for ambiguous and interaction-heavy
      hands under current scorer output.
    status: completed
  - id: enumerate-all-decompositions
    content: Implement full standard-hand decomposition enumerator and tests
      for completeness and uniqueness.
    status: completed
  - id: encode-five-principles
    content: Implement principle constraint module covering all five counting
      principles with focused positive and negative tests.
    status: completed
  - id: build-exact-optimizer
    content: Implement exact legal allocation optimizer over decomposition and
      fan candidate graph, maximizing legal total fan.
    status: completed
  - id: integrate-scorehand
    content: Wire exact scorer into scoringEngine while preserving response
      contract and reason tracing.
    status: completed
  - id: expand-comprehensive-tests
    content: Add unit, regression, and integration suites for edge cases,
      legacy coverage, and context interactions.
    status: completed
  - id: run-quality-and-full-tests
    content: Run complexity checks, cloc checks for touched program files, and
      full test matrix before completion.
    status: completed
isProject: false
---

# HLM Five-Principles Exact Scoring Plan

## Goal

Build an exact, decomposition-aware scoring engine that enforces all five
counting principles (不重复, 不拆移, 不得相同, 就高不就低, 套算一次)
while preserving current baseline `minWinningFan=1`.

## Core design

- Extend win decomposition beyond first-hit grouping to enumerate all legal
  standard decompositions.
- Evaluate fan candidates with principle constraints tied to decomposition
  resources.
- Select the highest legal score across decompositions and allocations.
- Integrate into `scoreHand` with stable output contract and explicit
  exclusion traces.

## Target code areas

- `src/rules/winValidator.js`
- `src/rules/scoringEngine.js`
- `src/rules/conflictResolver.js` (compatibility/fallback interactions)
- New modules under `src/rules/`:
  - `decompositionEnumerator.js`
  - `principleConstraints.js`
  - `exactPrincipleScorer.js`
  - `scoringTrace.js`

## Principle mapping

- 不重复原则: dominance and exclusion edges prevent implied sub-fans from
  re-scoring.
- 不拆移原则: fan allocation is bound to one decomposition; regrouping after
  selection is disallowed.
- 不得相同原则: identical-scope fan reuse over same resource instance is
  constrained.
- 就高不就低原则: global maximization over all legal decomposition paths.
- 套算一次原则: one-time attach constraints for attachable interactions.

## Test gates

- Unit: decomposition completeness/uniqueness, per-principle positive and
  negative cases, optimizer legality and determinism.
- Regression: preserve non-ambiguous stable outcomes, lock corrected edge
  cases.
- Integration: end-to-end `scoreHand` behavior with context combinations and
  exclusion-reason traces.
- Quality: `npm run quality:complexity`, per-file `cloc`, then full suite:
  `npm run test:unit`, `npm run test:regression`,
  `npm run test:integration`, `npm test`.

## Master plan link

- Parent: `hlm-master-plan.plan.md`

## Iteration log

- Iteration 1 complete:
  - Added all-standard decomposition enumeration in `winValidator`.
  - Updated `scoreHand` to evaluate standard decompositions and select the
    highest legal total fan.
  - Added one-time attach guard for `HUA_LONG` with attachable interactions
    (`XI_XIANG_FENG` / `LIAN_LIU`) in conflict resolution.
  - Added unit tests for decomposition ambiguity and one-time attachment.
  - Ran `quality:complexity`, unit, regression, integration, and full suite.
- Iteration 2 complete:
  - Added regression golden case `hua_long_attach_once_hand` to lock
    one-time-attach behavior for 花龙 interactions.
  - Re-ran full validation gates:
    `test:regression`, `test:unit`, `test:integration`,
    `quality:complexity`, and `npm test`.
- Iteration 3 complete:
  - Strengthened exclusion behavior to remove all repeated instances of
    target fans under exclusion relations (consistency for 不重复原则 in
    repeated-candidate scenarios).
  - Added unit test `resolveFanConflicts excludes all repeated target fan
    instances`.
  - Re-ran full validation gates:
    `test:unit`, `test:regression`, `test:integration`,
    `quality:complexity`, and `npm test`.
- Iteration 4 complete:
  - Added dedicated principle module `principleConstraints.js`.
  - Applied shared same-fan-once constraint (不得相同 baseline guard)
    before conflict/exclusion passes in `conflictResolver`.
  - Added unit test `resolveFanConflicts keeps only one instance for same
    fan id`.
  - Re-ran full validation gates:
    `test:unit`, `test:regression`, `test:integration`,
    `quality:complexity`, and `npm test`.
- Iteration 5 complete:
  - Moved attach-once logic into `principleConstraints` as
    `applyAttachOncePrinciple`, so "套算一次" is enforced in a shared
    principle layer instead of hardcoded in resolver body.
  - Updated `conflictResolver` to call principle-layer guards in sequence.
  - Added dedicated unit tests for `principleConstraints`.
  - Re-ran full validation gates:
    `test:unit`, `test:regression`, `test:integration`,
    `quality:complexity`, and `npm test`.
- Iteration 6 complete:
  - Moved conflict-group and exclusion-map logic into
    `principleConstraints` as `applyConflictGroupPrinciple` and
    `applyExclusionMapPrinciple`.
  - Refactored `conflictResolver` into orchestration-only flow that composes
    principle steps.
  - Added principle-layer unit tests for group-conflict and exclusion-map
    behavior.
  - Re-ran full validation gates:
    `test:unit`, `test:regression`, `test:integration`,
    `quality:complexity`, and `npm test`.
