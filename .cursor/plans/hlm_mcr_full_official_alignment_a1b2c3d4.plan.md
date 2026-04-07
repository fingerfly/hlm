---
name: hlm_mcr_full_official_alignment
overview: Drive HLM to 100% conformance with the latest official Guobiao Mahjong rules by closing fan coverage, scoring semantics, exclusion logic, and verification gaps with strict TDD.
todos:
  - id: lock-authoritative-ruleset
    content: Freeze authoritative national-standard source version and normalize machine-readable rule tables.
    status: completed
  - id: build-rule-code-trace-matrix
    content: Build complete mapping from official items to registry, detector, exclusion, and tests.
    status: completed
  - id: tdd-close-fan-coverage-gaps
    content: Add failing tests for missing/incorrect fan detection and implement until all pass.
    status: completed
  - id: tdd-close-scoring-semantic-gaps
    content: Add failing tests for gate, composite counting, and exclusion semantics; implement to match official rules.
    status: completed
  - id: enforce-official-default-mode
    content: Ensure default runtime path uses official preset semantics unless user explicitly picks compatibility mode.
    status: completed
  - id: full-gate-validation
    content: Run unit, function, integration, regression, full suite, complexity, and cloc checks; record evidence.
    status: completed
  - id: master-plan-linkage
    content: Link this child plan in hlm-master-plan.plan.md with active track, risks, and next actions.
    status: completed
isProject: false
---

# HLM MCR Full Official Alignment Plan

**Parent:** [hlm-master-plan.plan.md](hlm-master-plan.plan.md)  
**Master track id:** `track-mcr-full-official-alignment`  
**Status:** `completed` (declared scope; 2026-04-07)

## Objective

- Reach auditable 100% conformance against the latest official Guobiao
  Mahjong standard used by China sports authority rules.
- Replace inferred "coverage by count" with evidence-based rule matching.
- Keep compatibility preset available, but never let it mask official mode
  correctness.

## Scope

- In scope:
  - All official fan items and values.
  - Fan detection conditions (positive and negative boundaries).
  - Exclusion, mutual conflict, "not counted" and composite counting semantics.
  - Gate and settlement behavior under official preset.
  - Full verification matrix and release gates.
- Out of scope:
  - Non-official house rules.
  - Tournament operations outside hand scoring and settlement logic.

## Execution Slices

1. Rule-source freeze and canonical table.
2. Rule-to-code matrix with explicit gaps.
3. TDD remediation for fan detection gaps.
4. TDD remediation for scoring/exclusion semantics.
5. Official-default behavior hardening.
6. Full-gate validation and closeout.

## Rule→code trace matrix

**Canonical document:** [hlm_rule_code_trace_matrix.md](hlm_rule_code_trace_matrix.md)
(workspace `.cursor/plans/`, maintained with `RULE_BASELINE` / registry).

Contents:

- Scoring pipeline (modules and order).
- Verification test anchors (`fanCatalog.structure`, `conflictResolver`, etc.).
- `CONFLICT_GROUPS` and `compareStandardWinPrecedence` (non-`EXCLUSION_MAP`).
- Full **`EXCLUSION_MAP`** winner → excluded ids (33 keys).
- All **82** registry ids → detector category, file, feature key (when
  applicable), evidence string.
- Regeneration: `node scripts/writeRuleTraceMatrix.mjs` from `hlm/`; drift
  guarded by `tests/unit/ruleTraceMatrix.docSync.test.js`. Documented **81 vs
  82** (`rankZone` aliases vs `QUAN_*`).

## Risks and Controls

- Risk: registry count appears complete while detector coverage is partial.
  - Control: add test asserting every registry id is detectable or explicitly
    declared manual-only with approved rationale.
- Risk: exclusion map under-specifies official "not counted" semantics.
  - Control: create exclusion truth table and test each relation.
- Risk: compatibility preset leaks into default behavior.
  - Control: add integration tests for null/default config path.

## Mandatory Gates

- `npm run test:unit`
- `npm run test:integration`
- `npm run test:regression`
- `npm test`
- `npm run quality:complexity`
- `cloc <path-to-file>` for each touched program file

## Readiness Verdict

- Current verdict: `completed` (track YAML todos + full gates for delivered
  slices).
- **Deferred (by design):** merging rank-zone ids into `QUAN_*` for a 81-row
  lexicon — `fanLexiconEntries` states `SHANG_SAN_PAI` differs from
  composition 全大; revisit only with explicit product/UX spec change.

## Execution Evidence (current)

- **Rule→code trace matrix v1 (2026-04-07):** `hlm_rule_code_trace_matrix.md`
  — full registry→detector table, `EXCLUSION_MAP` snapshot, pipeline + conflict
  hooks; todo `build-rule-code-trace-matrix` closed.
