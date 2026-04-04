---
name: hlm_mcr_p0_alignment
overview: Align HLM scoring with core Chinese Official (sports authority) settlement semantics in a minimal, low-risk P0 phase. Focus on 8-point gate, flower exclusion from gate, and official base+fan settlement formulas while preserving existing architecture.
todos:
  - id: tdd-gate-tests
    content: Add failing tests for 8-point gate and flower-excluded gate eligibility
    status: completed
  - id: tdd-settlement-tests
    content: Add failing tests for official zimo/dianhe base+fan payouts and compat non-regression
    status: completed
  - id: impl-gate-logic
    content: Implement official gate semantics in baseline/aggregator flow
    status: completed
  - id: impl-settlement-formula
    content: Implement preset-aware official settlement formula in roundSettlement
    status: completed
  - id: validate-full-suite
    content: >
      npm test (unit/regression/integration/full) + npm run quality:complexity
      + cloc on touched files; all passing before closeout
    status: completed
  - id: master-plan-linkage
    content: >
      Linked from [hlm-master-plan.plan.md](hlm-master-plan.plan.md) as
      track-mcr-p0-official-alignment; canonical file under hlm/.cursor/plans/.
    status: completed
  - id: plan-review-fix
    content: >
      Review-fix: locked gate/settlement semantics, threading contract,
      numeric anchors, expanded file list, readiness checklist (ready_to_execute).
    status: completed
isProject: false
---

# HLM MCR P0 Alignment Plan

**Parent:** [hlm-master-plan.plan.md](hlm-master-plan.plan.md)  
**Master track id:** `track-mcr-p0-official-alignment`  
**Prerequisite (completed):** [hlm_score_config_mcr_presets_620b275b.plan.md](hlm_score_config_mcr_presets_620b275b.plan.md)

## Goal

Bring `国标预设` behavior in line with core official competition semantics
without a large refactor:

- 8-point minimum winning gate
- flowers excluded from gate check
- settlement uses base+fan formula for zimo/dianhe

## Scope (P0 only)

- In scope:
  - Winning threshold and gate logic.
  - Round settlement formula for `MCR_Official` preset.
  - Tests (unit + regression + integration runs).
- Out of scope (defer):
  - Full foul/penalty workflow (`错和` / `诈和`) state machine.
  - Tournament-level scoring/ranking workflow.

## Locked design decisions (P0)

- **起和分 vs 基本分（花牌）**  
  - **起和门槛**：用「番种分之和 **减去** `HUA_PAI` 动态花牌分」与 `gateMinFan`
    比较（floor 0）。  
  - **结算基本分**：支付仍用**完整** `totalFan`（含花牌），与《中国麻将竞赛规则》
    「花牌分不计在起和分内」一致：花牌不能帮起和，但和牌后仍计入盘分。

- **不得改坏 Current_Compat**  
  - **禁止**把 `RULE_BASELINE.minWinningFan` 全局改为 8（会破坏兼容预设与既有测试
    语义）。  
  - 起和门槛必须**随当前 `scoreRuleConfig`（或等价 preset 模式）**变化。

- **评分管线必须知道当前规则**  
  - 现状：`evaluateCapturedHand(request)` 不接收桌面条目选的预设；`calculate()` 只把
    `ruleConfig` 交给 `computeRoundSettlement`。  
  - P0 必须：`calculate()` 将**可序列化的小对象**（由 `scoreRuleConfig` 映射而来）
    并入 `request`，经 `evaluateCapturedHand` → `scoreHand`，用于 gate 与（若需要）
    explainer；字段名与校验在 `handState` 契约中白名单化。

- **Custom 预设**  
  - 校验通过的自定义 JSON 遵循其 `scoreRuleConfig`：若自官方预设克隆，应保留
    official 结算模式字段；无效则仍回退 `Current_Compat`（已有行为）。

## Config contract extension (minimal)

