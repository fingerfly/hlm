# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [2.0.1] - 2026-03-12

## [2.0.0] - 2026-03-12

### Added
- Added structured source-comment coverage test for modular stylesheet links in `index.html` (`tests/unit/indexStylesheetLinks.test.js`).
- Added recognition-normalization helper module to split confirmation-map and tile-code derivation logic (`src/app/recognitionHelpers.js`).
- Added tile catalog module to centralize canonical tile constants, aliases, labels, and lookup maps (`src/spike/vlm/tileCatalog.js`).
- Added tile encoding module to isolate tile-id and uncertain-mask encode/decode helpers (`src/spike/vlm/tileEncoding.js`).
- Added dedicated unit tests for recognition-normalization behavior (`tests/unit/recognitionNormalizer.test.js`).
- Added modular public stylesheet files (`public/styles-base.css`, `public/styles-components.css`, `public/styles-modals.css`, `public/styles-responsive.css`).

### Changed
- Applied Goja-aligned commenting rules across HLM source/public files: module `Purpose`/`Description` headers, function JSDoc for non-trivial logic, and concise rationale comments in HTML/CSS.
- Refactored recognition normalization flow into smaller cooperating helpers while preserving behavior (`src/app/recognitionNormalizer.js`).
- Refactored tile-code utilities into catalog/encoding cooperation while keeping `tileCodes` API compatibility (`src/spike/vlm/tileCodes.js`).
- Updated `index.html` to load split CSS modules in deterministic order and removed the previous monolithic stylesheet (`public/index.html`, removed `public/styles.css`).

### Validation
- Verified static guardrails after each refactor pass with `npm run quality:complexity`.
- Verified full test matrix passes (`npm test`: unit + spike + regression + integration).
- Verified per-file SLOC reductions with `cloc --by-file`, including `src/app/recognitionNormalizer.js` and `src/spike/vlm/tileCodes.js` now below 100 code lines.


## [1.2.0] - 2026-03-10

### Added
- Added deploy workflow utility module with pure functions for release-token normalization, changelog archiving, and app-version parsing/updating (`src/config/deployWorkflow.js`).
- Added deploy prompt constants module to centralize embedded changelog/agent templates and CLI usage text (`src/config/deployPrompts.js`).
- Added deploy runtime helper module to isolate process execution and interactive input handling (`scripts/deployRuntime.js`).
- Added deploy orchestration helper module to split prompt handling, mode resolution, mode assertion, and release-state writes (`scripts/deployHandlers.js`).
- Added reusable deploy sandbox helper for unit tests (`tests/helpers/deploySandbox.js`).
- Added split deploy CLI test suites for prompt output and release flow (`tests/unit/deployCli.prompts.test.js`, `tests/unit/deployCli.release.core.test.js`, `tests/unit/deployCli.release.bump.test.js`).
- Added unit tests for deploy workflow pure functions (`tests/unit/deployWorkflow.test.js`).

### Changed
- Refactored deploy entry script into thin orchestration with delegated modules, reducing single-file size and mixed responsibilities (`scripts/deploy.js`).
- Updated app version baseline test expectation to current runtime version `1.1.1` (`tests/unit/appVersion.test.js`).
- Replaced monolithic deploy CLI test file with modular test structure while preserving coverage (`tests/unit/deployCli.test.js` -> split files above).


## [1.1.1] - 2026-03-10

### Added
- Added regression test to ensure changelog release archiving works for `CRLF` files (`tests/unit/deployCli.test.js`).

### Changed
- Fixed deploy changelog archiving logic to normalize line endings before parsing, so released changes are moved correctly from `[Unreleased]` (`scripts/deploy.js`).
- Synced app version baseline test with current runtime `1.1.0` (`tests/unit/appVersion.test.js`).

## [1.1.0] - 2026-03-10

### Added
- Added deploy CLI prompt-template modes for AI-assisted changelog workflow: `prompt-update` and `prompt-release` (`scripts/deploy.js`).
- Added unit tests for embedded prompt-template output modes (`tests/unit/deployCli.test.js`).
- Added `prompt-all` mode to print both changelog prompt templates in a single output (`scripts/deploy.js`).
- Added agent-pipeline prompt modes to print Cursor Agent command lines: `prompt-update-agent` and `prompt-release-agent` (`scripts/deploy.js`).
- Added deploy safety-gate tests that verify no file mutation happens without explicit `--confirm` (`tests/unit/deployCli.test.js`).
- Added intuitive npm shortcut commands for release flow and prompt workflow (`package.json`).
- Added single-entry interactive release command `npm run release` with mode selection and explicit `yes` confirmation (`scripts/deploy.js`, `package.json`).
- Added numeric release shortcuts (`1/2/3/4`) support for interactive and inline release entry (`scripts/deploy.js`).

