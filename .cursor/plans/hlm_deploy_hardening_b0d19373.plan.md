---
name: hlm deploy hardening
overview: Implement all requested deploy-safety guardrails for HLM using TDD, including doctor/dry-run modes, protocol mismatch warnings, improved auth diagnostics, and cross-platform CI coverage.
todos:
  - id: tdd-new-behaviors
    content: Add failing unit tests for doctor mode, dry-run mode, mismatch warnings, and auth-specific preflight hints.
    status: completed
  - id: runtime-helpers
    content: Add deploy remote helper functions for transport detection, mismatch analysis, and protocol-specific hint generation.
    status: completed
  - id: doctor-mode
    content: Implement deploy doctor command path with non-mutating diagnostics output.
    status: completed
  - id: dry-run
    content: Implement --dry-run release behavior that computes and reports planned changes without writing or pushing.
    status: completed
  - id: usage-docs
    content: Update deploy usage text, npm scripts, runbook docs, and changelog entries for new safety commands/flags.
    status: completed
  - id: ci-matrix
    content: Add cross-platform CI matrix for deploy-focused test suites on Ubuntu/macOS/Windows.
    status: completed
  - id: full-validation
    content: Run targeted deploy tests, full npm test, lint checks, and cloc verification before final report.
    status: completed
isProject: false
---

# HLM Deploy Safety Hardening Plan

## Goal

Harden `hlm` release/deploy flow against cross-platform/auth regressions by implementing all five safeguards you approved.

## Completion Snapshot

- Status: `completed`
- CompletionDate: `2026-03-18`
- Delivered:
  - `release:doctor` command for non-mutating diagnostics.
  - `--dry-run` release path (no file writes and no push).
  - protocol mismatch warning and auth-aware preflight hints.
  - deploy safety matrix CI workflow for Linux/macOS/Windows.
  - docs updates in runbook, README, and changelog.
- Validation:
  - deploy-focused unit suites passed.
  - full `npm test` passed.
  - lints for changed files passed.
  - `cloc` check executed for touched deploy/test files.

## Master Plan Link

- Parent plan:
[hlm-master-plan.plan.md](hlm-master-plan.plan.md)

## Scope

- Add non-mutating deploy health check command (`release:doctor`).
- Add `--dry-run` release path to preview actions without file mutation/push.
- Add protocol mismatch warning when detected origin transport and deploy remote differ.
- Improve remote preflight error diagnostics with transport-specific remediation.
- Add CI matrix to run deploy-focused tests on Linux/macOS/Windows.

## Implementation Steps

1. **TDD first: add failing tests for new behavior**
  - Extend deploy CLI tests in [tests/unit/deployCli.release.core.test.js](02product/01_coding/project/hlm/tests/unit/deployCli.release.core.test.js) and [tests/unit/deployCli.prompts.test.js](02product/01_coding/project/hlm/tests/unit/deployCli.prompts.test.js) for:
    - `doctor` mode output and non-mutating behavior.
    - `--dry-run` keeping `package.json` and `src/config/appVersion.js` unchanged.
    - mismatch warning text visibility.
    - improved preflight diagnostic content for SSH vs HTTPS failures.
  - Add runtime unit tests in [tests/unit/deployRuntime.test.js](02product/01_coding/project/hlm/tests/unit/deployRuntime.test.js) for transport mismatch detection and diagnostic message branching.
2. **Add deploy runtime primitives**
  - Update [scripts/deployRemote.js](02product/01_coding/project/hlm/scripts/deployRemote.js) with focused helper functions to:
    - detect origin transport (`https`/`ssh`/unknown),
    - compare origin vs resolved deploy remote transport,
    - generate auth remediation hints by remote scheme.
  - Keep helpers small and composable for testability.
