---
name: hlm_mjpdf_alignment_execution
overview: Create an MJ.pdf-authoritative alignment plan for HLM, execute via
  TDD, and link/synchronize it with the HLM master plan track and status
  dashboard.
todos:
  - id: extract-mjpdf-rules
    content: Extract authoritative rules from MJ.pdf into a checklist with
      citations for winning conditions, 81 fans, and counting principles.
    status: completed
  - id: audit-rule-code-gaps
    content: Map MJ.pdf checklist against winValidator, fanRegistry,
      detectors, and exclusion map; classify P0/P1/P2.
    status: completed
  - id: tdd-add-failing-tests
    content: Create fail-first tests for each P0/P1 mismatch across
      unit/regression/integration layers.
    status: completed
  - id: implement-bottom-up-fixes
    content: Implement smallest-module fixes to make failing tests pass while
      preserving existing behavior where compliant.
    status: completed
  - id: run-full-validation-gates
    content: Run unit, regression, integration, full suite, complexity checks,
      and cloc for touched files.
    status: completed
  - id: link-and-sync-master-plan
    content: Link this child plan in hlm-master-plan.plan.md and synchronize
      active track/status/next actions with execution reality.
    status: completed
isProject: false
---

# HLM MJ.pdf Official Alignment Plan

## Objective

Align HLM scoring/win validation to `MJ.pdf` (WMO 2009) as the single
authoritative source, then synchronize this child plan into the HLM master
plan.

## Scope

- In scope:
  - Rule extraction from `MJ.pdf` for winning-hand conditions, 81 fan
    list/values, timing/win-mode terms, and exclusion/not-counted principles.
  - Rule-to-code gap audit against:
    - [src/rules/winValidator.js](../../src/rules/winValidator.js)
    - [src/rules/fanRegistry.js](../../src/rules/fanRegistry.js)
    - [src/rules/detectors/contextDetectors.js](../../src/rules/detectors/contextDetectors.js)
    - [src/contracts/structuredContextValidator.js](../../src/contracts/structuredContextValidator.js)
    - [src/rules/exclusionMap.js](../../src/rules/exclusionMap.js)
  - TDD-first implementation to close P0/P1 gaps.
  - Full validation gates (unit/regression/integration/full/complexity/cloc).
  - Master-plan linkage/status sync.
- Out of scope:
  - Non-MJ.pdf house rules.

## Execution Strategy (TDD)

1. Build a machine-readable MJ.pdf checklist (rule IDs + source citations).
2. Produce fail-first tests for each missing/misaligned item.
3. Implement in smallest modules (bottom-up) until tests pass.
4. Reconcile exclusion/conflict semantics with MJ.pdf counting principles.
5. Run all quality/test gates and collect evidence.
6. Update child plan statuses and then update master plan active
   track/status/next actions.

## MJ.pdf Extraction Snapshot (Completed)

- Authoritative source fixed to `MJ.pdf` (`WMO 2009`) in workspace root.
- Winning requirements extracted:
  - `3.7.2` special hand includes `全不靠` in addition to `七对/十三幺`.
  - `3.4.22` + `3.9.1` require legal hand pattern + min `8` fan to win.
- Fan list/value extracted:
  - `3.8.1` states total `81` fan types.
  - Identified official entries relevant to current gap set:
    `全不靠(12)`, `组合龙(12)`, `一色四节高(48)`, `妙手回春(8)`.

## Rule-to-Code Gap Audit (Completed)

### P0 (must fix first)

- `winValidator.js` does not validate `全不靠` (or related non-standard
  special structures); current validator only supports `standard`, `seven_pairs`
  and `thirteen_orphans`.
- `fanRegistry.js` has been aligned to include MJ.pdf canonical entries
  (`全不靠`, `组合龙`, `一色四节高`, `妙手回春`) in the current slice.
- `structuredContextValidator.js` now accepts canonical `specialPattern`
  values (`quan_bu_kao`, `zu_he_long`) and removed the old `mixed_straight`
  path.

### P1 (semantic/terminology alignment)