- Generated initial automated gap report (`registry` vs `detector` vs exclusion
  map coverage):
  - registry ids: 82 (incl. `SI_GUI_YI` 四归一, v5.2.15)
  - detector ids: 82
  - missing detector ids: 0
  - exclusion-map keys: 33 (`exclusionMap.js`; `exclusionMap.truthTable.test.js`
    locks every key + excluded-id set)
- Added fail-first tests:
  - `tests/unit/fanCatalog.structure.test.js` now asserts every registry id
    has a detector entry.
  - `tests/unit/fanDetectors.test.js` now asserts `TUI_BU_DAO` detection on a
    valid no-turnover tile set.
- Implemented `TUI_BU_DAO` detection chain:
  - `src/rules/handFeatures.js`: added `tuiBuDao` feature predicate.
  - `src/rules/detectors/featureDetectors.js`: added detector entry.
- Added fail-first test for high-fan default detection parity:
  - `JIU_LIAN_BAO_DENG` now detected without `advancedAuto` override.
- Correction pass:
  - Tried removing all `advancedAuto` gates; this caused broad scoring drift
    against current baselines.
  - Reverted broad gate removal and narrowed change to a single validated fan
    (`JIU_LIAN_BAO_DENG`) to keep regression surface controlled.
- Added high-certainty exclusion semantics via TDD:
  - New fail-first test in `tests/unit/conflictResolver.test.js`:
    `QI_LIAN_DUI` must exclude `QI_DUI`.
  - Implemented in `src/rules/principleConstraints.js`:
    `QI_LIAN_DUI: ["QI_DUI"]`.
- Added high-certainty dragon exclusion semantics via TDD:
  - New fail-first test in `tests/unit/conflictResolver.test.js`:
    `DA_SAN_YUAN` must exclude `JIAN_KE`.
  - Implemented in `src/rules/principleConstraints.js`:
    `DA_SAN_YUAN` exclusion list now includes `JIAN_KE`.
- Added high-certainty honor-pung exclusion semantics via TDD:
  - New fail-first test in `tests/unit/conflictResolver.test.js`:
    `DA_SAN_YUAN` must exclude `YAO_JIU_KE`.
  - Implemented in `src/rules/principleConstraints.js`:
    `DA_SAN_YUAN` exclusion list now includes `YAO_JIU_KE`.
- Added high-certainty wind-superfan exclusion semantics via TDD:
  - New fail-first test in `tests/unit/conflictResolver.test.js`:
    `DA_SI_XI` must exclude `YAO_JIU_KE`.
  - Implemented in `src/rules/principleConstraints.js`:
    `DA_SI_XI` exclusion list now includes `YAO_JIU_KE`.
- Added high-certainty little-winds exclusion semantics via TDD:
  - New fail-first test in `tests/unit/conflictResolver.test.js`:
    `XIAO_SI_XI` must exclude `YAO_JIU_KE`.
  - Implemented in `src/rules/principleConstraints.js`:
    `XIAO_SI_XI` exclusion list now includes `YAO_JIU_KE`.
- Added high-certainty little-dragons exclusion semantics via TDD:
  - New fail-first test in `tests/unit/conflictResolver.test.js`:
    `XIAO_SAN_YUAN` must exclude `JIAN_KE`.
  - Implemented in `src/rules/principleConstraints.js`:
    `XIAO_SAN_YUAN` exclusion list now includes `JIAN_KE`.
- Added high-certainty little-dragons honor-pung exclusion via TDD:
  - New fail-first test in `tests/unit/conflictResolver.test.js`:
    `XIAO_SAN_YUAN` must exclude `YAO_JIU_KE`.
  - Implemented in `src/rules/principleConstraints.js`:
    `XIAO_SAN_YUAN` exclusion list now includes `YAO_JIU_KE`.
- Added high-certainty big-three-winds honor-pung exclusion via TDD:
  - New fail-first test in `tests/unit/conflictResolver.test.js`:
    `DA_SAN_FENG` must exclude `YAO_JIU_KE`.
  - Implemented in `src/rules/principleConstraints.js`:
    added `DA_SAN_FENG: ["YAO_JIU_KE"]` to `EXCLUSION_MAP`.
- Added high-certainty double-dragons exclusion via TDD:
  - New fail-first test in `tests/unit/conflictResolver.test.js`:
    `SHUANG_JIAN_KE` must exclude `JIAN_KE`.
  - Implemented in `src/rules/principleConstraints.js`:
    added `SHUANG_JIAN_KE: ["JIAN_KE"]` to `EXCLUSION_MAP`.
- Added high-certainty kong-hierarchy exclusion via TDD:
  - New fail-first test in `tests/unit/conflictResolver.test.js`:
    `SI_GANG` must exclude `SAN_GANG`.
  - Implemented in `src/rules/principleConstraints.js`:
    added `SI_GANG: ["SAN_GANG"]` to `EXCLUSION_MAP`.
