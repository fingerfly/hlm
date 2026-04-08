---
name: hlm_rule_code_trace_matrix
overview: Maintain the HLM Guobiao rule→code trace matrix (registry, detectors, EXCLUSION_MAP, pipeline, verification) as the audit source of truth; keep it in sync with code and tests after scoring changes.
todos:
  - id: matrix-canonical-doc
    content: Keep hlm_rule_code_trace_matrix.md as canonical tables + regen instructions; plan body links to it (no duplicate full tables here).
    status: completed
  - id: matrix-legend-table-align
    content: Fix column legend vs registry table (Feature field vs evidence-only columns) per review.
    status: completed
  - id: matrix-known-gaps-refresh
    content: Rewrite Known gaps — exclusionMap.truthTable covers all keys; conflictResolver.test.js is supplemental narrative coverage.
    status: completed
  - id: matrix-sync-on-registry-change
    content: On FAN_REGISTRY or detector moves, rerun registry-table snippet and update Last regenerated + row count 81 check.
    status: completed
  - id: matrix-sync-on-exclusion-change
    content: On EXCLUSION_MAP edits, update matrix EXCLUSION_MAP section + key count 33; truth table test already guards drift.
    status: completed
  - id: matrix-registry-81-note
    content: Document MJ.pdf strict_81 baseline (81 registry rows); supersede old 82-row alias note.
    status: completed
isProject: false
---

# HLM rule→code trace matrix (Cursor plan)

**Master:** [hlm-master-plan.plan.md](hlm-master-plan.plan.md)  
**Related track:** [hlm_mcr_full_official_alignment_a1b2c3d4.plan.md](hlm_mcr_full_official_alignment_a1b2c3d4.plan.md)  
**Status:** `completed` (2026-04-07)

## Objective

- Hold a **single auditable** mapping from MCR/Guobiao semantics to HLM code
  (registry ids, detector modules, `EXCLUSION_MAP`, scoring pipeline,
  verification tests).
- Avoid drift between `exclusionMap.js`, `fanRegistry.js`, detectors, and docs.

## Canonical artifact (tables + maintenance)

All **wide tables** (82 registry rows, 33 exclusion rows, pipeline, verification
anchors, regen one-liner) live here:

**[hlm_rule_code_trace_matrix.md](hlm_rule_code_trace_matrix.md)**

This `.plan.md` file is the **Cursor plan shell** (frontmatter todos + policy).
Regenerate table blocks with `node scripts/writeRuleTraceMatrix.mjs` from `hlm/`
after registry / detector / `exclusionMap.js` edits; edit prose in the matrix
only when the script template or anchors change.

## Scope

- In scope: matrix accuracy, regen after registry/detector/exclusion changes,
  doc consistency (legend, gaps, 81 vs 82 note).
- Out of scope: changing scoring rules (do that under MCR alignment plan).

## Mandatory gates (when matrix or code under it changes)

- `npm test`
- `npm run quality:complexity`
- Re-run or extend tests listed under “Verification anchors” in the matrix doc.

## Readiness

- **Shipped:** matrix v1 + Feature column + 81/82 note + maintenance steps +
  `ruleTraceMatrix.docSync.test.js` guard. YAML todos above are **completed**.
- **Ongoing discipline:** run full gates after any matrix-regenerating change.
  Rank-zone vs `QUAN_*` **deferred** (distinct semantics in `fanLexiconEntries`;
  see master **NextActions**).