- Timing naming mismatch has been corrected in current slice:
  - `MIAO_SHOU_HUI_CHUN` -> last-wall self-draw.
  - `HAI_DI_LAO_YUE` -> last-discard win.
- `MCR_TARGET_FAN_COUNT` has been switched from `82` to strict `81`.

### P2 (defer until core correctness is green)

- Rule trace docs and lexicon wording cleanup after P0/P1 code and tests pass.

## Locked Decisions (Plan Baseline)

- Rule baseline is locked to `MJ.pdf` (`WMO 2009`) for this track.
- Mapping strategy is locked to `strict_81`:
  - Canonical target remains official `81` fan entries.
  - Existing non-official aliases or split rows must be reconciled toward
    canonical MJ.pdf semantics during implementation.
- Terminology alignment is locked:
  - Event and fan naming must follow MJ.pdf terms at canonical layer.
- Execution order is locked:
  - Fail-first tests for P0/P1 gaps first, then minimal implementation.

## Priority Backlog

- P0:
  - Missing win-structure support for special hands required by MJ.pdf
    (not only standard/7 pairs/13 orphans path).
  - Missing fan entries/detectors identified against MJ.pdf 81 list
    (expected includes items previously flagged).
  - Timing terminology/behavior mismatch where scoring semantics differ.
- P1:
  - Lexicon/UI wording normalization to MJ.pdf terms while preserving
    compatibility if needed.
  - Exclusion/not-counted gaps that alter final fan outcomes.
- P2:
  - Documentation and trace-matrix refinements.

## P0 Fail-First Test Checklist (Execution-Ready)

### A) Win structure validation (`winValidator.js`)

- Target file:
  - [tests/unit/winValidator.test.js](../../tests/unit/winValidator.test.js)
- Add failing tests:
  - `validateWin` accepts valid `全不靠` 14-single-tile shape and returns
    dedicated pattern id.
  - `validateWin` rejects near-miss `全不靠` (duplicate or disallowed pattern).
  - `validateWin` keeps existing pass cases (`standard`, `seven_pairs`,
    `thirteen_orphans`) unchanged.

### B) Registry/canonical count (`fanRegistry.js`)

- Target file:
  - [tests/unit/fanRegistry.test.js](../../tests/unit/fanRegistry.test.js)
- Add failing tests:
  - Registry contains MJ.pdf canonical ids for `全不靠`, `组合龙`,
    `一色四节高`, `妙手回春`.
  - Registry target count aligns to strict `81`.
  - Legacy split/alias ids blocked by strict_81 policy are absent or mapped
    through approved compatibility layer tests (canonical output still MJ.pdf).

### C) Detector coverage parity (`fanCatalog` / detectors)

- Target files:
  - [tests/unit/fanCatalog.structure.test.js](../../tests/unit/fanCatalog.structure.test.js)
  - [tests/unit/fanDetectors.test.js](../../tests/unit/fanDetectors.test.js)
- Add failing tests:
  - Every registry id still has a detector after strict_81 normalization.
  - Context/pattern detection includes new canonical ids and drops removed ids.
  - No stale detector id remains in catalog when registry is canonicalized.

### D) Context contract (`handState` + structured context)

- Target files:
  - [tests/unit/structuredContextValidator.test.js](../../tests/unit/structuredContextValidator.test.js)
  - [tests/unit/handState.test.js](../../tests/unit/handState.test.js)
- Add failing tests:
  - `specialPattern` enum accepts new canonical values required by MJ.pdf path.
  - Invalid legacy-only values fail when strict_81 mode is active.
  - `timingEvent` semantics map to MJ.pdf terms without changing base contract
    shape unexpectedly.

### E) Scoring semantics integration (`scoreHand` flow)

- Target files:
  - [tests/unit/scoringEngine/patternsAndShapes.test.js](../../tests/unit/scoringEngine/patternsAndShapes.test.js)
  - [tests/regression/goldenCases.json](../../tests/regression/goldenCases.json)
  - [tests/integration/evaluateCapturedHand.test.js](../../tests/integration/evaluateCapturedHand.test.js)