- Added high-certainty double-kong exclusion via TDD:
  - New fail-first tests in `tests/unit/conflictResolver.test.js`:
    `SHUANG_AN_GANG` must exclude `AN_GANG`;
    `SHUANG_MING_GANG` must exclude `MING_GANG`.
  - Implemented in `src/rules/principleConstraints.js`:
    added `SHUANG_AN_GANG: ["AN_GANG"]` and
    `SHUANG_MING_GANG: ["MING_GANG"]` to `EXCLUSION_MAP`.
- Added high-certainty triple-kong hierarchy exclusion via TDD:
  - New fail-first test in `tests/unit/conflictResolver.test.js`:
    `SAN_GANG` must exclude `SHUANG_AN_GANG`, `SHUANG_MING_GANG`,
    `AN_GANG`, and `MING_GANG`.
  - Implemented in `src/rules/principleConstraints.js`:
    added `SAN_GANG` exclusion list for lower kong tiers.
- Gates passed after implementation:
  - `npm run test:unit`
  - `npm run test:regression`
  - `npm run test:integration`
  - `npm test`
  - `npm run quality:complexity`
- Official-default mode (2026-04-07, v5.2.6):
  - **TDD:** `buildScoringRuleSnapshot(null)` must match
    `buildScoringRuleSnapshot(MCR_Official)` (`contractAndBaseline.test.js`);
    `scoreHand` without `scoringRule` applies 8-fan gate like explicit official
    snapshot; `evaluateCapturedHand` without `ruleConfig` matches same gate.
  - **Implementation:** `scoreRuleConfig.buildScoringRuleSnapshot` delegates
    null/undefined to `getScoreRulePreset(MCR_OFFICIAL)`; `scoreAggregator`
    `DEFAULT_SNAPSHOT` aligned to official gate + `HUA_PAI` exclude +
    `officialBaseFan`.
  - **Tests:** `tests/helpers/scoringTestSnapshots.js` exports
    `COMPAT_SCORING_RULE_SNAPSHOT` for sub-8-fan structural cases; regression
    `goldenCases.json` expectations updated; mobile picker integration uses
    `gangshang` context where a win under default gate is required.
  - **cloc:** `scoreRuleConfig.js` 119 code lines (within project SLOC guardrail
    context); helper 15 code lines.
  - **Gates (this slice):** `npm test` + `npm run quality:complexity` pass.
- Exclusion truth-table expansion (2026-04-07, v5.2.7):
  - **Official → code (new rows):**
    | Winner id   | Excluded ids (registry) |
    |-------------|-------------------------|
    | `ZI_YI_SE`  | `YAO_JIU_KE`, `JIAN_KE`, `MEN_FENG_KE`, `QUAN_FENG_KE` |
    | `QING_YAO_JIU` | `YAO_JIU_KE`, `PENG_PENG_HU` |
  - **TDD:** `conflictResolver.test.js` synthetic rows; `windDragonAndHighFans`
    end-to-end 字一色+场风/圈风合计 134；`patternsAndShapes` + `goldenCases`
    清幺九合计 67。
  - **Gates:** `npm test`, `npm run quality:complexity` pass.
  - **Note:** map later split to `exclusionMap.js` (v5.2.8); cloc see slice
    below.
- High-fan exclusions + rule source freeze (2026-04-07, v5.2.8):
  - **Official → code (new rows):**
    | Winner id | Excluded ids |
    |-----------|--------------|
    | `HUN_YAO_JIU` | `PENG_PENG_HU`, `YAO_JIU_KE` |
    | `JIU_LIAN_BAO_DENG` | `QING_YI_SE`, `MEN_QIAN_QING`, `YAO_JIU_KE` |
    | `LV_YI_SE` | `QING_YI_SE`, `PENG_PENG_HU`, `DUAN_YAO`, `YI_SE_SAN_JIE_GAO`, `YI_SE_SAN_TONG_SHUN`, `YI_BAN_GAO` |
  - **New `EXCLUSION_MAP` winners:** `HUN_YAO_JIU`, `JIU_LIAN_BAO_DENG`,
    `LV_YI_SE` (see `src/rules/exclusionMap.js`).
  - **Refactor:** map extracted to `exclusionMap.js`; `principleConstraints`
    re-exports for compatibility.
  - **`RULE_SOURCE`:** `ruleBaseline.js` audit cite + `ruleBaseline.test.js`.
  - **E2E checks:** `windDragonAndHighFans` — 九莲宝灯 89 番（含自摸），绿一色 88 番。
  - **cloc:** `exclusionMap.js` 67 code lines; `principleConstraints.js` 110 code
    lines.
  - **Gates:** `npm test`, `npm run quality:complexity` pass.
