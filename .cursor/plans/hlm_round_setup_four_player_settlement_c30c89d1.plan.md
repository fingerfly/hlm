---
name: hlm_round_setup_four_player_settlement
overview: |
  Add a startup round-setup flow to define four players before hand entry,
  then compute and display four-player settlement results in the result modal
  using Guobiao-aligned settlement semantics and existing fan outputs.
todos:
  - id: define-settlement-domain
    content: >
      Design pure round/settlement data contracts and draft TDD cases for
      zimo+dianhe conservation and role validation.
    status: completed
  - id: startup-round-setup-gate
    content: >
      Plan startup Round Setup gate UI, state persistence, and entry
      validation before hand workflow.
    status: completed
  - id: context-role-inputs
    content: >
      Plan winner/discarder per-hand role controls and conditional visibility
      rules tied to winType.
    status: completed
  - id: result-four-player-render
    content: >
      Plan result view-model and result modal rendering for
      before/delta/after four-player settlement table.
    status: completed
  - id: master-linkage-closeout
    content: >
      Link child plan into master plan sections and define closeout checks for
      status, links, and validation evidence.
    status: completed
  - id: settlement-table-column-alignment
    content: >
      Post-closeout: result modal 四家结算改用 table+colgroup 对齐表头与数据列；
      CHANGELOG [Unreleased]; master ValidationEvidence 2026-04-03.
    status: completed
isProject: false
---

# HLM Round Setup + Four-Player Settlement Plan

## Master Plan Link

- Parent: [hlm-master-plan.plan.md](hlm-master-plan.plan.md)
- Master track id: `track-round-setup-four-player-settlement`
- This child plan path:
  `hlm_round_setup_four_player_settlement_c30c89d1.plan.md`

## Follow-on UI (separate track)

- Startup gate **table metaphor** (N/E/S/W layout + center dealer; same DOM
  ids): [hlm_round_setup_table_ui_525519a5.plan.md](hlm_round_setup_table_ui_525519a5.plan.md)
  (`track-round-setup-table-ui` on master plan).
- Settlement roles visibility + manual discarder enforcement:
  [hlm_round_settlement_roles_visible_01c13181.plan.md](hlm_round_settlement_roles_visible_01c13181.plan.md)
  (`track-round-settlement-roles-visible` on master plan).

## Goal

Introduce a startup gate where users define four players and starting scores
before hand input. Reuse this round context in every hand result to render
four-player settlement (before/delta/after) driven by existing fan outputs.

## Scope

- In scope:
  - Startup round setup (E/S/W/N seats, dealer, starting scores, names).
  - Round state persistence across hands.
  - Per-hand role inputs needed for settlement (`winnerSeat`, `discarderSeat`
    for `dianhe` only).
  - Result modal settlement block for all four players.
- Out of scope:
  - Dealer rotation policies beyond current hand.
  - Match-level penalties/bonuses not currently modeled in engine.

## Review-Fix Readiness Checklist

- Track and child links are workspace-local and resolvable.
- Implementation slices are ordered and executable with current modules.
- TDD-first sequence is explicit (tests before implementation per slice).
- Acceptance criteria are measurable in UI and tests.
- Risk items include UI/state regression and conservation invariants.
- Gate commands match project scripts and guardrails.

## Implementation Slices (TDD First)

### Slice 1: Settlement domain module

- Add pure helpers in `src/app/` for:
  - round config normalization/validation
  - role normalization (`winnerSeat`, optional `discarderSeat`)
  - delta computation for `zimo` and `dianhe` from `totalFan`
  - delta conservation assertion (`sum(delta) === 0`)
- Tests first in `tests/unit/`.

### Slice 2: Startup round setup gate

- Add startup setup section in `public/index.html`:
  - four seat rows (E/S/W/N)
  - optional player names
  - starting score inputs
  - dealer selector (default E)
  - `开始对局` CTA
- Wire validity gate in `public/app.js`, `public/appStateActions.js`,
  `public/appEventWiring.js`.

### Slice 3: Per-hand settlement role inputs

- Extend context flow to include:
  - `winnerSeat` (required)
  - `discarderSeat` (required for `dianhe`; hidden/cleared for `zimo`)
- Wire request construction in `public/resultStateActions.js`.

### Slice 4: Result settlement rendering

- Extend `src/app/resultViewModel.js` with:
  - `roundPlayersBefore`
  - `settlementDeltas`
  - `roundPlayersAfter`
  - mode/role labels
- Render new `四家结算` section in `public/resultModalView.js` and
  `public/index.html`.

### Slice 5: Regression and gates

- Add/extend tests for:
  - startup gate behavior
  - `zimo` and `dianhe` branches
  - role validation (`winnerSeat !== discarderSeat` for `dianhe`)
  - four-row result rendering
- Required gates before completion:
  - `npm run test:unit`
  - `npm run test:integration`
  - `npm run test:regression`
  - `npm test`
  - `npm run quality:complexity`
  - `cloc <touched-file>` per touched program file

## Acceptance Criteria

- User cannot enter hand workflow before valid round setup.
- Every result includes four-player settlement rows.
- `dianhe` enforces discarder role and one-payer transfer.
- `zimo` enforces three-payer transfer.
- Delta conservation holds for all result paths.
- Existing fan evaluation behavior remains compatible.

## Execution Verdict

Status: `completed`

- Startup gate now requires four-player setup before hand workflow.
- Per-hand roles (`winnerSeat` / `discarderSeat`) are wired into scoring input.
- Result modal now renders four-player settlement rows (before/delta/after).
- Settlement domain tests added and all project gates passed:
  - `npm test`
  - `npm run quality:complexity`
  - `cloc` on touched files

## Post-closeout slice (closed 2026-04-03)

- **Issue:** Header row and data rows each used separate CSS Grid; column
  widths were computed independently → misaligned headers vs numbers.
- **Fix:** Semantic `<table>` with `<colgroup>` fixed widths, `<thead>` /
  `<tbody id="resultSettlementRows">`; `renderSettlementRows` builds `tr`/`td`.
- **Files:** `public/index.html`, `public/resultModalView.js`,
  `public/styles-components.css`, `public/styles-responsive.css`;
  `CHANGELOG.md` [Unreleased] **Fixed**.
- **Gates:** `npm test`, `npm run quality:complexity`, `npm run build:dist`.
- **Master:** [hlm-master-plan.plan.md](hlm-master-plan.plan.md)
  ValidationEvidence updated; frontmatter todo
  `settlement-table-column-alignment` **completed**.