- 在 [src/config/scoreRuleConfig.js](src/config/scoreRuleConfig.js) 为两内置预设补齐
  **显式**字段（示例命名，实现时可微调但需在计划中写回最终名）：
  - `scoring.gateMinFan`（number；`MCR_Official` = 8，`Current_Compat` = 1）
  - `scoring.gateExcludeFanIds`（string[]；官方为 `["HUA_PAI"]`，兼容为 `[]`）
  - `settlement.mode`：`compatLinear` | `officialBaseFan`
  - `settlement.officialBasePoint`：number（默认 8；仅 official 模式读取）
- [src/contracts/scoreRuleConfigValidator.js](src/contracts/scoreRuleConfigValidator.js)
  校验上述字段；缺省时对 **Current_Compat** 推断为当前行为，避免破坏已持久化的
  custom JSON。

## Worked examples (deterministic test anchors)

以下 `totalFan` 均指引擎汇总的**完整**番数（含花牌）。`gateFan = totalFan -
flowerFan`。

| Case | gateFan | totalFan | Win? | Zimo 支付（每家输家） | 点和支付 |
| --- | --- | --- | --- | --- | --- |
| A 未起和 | 7 | 7 | 否 | — | — |
| B 花牌凑不满 | 1 | 3（非花 1 + 花牌 2） | 否 | — | — |
| C 起和+自摸 | 8 | 8 | 是 | 每人 `8+8=16`，赢家 +48 | — |
| D 起和+点和 | 8 | 8 | 是 | — | 点炮者 `-(8+8)`，另两家各 `-8`，赢家 `+32` |

实现时用整数断言；守恒 `sumDelta === 0` 必过。

## Files to update

- Baseline gate metadata:
  - [src/config/ruleBaseline.js](src/config/ruleBaseline.js)（注释/版本说明；避免误用全局
    gate）
- Orchestration:
  - [src/app/evaluateCapturedHand.js](src/app/evaluateCapturedHand.js) — 转发规则快照至
    `scoreHand`
- Score aggregation gate logic:
  - [src/rules/scoreAggregator.js](src/rules/scoreAggregator.js)
  - (if needed) [src/rules/scoringEngine.js](src/rules/scoringEngine.js)
- Rule preset metadata/flags:
  - [src/config/scoreRuleConfig.js](src/config/scoreRuleConfig.js)
  - [src/contracts/scoreRuleConfigValidator.js](src/contracts/scoreRuleConfigValidator.js)
- Settlement implementation:
  - [src/app/roundSettlement.js](src/app/roundSettlement.js)
  - [src/app/officialBaseFanSettlement.js](src/app/officialBaseFanSettlement.js)
- Tests:
  - [tests/unit/scoringEngine/contractAndBaseline.test.js](tests/unit/scoringEngine/contractAndBaseline.test.js)
  - [tests/unit/roundSettlement.test.js](tests/unit/roundSettlement.test.js)
  - [tests/integration/evaluateCapturedHand.test.js](tests/integration/evaluateCapturedHand.test.js)
  - [tests/unit/scoreRuleConfigValidator.test.js](tests/unit/scoreRuleConfigValidator.test.js)
  - add/adjust nearby focused tests under `tests/unit/scoringEngine/` if needed
- UI / wiring:
  - [public/resultStateActions.js](public/resultStateActions.js) — 传入评分规则快照
  - （可选 P0）[public/resultModalView.js](public/resultModalView.js) — 仅当零成本可展示
    「起和番（不含花）」；否则记入 follow-up
- Contracts:
  - [src/contracts/handState.js](src/contracts/handState.js) — 可选 gate 字段白名单校验
- Product notes:
  - [CHANGELOG.md](CHANGELOG.md) — 用户可见行为变更（国标预设）用当日日期
- 文案（若需）:
  - [src/llm/explainer.js](src/llm/explainer.js) — 避免硬编码与 `gateMinFan` 矛盾

## Implementation approach

1. **Config first（TDD）**  
   - 扩展 `scoreRuleConfig` + validator + 预设默认值；先写 validator / preset
     结构单测。

