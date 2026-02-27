# Changelog

All notable changes to this project will be documented in this file.

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