- Add failing tests:
  - Canonical MJ.pdf timing/fan combinations score expected fan totals.
  - `8`-fan gate behavior remains correct after strict_81 normalization.
  - Regression snapshots explicitly include migrated canonical naming outcomes.

### F) Exclusion/conflict invariants

- Target files:
  - [tests/unit/conflictResolver.test.js](../../tests/unit/conflictResolver.test.js)
  - [tests/unit/exclusionMap.truthTable.test.js](../../tests/unit/exclusionMap.truthTable.test.js)
- Add failing tests:
  - Existing five-principle constraints still hold under renamed/normalized ids.
  - No orphan exclusion key references removed ids.

## Implementation Sequencing (after fail-first tests exist)

1. `winValidator` + pattern detectors
2. registry/canonical ids + fanCatalog parity
3. context contract + timing semantics
4. exclusion/conflict map normalization
5. regression + integration stabilization

## First Batch Fail-First Tests (12)

1. `validateWin recognizes QUAN_BU_KAO canonical shape`
2. `validateWin rejects QUAN_BU_KAO with duplicated tile`
3. `fanRegistry includes QUAN_BU_KAO/ZU_HE_LONG/YI_SE_SI_JIE_GAO/MIAO_SHOU_HUI_CHUN`
4. `fanRegistry strict_81 target equals 81`
5. `fanCatalog still covers every registry id after strict_81 normalization`
6. `patternDetectors maps QUAN_BU_KAO pattern id from validateWin`
7. `structuredContextValidator accepts canonical specialPattern values only`
8. `handState timingEvent accepts canonical MJ.pdf timing semantics`
9. `detectFans emits MIAO_SHOU_HUI_CHUN for last-wall self-draw event`
10. `detectFans emits HAI_DI_LAO_YUE for last-discard win event`
11. `conflictResolver/exclusionMap contains no removed-id references after strict_81`
12. `scoreHand keeps 8-fan gate correctness under strict_81 canonical ids`

### File Mapping for First Batch

- `tests/unit/winValidator.test.js`: 1, 2
- `tests/unit/fanRegistry.test.js`: 3, 4
- `tests/unit/fanCatalog.structure.test.js`: 5
- `tests/unit/fanDetectors.test.js`: 6, 9, 10
- `tests/unit/structuredContextValidator.test.js`: 7
- `tests/unit/handState.test.js`: 8
- `tests/unit/exclusionMap.truthTable.test.js`: 11
- `tests/unit/scoringEngine/patternsAndShapes.test.js`: 12

## Test Gates

- `npm run test:unit`
- `npm run test:regression`
- `npm run test:integration`
- `npm test`
- `npm run quality:complexity`
- `cloc <each touched program file>`

## Iteration Evidence (Current Slice)

- TDD (fail-first then green) covered in this slice:
  - `tests/unit/winValidator.test.js` (`quan_bu_kao` pattern case)
  - `tests/unit/fanRegistry.test.js` (strict_81 + canonical ids)
  - `tests/unit/handState.test.js`
  - `tests/unit/structuredContextValidator.test.js`
  - `tests/unit/fanDetectors.test.js` (context + `ZU_HE_LONG` detection path)
- Implementation landed for current slice:
  - `winValidator` supports `quan_bu_kao` pattern.
  - Registry moved to strict `81` with canonical MJ.pdf additions.
  - Context/timing and detector wiring aligned to `MIAO_SHOU_HUI_CHUN` +
    `HAI_DI_LAO_YUE` semantics.
  - Rule-trace matrix regenerated after detector/registry changes.
- Validation commands run and passing:
  - `npm run test:unit`
  - `npm run test:integration`
  - `npm run test:regression`
  - `npm test`
  - `npm run quality:complexity`
  - `cloc` on touched files (report captured)
- Follow-up cleanup slice:
  - Removed obsolete `rankZone` enum path from
    `structuredContextValidator.js` under strict_81.
  - Re-ran full suite and complexity gates; all pass.

## Master-Plan Linkage

- Add this child plan into:
  - [hlm-master-plan.plan.md](hlm-master-plan.plan.md)
- Synchronize:
  - active track id
  - dashboard status
  - next actions
  - cross-links validity to workspace `.cursor/plans/` only