3. **Implement `release:doctor` mode**
  - Update argument handling in [scripts/deploy.js](02product/01_coding/project/hlm/scripts/deploy.js) and [scripts/deployHandlers.js](02product/01_coding/project/hlm/scripts/deployHandlers.js) to support `doctor`.
  - `doctor` should report:
    - detected origin remote,
    - resolved deploy remote,
    - expected repo,
    - protocol mismatch warning (if any),
    - preflight result.
  - Ensure it exits before any write/push path.
4. **Implement `--dry-run` release path**
  - Add `--dry-run` flag plumbing in [scripts/deploy.js](02product/01_coding/project/hlm/scripts/deploy.js).
  - Reuse existing release calculations and print predicted summary + target remote.
  - Skip `writeFileSync` mutations and skip `pushReleaseToRemote` when dry-run is enabled.
  - Keep `--confirm` behavior explicit for real writes; dry-run may bypass confirm because it is non-mutating.
5. **Improve diagnostics and mismatch warning flow**
  - Enhance preflight failure error in [scripts/deployRemote.js](02product/01_coding/project/hlm/scripts/deployRemote.js) with protocol-specific hint text:
    - SSH failures: key/agent guidance and HTTPS override example.
    - HTTPS failures: token/access guidance and SSH alternative.
  - Print warning (not hard fail) on transport mismatch in `doctor` and release flow before preflight.
6. **Wire CLI usage + npm scripts + docs**
  - Update usage text in [src/config/deployPrompts.js](02product/01_coding/project/hlm/src/config/deployPrompts.js) to include `doctor` and `--dry-run`.
  - Add npm shortcut in [package.json](02product/01_coding/project/hlm/package.json), e.g. `release:doctor`.
  - Update runbook in [RELEASE_AND_PUBLISH.md](02product/01_coding/project/hlm/RELEASE_AND_PUBLISH.md) with doctor/dry-run examples and interpretation guidance.
  - Add changelog entry in [CHANGELOG.md](02product/01_coding/project/hlm/CHANGELOG.md) under `[Unreleased]`.
7. **Add CI matrix for deploy-focused tests**
  - Add/update workflow in [github/workflows/security-scan.yml](02product/01_coding/project/hlm/.github/workflows/security-scan.yml) or a dedicated CI workflow to run deploy test subset on:
    - `ubuntu-latest`, `macos-latest`, `windows-latest`.
  - Keep runtime bounded by scoping to deploy-related tests first.

## Validation Plan

- Run targeted deploy suites first:
  - `node --test tests/unit/deployRuntime.test.js`
  - `node --test tests/unit/deployCli.prompts.test.js`
  - `node --test tests/unit/deployCli.release.core.test.js`
  - `node --test tests/unit/deployCli.release.bump.test.js`
- Run full quality gates:
  - `npm test`
- Check lints for edited files.
- Run `cloc` for modified program files to monitor SLOC guardrail.

## Key Files

- [scripts/deploy.js](02product/01_coding/project/hlm/scripts/deploy.js)
- [scripts/deployHandlers.js](02product/01_coding/project/hlm/scripts/deployHandlers.js)
- [scripts/deployRemote.js](02product/01_coding/project/hlm/scripts/deployRemote.js)
- [src/config/deployPrompts.js](02product/01_coding/project/hlm/src/config/deployPrompts.js)
- [tests/unit/deployRuntime.test.js](02product/01_coding/project/hlm/tests/unit/deployRuntime.test.js)
- [tests/unit/deployCli.release.core.test.js](02product/01_coding/project/hlm/tests/unit/deployCli.release.core.test.js)
- [tests/unit/deployCli.prompts.test.js](02product/01_coding/project/hlm/tests/unit/deployCli.prompts.test.js)
- [package.json](02product/01_coding/project/hlm/package.json)
- [RELEASE_AND_PUBLISH.md](02product/01_coding/project/hlm/RELEASE_AND_PUBLISH.md)
- [CHANGELOG.md](02product/01_coding/project/hlm/CHANGELOG.md)
- [github/workflows/security-scan.yml](02product/01_coding/project/hlm/.github/workflows/security-scan.yml)

