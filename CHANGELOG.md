# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-02-27

### Added
- Established product naming baseline for `胡了么 - 国标麻将计番助手` / `Huleme - Guobiao Mahjong Fan Calculator`.
- Implemented rule baseline and data contract enforcement with `NEED_CONTEXT` handling.
- Added core scoring pipeline (`WinValidator`, `FanDetectors`, `ConflictResolver`, `ScoreAggregator`).
- Added vision V1 flow with multi-frame fusion, confidence gate, and human-confirm fallback.
- Added end-to-end evaluation flow with explanation output and replay log payload.
- Added unit, regression, and integration test suites plus a performance smoke script.
- Added deploy version workflow: `npm run deploy -- build|patch|minor|major`.
