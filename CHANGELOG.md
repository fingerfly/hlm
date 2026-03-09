# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-03-09

### Added
- Added manual tile input normalization/validation module (`src/app/manualTileInput.js`) with 14-slot strict checks, canonical code normalization, and slot-level error reporting.
- Added unit tests for manual tile input helpers (`tests/unit/manualTileInput.test.js`).

### Changed
- Replaced app-layer evaluation primary path to manual-first input (`tiles + context`) in `src/app/evaluateCapturedHand.js`, including deterministic statuses (`manual_ready`, `manual_invalid`) and direct scoring boundary behavior.
- Rebuilt public demo UI to manual-grid-only workflow with 14 tile slots, 4 context selectors, explicit error panel, and deterministic result rendering (`public/index.html`, `public/app.js`, `public/styles.css`).
- Updated integration tests for manual boundary and deterministic behavior (`tests/integration/evaluateCapturedHand.test.js`, `tests/integration/stability.test.js`).
- Updated README scope/demo description to manual-first usage as the primary user path.
- Lowered Guobiao minimum winning fan gate from `8` to `1` in `src/config/ruleBaseline.js` so valid winning hands with at least one fan are treated as wins.
- Updated scoring baseline tests and regression fixtures to reflect the new minimum-fan behavior (`tests/unit/ruleBaseline.test.js`, `tests/unit/scoringEngine.test.js`, `tests/regression/goldenCases.json`, `tests/integration/evaluateCapturedHand.test.js`).
- Synced app version baseline expectations in `tests/unit/appVersion.test.js` with the current `0.3.0` runtime version.

## [0.2.0] - 2026-02-27

### Added
- Added `npm run spike:repeat` to execute repeated spike trials (`spike:auto` + `spike:fill-eval`) and emit cross-run statistics.
- Added repeat-trial metrics utilities (`computeEvalMetricsFromCsvText`, `summarizeTrials`) for mean/std/min/max aggregation across runs.
- Added spike tests for repeat-trial metric extraction and statistical aggregation behavior.
- Added repeat-run reporting output (`repeat_stats*.json`) support for controlled single-variable A/B tuning workflows.

### Changed
- Added promotion-gate evaluation workflow for spike tuning: `avgTileSet >= 0.35`, `avgTbRecall >= 0.30`, and `apiFailRate = 0`.
- Ran controlled A/B tuning on `VLM_VOTE_PASSES` (`1` vs `3`) and recorded decision criteria from repeated-trial metrics.
- Kept `VLM_VOTE_PASSES=1` as the current baseline after quick `VLM_VOTE_PASSES=3` validation showed unstable API success in this environment.

## [0.1.0] - 2026-02-27

### Added
- Established product naming baseline for `胡了么 - 国标麻将计番助手` / `Huleme - Guobiao Mahjong Fan Calculator`.
- Implemented rule baseline and data contract enforcement with `NEED_CONTEXT` handling.
- Added core scoring pipeline (`WinValidator`, `FanDetectors`, `ConflictResolver`, `ScoreAggregator`).
- Added vision V1 flow with multi-frame fusion, confidence gate, and human-confirm fallback.
- Added end-to-end evaluation flow with explanation output and replay log payload.
- Added unit, regression, and integration test suites plus a performance smoke script.
- Added deploy version workflow: `npm run deploy -- build|patch|minor|major`.
- Added DeepSeek VLM spike modules, standalone CLI entry, and spike-specific tests.
- Added first 10-sample capture checklist and CSV evaluation template for spike validation.
- Added batch spike runner (`npm run spike:batch`) to process image folders and emit JSON results with summary stats.
- Added `npm run spike:fill-eval` to auto-fill evaluation CSV key columns from spike result JSON files.
- Added `npm run spike:summary` to generate `tests/spike/results/summary.json` plus console metrics.
- Added `npm run spike:auto` one-command orchestrator (`batch -> fill-eval -> summary`) with upfront credential/provider checks.
- Enhanced step scripts with optional path parameters, default result cleanup for `spike:batch`, and `--keep-old` override.
- Scoped summary statistics to sample IDs from the current image directory rather than all historical JSON files.