- Pattern exclusions (2026-04-07, v5.2.9):
  - **Official → code:**
    | Winner id | Excluded ids |
    |-----------|--------------|
    | `SHI_SAN_YAO` | `HUN_YAO_JIU`, `MEN_QIAN_QING` |
    | `QI_DUI` | `MEN_QIAN_QING` |
  - **TDD:** `conflictResolver.test.js`; `patternsComposite`（十三幺 89 番、七对
    25 番）；`winValidator` `thirteen_orphans`。
  - **Gates:** `npm test`, `npm run quality:complexity` pass.
- Pattern exclusions follow-up (2026-04-07, v5.2.10):
  - **Extended:** `QI_DUI` adds `DUAN_YAO`, `WU_ZI`, `DAN_DIAO_JIANG`；
    `SHI_SAN_YAO` adds `DAN_DIAO_JIANG`。
  - **TDD:** `conflictResolver.test.js`；`patternsComposite`（`waitType=single`、
    全带幺七对）。
  - **Gates:** `npm test`, `npm run quality:complexity` pass.
- Pattern priority + 双龙会套算 (2026-04-07, v5.2.11):
  - **Engine:** `seven_pairs` 与全部标准分解候选同台择优；`winPattern` 反映
    中选分解（`scoringEngine.js`、`scoringCandidate.js`）。
  - **`YI_SE_SHUANG_LONG_HUI` 不计：** `QING_YI_SE`, `PING_HU`, `YI_BAN_GAO`,
    `LIAN_LIU`, `LAO_SHAO_FU`。
  - **TDD:** `patternsComposite` 双龙会 64 番；`conflictResolver` 合成用例。
  - **Gates:** `npm test`, `npm run quality:complexity` pass.
- 三色双龙会套算 (2026-04-07, v5.2.12):
  - **`SAN_SE_SHUANG_LONG_HUI` 不计：** `PING_HU`, `XI_XIANG_FENG`,
    `LIAN_LIU`, `LAO_SHAO_FU`, `HUA_LONG`, `YI_BAN_GAO`。
  - **TDD:** `patternsComposite`（三色双龙会合计 16 番）；`conflictResolver`
    合成用例。
  - **cloc:** `exclusionMap.js` 93 code lines.
  - **Gates:** `npm test`, `npm run quality:complexity` pass.
- 一色三节高 vs 一色三同顺 (2026-04-07, v5.2.13):
  - **`YI_SE_SAN_JIE_GAO` 不计：** `YI_SE_SAN_TONG_SHUN`；候选排序在总番
    相同方向下优先三节高分解（与「三同顺」互斥 multiset）。
  - **TDD:** `patternsComposite`、`conflictResolver`。
  - **cloc:** `scoringEngine.js` 98 code lines; `scoringCandidate.js` 26.
  - **Gates:** `npm test`, `npm run quality:complexity` pass.
- 一色四同顺套算 + 分解优先 (2026-04-07, v5.2.14):
  - **`YI_SE_SI_TONG_SHUN` 不计：** `YI_SE_SAN_JIE_GAO`, `YI_SE_SAN_TONG_SHUN`,
    `YI_BAN_GAO`；`compareStandardWinPrecedence` 使四同顺分解优先于三节刻分解。
  - **TDD:** `patternsComposite`（四副 123 万 + 将 86 番）；`conflictResolver`。
  - **cloc:** `exclusionMap.js` 99 code lines; `scoringCandidate.js` 33.
  - **Gates:** `npm test`, `npm run quality:complexity` pass.
- 四归一 + 四同顺套算补全 (2026-04-07, v5.2.15):
  - **Registry / detector:** `SI_GUI_YI`（2 番）；`handFeatures.detectSiGuiYi`
    （顺/刻/将；杠面子类型 `kong` 预留排除）。
  - **`YI_SE_SI_TONG_SHUN` 不计** 增列 `SI_GUI_YI`。
  - **Baseline:** `RULE_SOURCE.registryFanCount` / `MCR_TARGET_FAN_COUNT` → 82。
  - **TDD:** `fanDetectors`, `patternsComposite`（清一色梯子 + 四归一 30 番）、
    `conflictResolver`、`fanRegistry`、`ruleBaseline`。
  - **Gates:** `npm test`, `npm run quality:complexity` pass.
- Matrix doc automation + trace plan closeout (2026-04-07):
  - **`tests/unit/ruleTraceMatrix.docSync.test.js`** +
    **`scripts/writeRuleTraceMatrix.mjs`** keep
    `hlm_rule_code_trace_matrix.md` aligned with `FAN_CATALOG` /
    `EXCLUSION_MAP`.
  - Child shell: [hlm_rule_code_trace_matrix.plan.md](hlm_rule_code_trace_matrix.plan.md)
    (**completed**).
  - **Gates:** `npm test`, `npm run quality:complexity` pass.
