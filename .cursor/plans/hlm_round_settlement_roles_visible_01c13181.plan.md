---
name: hlm_round_settlement_roles_visible
overview: |
  Enforce manual discarder selection for dianhe, expose winner/discarder
  role controls across mobile and desktop, and surface settlement validation
  failures so four-player rows are not silently all zero.
todos:
  - id: child-plan-create-link
    content: >
      Canonical child plan file exists in workspace
      hlm/.cursor/plans/hlm_round_settlement_roles_visible_01c13181.plan.md
      and is linked by master plan track id.
    status: completed
  - id: tdd-role-validation
    content: >
      Add failing-first tests for dianhe manual discarder requirement and
      blocked calculate path when role inputs are invalid.
    status: completed
  - id: ui-role-controls-mobile-desktop
    content: >
      Ensure winner/discarder controls are operable on both mobile and
      desktop and synchronized to canonical request fields.
    status: completed
  - id: enforce-manual-discarder
    content: >
      Keep discarder empty until user selects in dianhe; no auto-fill;
      invalid role selection blocks calculate with explicit feedback.
    status: completed
  - id: result-settlement-error-feedback
    content: >
      Render settlement.problems in result area and distinguish invalid-role
      no-calc from legitimate zero deltas.
    status: completed
  - id: master-plan-track-update
    content: >
      Master plan frontmatter/index/dashboard and evidence are aligned to this
      child track with executable pending state.
    status: completed
isProject: false
---

# HLM 点和放铳者强制手选计划

## Master Plan Link

- Parent: [hlm-master-plan.plan.md](hlm-master-plan.plan.md)
- Master track id: `track-round-settlement-roles-visible`
- This child plan file:
  `hlm_round_settlement_roles_visible_01c13181.plan.md`
- Depends on (completed):
  [hlm_round_setup_four_player_settlement_c30c89d1.plan.md](hlm_round_setup_four_player_settlement_c30c89d1.plan.md)
- Related UI baseline (completed):
  [hlm_round_setup_table_ui_525519a5.plan.md](hlm_round_setup_table_ui_525519a5.plan.md)

## Goal

- 点和（`dianhe`）必须人工选择放铳者；未选时不可计算。
- 修复“结果已和牌但四家结算静默全 0”的误导体验。
- 在移动端与桌面端都可完成和牌者/放铳者设置。

## Current Root Cause

- `computeRoundSettlement` 仅在 `problems.length === 0` 时写入 `deltas`，否则
  行数据保持 0（见 [src/app/roundSettlement.js](../../src/app/roundSettlement.js)）。
- `buildRequestFromState()` 直接读取 `winnerSeat` / `discarderSeat`，若
  `discarderSeat` 为空会让点和结算无效（见
  [public/resultStateActions.js](../../public/resultStateActions.js)）。
- `syncDiscarderVisibility()` 在非点和清空放铳者，切回点和后未强制二次选择（见
  [public/app.js](../../public/app.js)）。
- 结果视图未渲染 `settlement.problems`（见
  [public/resultModalView.js](../../public/resultModalView.js)）。

## Design Decision (Locked)

- `dianhe` 强制手动选放铳者。
- 不做自动默认放铳者。
- 未选或非法（含同和牌者）即阻断计算并给出明确提示。

## TDD-First Slices

### Slice 1: Role validation contract

- Tests first in `tests/unit/`:
  - dianhe + empty discarder => blocked calculate.
  - dianhe + discarder == winner => blocked calculate.
  - zimo => no discarder requirement.
- Add/extend pure validator near settlement/request action boundary.

### Slice 2: Mobile/Desktop role controls parity

- Update [public/index.html](../../public/index.html):
  - Add mobile-visible role inputs with clear labels.
  - Keep canonical `winnerSeat` / `discarderSeat` source-of-truth.
- Update [public/styles-modals.css](../../public/styles-modals.css) and
  [public/styles-responsive.css](../../public/styles-responsive.css).

### Slice 3: Enforce manual selection flow

- Update [public/app.js](../../public/app.js) and
  [public/contextWiring.js](../../public/contextWiring.js):
  - Entering dianhe leaves discarder empty and visibly required.
  - calculate path short-circuits with message if invalid.

### Slice 4: Result feedback

- Update [public/resultModalView.js](../../public/resultModalView.js):
  - Show settlement validation message from `settlement.problems`.
  - Distinguish invalid-role no-calc from valid zero-delta scenario.

### Slice 5: Regression and gates

- Unit + integration additions under `tests/`.
- Gate commands:
  - `npm test`
  - `npm run quality:complexity`
  - `cloc <touched-files>`

## Acceptance Criteria

- 点和未选放铳者时，无法进入有效结算并看到明确提示。
- 点和正确选择后，四家增减按规则计算，不再静默全 0。
- 移动端/桌面端都可设置和牌者与放铳者。
- 全测试、复杂度、SLOC 检查通过。

## Implementation Status

- Completed 2026-04-03:
  - `public/resultStateActions.js`: pre-calc role validation blocks dianhe
    when discarder is missing or equals winner, with explicit message.
  - `public/app.js`: `syncDiscarderVisibility` disables discarder for zimo and
    sets required for dianhe.
  - `public/index.html` + `public/styles-modals.css`: added role validation
    message container and style.
  - Tests: `tests/unit/resultStateActions.test.js` plus updated
    `tests/unit/indexStylesheetLinks.test.js`.
  - Gates passed: `npm test`, `npm run quality:complexity`, `cloc`.