### Changed
- Expanded deploy invalid-usage help text to include prompt-template modes (`scripts/deploy.js`).
- Updated app version baseline test to match current `1.0.0` runtime (`tests/unit/appVersion.test.js`).
- Changed deploy release/build flow to run `npm test` before mutation and require `--confirm` for write actions (`scripts/deploy.js`).
- Documented shortcut commands in README to reduce memory burden and improve day-to-day usability (`README.md`).
- Extended deploy CLI tests to cover interactive release flow (`tests/unit/deployCli.test.js`).
- Updated README examples to include numeric release shortcuts for simpler daily usage (`README.md`).
## [1.0.0] - 2026-03-10

### Added
- Added deploy CLI integration tests in sandbox mode to validate end-to-end behavior without mutating workspace files (`tests/unit/deployCli.test.js`).
- Added deploy CLI coverage for all core modes: invalid mode usage, `build`, `patch`, `minor`, and `major` output/state transitions (`tests/unit/deployCli.test.js`).
- Added deploy summary formatter to produce concise Chinese CLI output for version upgrades (`src/config/versioning.js`).

### Changed
- Standardized deploy command usage text to `npm run deploy -- major|minor|patch|build` across CLI and docs (`scripts/deploy.js`, `README.md`).
- Improved semver input validation to reject malformed versions before upgrade execution (`src/config/versioning.js`).
- Switched deploy success output from JSON blob to Chinese summary lines for readability (`scripts/deploy.js`).
- Updated UI Chinese terminology in user-facing text to use standardized wording and full event names (`public/index.html`, `public/app.js`).
- Synced app version baseline unit test expectations with the runtime version used in this release cycle (`tests/unit/appVersion.test.js`).


## [0.4.0] - 2026-03-09

### Added
- Added manual tile input normalization/validation module (`src/app/manualTileInput.js`) with 14-slot strict checks, canonical code normalization, and slot-level error reporting.
- Added unit tests for manual tile input helpers (`tests/unit/manualTileInput.test.js`).
- Added result view-model mapping module (`src/app/resultViewModel.js`) to convert internal status/winPattern/fan IDs into Chinese UI labels.
- Added dedicated UI result renderer module (`src/app/resultRenderer.js`) to render structured result cards and collapsible debug details.
- Added unit tests for result view-model mapping behavior (`tests/unit/resultViewModel.test.js`).

### Changed
- Replaced app-layer evaluation primary path to manual-first input (`tiles + context`) in `src/app/evaluateCapturedHand.js`, including deterministic statuses (`manual_ready`, `manual_invalid`) and direct scoring boundary behavior.
- Rebuilt public demo UI to manual-grid-only workflow with 14 tile slots, 4 context selectors, explicit error panel, and deterministic result rendering (`public/index.html`, `public/app.js`, `public/styles.css`).
- Updated integration tests for manual boundary and deterministic behavior (`tests/integration/evaluateCapturedHand.test.js`, `tests/integration/stability.test.js`).
- Updated README scope/demo description to manual-first usage as the primary user path.
- Lowered Guobiao minimum winning fan gate from `8` to `1` in `src/config/ruleBaseline.js` so valid winning hands with at least one fan are treated as wins.
- Updated scoring baseline tests and regression fixtures to reflect the new minimum-fan behavior (`tests/unit/ruleBaseline.test.js`, `tests/unit/scoringEngine.test.js`, `tests/regression/goldenCases.json`, `tests/integration/evaluateCapturedHand.test.js`).
- Synced app version baseline expectations in `tests/unit/appVersion.test.js` with the current `0.3.0` runtime version.
- Replaced plain-text/JSON-first result output with structured UI sections (status badge, summary cards, fan lists, explanation, collapsible JSON debug) in `public/index.html`, `public/app.js`, and `public/styles.css`.
- Localized context selector labels/options to Chinese display text while keeping internal enum values unchanged for scoring compatibility.

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
