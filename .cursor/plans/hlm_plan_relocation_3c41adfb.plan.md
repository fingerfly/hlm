---
name: hlm plan relocation
overview: Relocate HLM plans from root `.cursor/plans` to
  `02product/01_coding/project/hlm/.cursor/plans`, then repair references and
  validate no plan-link drift.
todos:
  - id: inventory-finalize
    content: Finalize source-to-destination mapping for in-scope HLM plans.
    status: completed
  - id: prepare-destination
    content: Create destination `.cursor/plans` under HLM project if missing.
    status: completed
  - id: migrate-files
    content: Move mapped HLM plan files to HLM-local destination.
    status: completed
  - id: fix-references
    content: Update cross-plan references in moved files and root pointers.
    status: completed
  - id: retire-root-copies
    content: Remove migrated HLM plan files from root `.cursor/plans`.
    status: completed
  - id: validate-migration
    content: Validate applied changes, consistency, and link executability.
    status: completed
isProject: false
---

# HLM Plan Relocation Plan

## Goal

Make HLM plans project-local so plan artifacts live with HLM code and remain
portable across machines.

## Canonical Paths

- Source: [C:/Projects/00_Mundo/.cursor/plans](C:/Projects/00_Mundo/.cursor/plans)
- Destination:
  [C:/Projects/00_Mundo/02product/01_coding/project/hlm/.cursor/plans](C:/Projects/00_Mundo/02product/01_coding/project/hlm/.cursor/plans)

## In-Scope Files

- `hlm-master-plan.plan.md`
- `hlm_deploy_hardening_b0d19373.plan.md`
- `hlm-tile-first-ui-overhaul_9db3c6ce.plan.md`
- `hlm-vision-v2-plan_fbaccd9f.plan.md`
- `hlm-p0-stabilization_fadba898.plan.md`
- `hlm-ui-ux-input-upgrade.plan.md`
- `hlm-mobile-ui-simplification.plan.md`
- `hlm_github_pages_migration_1186808d.plan.md`
- `hlm-mobile-ui-practicality-upgrade.plan.md`
- `hlm-mobile-menu-undo-spacing_18c3266f.plan.md`

## Out-of-Scope

- Non-HLM plans in root `.cursor/plans`.
- Global user-level plan archives not tied to HLM.

## Execution Steps

1. Build explicit mapping `source -> destination` for in-scope files.
2. Create destination directory if missing.
3. Move in-scope files.
4. Update plan links:
   - `hlm-master-plan.plan.md` child references,
   - any intra-HLM plan links still pointing to root `.cursor/plans`.
5. Remove root copies of moved HLM plans.
6. Leave non-HLM root plans untouched.

## Validation (same turn)

- Applied edits:
  - all in-scope files exist in destination,
  - root copies removed for moved files.
- Internal consistency:
  - `hlm-master-plan.plan.md` references resolve,
  - no stale root links for in-scope HLM plans.
- Executability:
  - each moved plan can be read successfully,
  - grep pass confirms no broken in-scope references.

## Completion Snapshot

- Status: `completed`
- CompletionDate: `2026-03-18`
- Applied:
  - Moved 11 HLM plan files from root `.cursor/plans` to
    `02product/01_coding/project/hlm/.cursor/plans`.
  - Rewrote in-scope intra-HLM plan links to local sibling links.
  - Removed root copies for all moved HLM plan files.
- Validation:
  - Destination directory contains all mapped HLM plans.
  - Root `.cursor/plans` has no remaining `hlm*.plan.md` files.
  - No stale `.cursor/plans/hlm*.plan.md` references remain in moved plans.
  - Moved plans are readable at destination paths.

## Rollback

- If any link validation fails, restore moved files back to source and re-run
  mapping + reference fixes.