2. **Gate（评分）**  
   - `aggregateScore` 或等价单一入口：在 **已知** `matchedFans` 上计算 `totalFan`、
     `gateFan`、`flowerFan`；`isWin = gateFan >= gateMinFan`。  
   - **禁止**仅改全局 `RULE_BASELINE.minWinningFan` 代替预设逻辑。

3. **Threading**  
   - `buildScoringRuleSnapshot(ruleConfig)`（小纯函数）由 `calculate()` 注入
     `request`。  
   - `scoreHand` 读取快照；缺省快照时行为等于 **Current_Compat**（回归安全）。

4. **Settlement**  
   - `settlement.mode === officialBaseFan`：`basicFan = totalFan`（**含花**），
     `basePoint` 来自 config；  
     - 自摸：三家各付 `basePoint + basicFan`，赢家 `+3*(basePoint+basicFan)`。  
     - 点和：点炮者 `-(basePoint+basicFan)`，另两家各 `-basePoint`，赢家收支守恒。  
   - `compatLinear`：保持现有 `fanToPoint` × multiplier 路径。

5. **Custom / 回退**  
   - 无效 custom 仍回退 `Current_Compat`；回退后的 gate 与结算与兼容预设一致。

## TDD sequence

1. Write/adjust failing tests for:
   - 8-point gate.
   - flower exclusion from gate.
   - official zimo and dianhe payout examples.
2. Implement smallest code changes to pass tests.
3. Run full test matrix:
   - `npm run test:unit`
   - `npm run test:regression`
   - `npm run test:integration`
   - `npm test`
4. `npm run quality:complexity`
5. Run `cloc` on touched program files and keep files/functions within
   guardrails where practical.

## Validation and acceptance criteria

- A hand below official gate fails win gate even if structurally winning.
- Flower points do not help satisfy the 8-point gate.
- For `MCR_Official`, settlement matches official base+fan payment structure.
- For `Current_Compat`, existing settlement behavior remains unchanged.
- All test suites pass (unit/regression/integration/full).
- `npm run quality:complexity` pass；触及的 `.js` 文件有 `cloc` 记录备查。

## Risk controls

- Use preset-specific branching (not global behavior change) to prevent
  compatibility breakage.
- Keep data contract backward-compatible; default missing config fields
  safely.
- Add deterministic tests for both presets to prevent future drift.

## Execution readiness verdict

**Status: `completed`（2026-04-03）**

- [x] 依赖轨道 `track-score-config-mcr-presets` 已完成。
- [x] 实现：`scoring` / `settlement` 配置、`buildScoringRuleSnapshot`、
  `aggregateScore` 花牌排除起和、`scoreHand` 优先满足起和的分解、
  `officialBaseFanSettlement`、`roundSettlement` 分支、`evaluateCapturedHand` /
  `resultStateActions` 穿线、`handState` 可选 `scoringRule` 校验。
- [x] 版本 **5.1.0**；`CHANGELOG.md` 已记。
- [x] 门禁：`npm test`、`npm run quality:complexity` 通过；`cloc` 已跑（
  `roundSettlement.js` 仍 >100 SLOC，已拆出 `officialBaseFanSettlement.js`）。

**最终字段名（实现）**：`scoring.gateMinFan`、`scoring.gateExcludeFanIds`、
`settlement.mode`（`compatLinear` | `officialBaseFan`）、
`settlement.officialBasePoint`；`SETTLEMENT_MODES` 常量导出自
`scoreRuleConfig.js`。

## Post-implementation UX (closed 2026-04-03)

- 结果弹窗「四家结算」表头与分数列对齐修复已记入
  [hlm_round_setup_four_player_settlement_c30c89d1.plan.md](hlm_round_setup_four_player_settlement_c30c89d1.plan.md)
  **Post-closeout slice** 与主计划 ValidationEvidence（非本计划范围新轨道，
  仅追溯）。
