---
name: Layered Mahjong Encoding Rollout (Risk-Hardened)
overview: ""
todos:
  - id: freeze-contract
    content: Document and lock non-breaking external contracts for CSV and JSON outputs.
    status: completed
  - id: mapping-roundtrip-tests
    content: Add canonical-order, roundtrip, alias, and invalid-input tests for tile code/id mapping.
    status: completed
  - id: mask-spec-tests
    content: Add indices-mask conversion tests including bounds and reserved-bit validation.
    status: completed
  - id: implement-v1-helpers
    content: Implement code/id and mask helpers with consistent error/result semantics and v1 version marker.
    status: completed
  - id: integrate-without-drift
    content: Integrate helpers into schema/eval ingestion paths while preserving existing output contracts.
    status: completed
  - id: docs-and-full-verify
    content: Update README with spec and run full test suite plus contract-regression checks.
    status: completed
isProject: false
---

# Layered Mahjong Encoding Rollout (Risk-Hardened)

## Current Status

- PlanClass: `historical-archive`
- OverallStatus: `completed`
- LastUpdated: `2026-03-16`

## Goals

- Keep current human-readable tile codes (`1W`, `Wh`, `Ch`, etc.) as the external contract for prompt, JSON, and CSV.
- Add compact internal encoding for compute/storage:
  - tile identity: 6-bit logical ID (`0..41`)
  - hand representation: `Uint8Array(14)` in v1
  - uncertainty: 14-bit mask in `uint16`
- Introduce `encodingVersion` in Phase 1 to guarantee forward compatibility.

## Contract Freeze (Must Not Break)

- Preserve CSV schema/column order currently used by evaluation scripts.
- Preserve CLI output JSON shape and summary JSON shape.
- Preserve existing accepted code strings as primary external inputs.

## Phase 1 Design Decisions

- Canonical tile ordering is fixed and versioned in
  [tileCodes.js](02product/01_coding/project/hlm/src/spike/vlm/tileCodes.js).
- Add bidirectional mapping APIs:
  - `codeToId(code)`
  - `idToCode(id)`
  - `tryCodeToId(code)` (non-throwing result)
- Add compatibility alias handling for legacy flower codes in decode/ingest path, with explicit deprecation notes.
- Add mask spec and enforce it:
  - `bit i` maps to tile index `i` (`0..13`)
  - only low 14 bits are valid
  - high 2 bits non-zero => validation error
- Error model is explicit and consistent (single pattern across helpers).

## Compatibility & Migration

- Add `legacyCodeAliases` map in the mapping layer (read-compat only).
- Ground-truth ingest path normalizes legacy aliases to canonical codes before validation.
- No automatic rewrite of historical files in this phase; keep migration as an explicit optional script.

## Implementation Steps (TDD)

1. Expand tests in
   [tileCodes.test.js](02product/01_coding/project/hlm/tests/spike/tileCodes.test.js):
  - canonical order stability snapshot
  - `code -> id -> code` roundtrip
  - legacy alias normalization
  - invalid code/id behavior
2. Add mask conversion tests in
   [tests/spike](02product/01_coding/project/hlm/tests/spike):
  - `indices -> mask -> indices` roundtrip
  - out-of-range index rejection
  - reserved-bit rejection (bit14/bit15)
3. Implement helper APIs in
   [tileCodes.js](02product/01_coding/project/hlm/src/spike/vlm/tileCodes.js).
4. Integrate non-breaking usage into:
  - [schema.js](02product/01_coding/project/hlm/src/spike/vlm/schema.js)
  - [evalCsv.js](02product/01_coding/project/hlm/src/spike/vlm/evalCsv.js)
5. Add `encodingVersion: "v1"` metadata at internal encoding boundary points (without changing external output schemas unless explicitly required).
6. Update docs in
   [README.md](02product/01_coding/project/hlm/README.md):
  - canonical mapping
  - mask semantics
  - compatibility policy

## Validation Gates

- All spike tests pass.
- Full suite passes via `npm test`.
- Regression check confirms no external contract drift for CSV/JSON outputs.

## Deferred (Phase 2)

- Optional 84-bit packing (11 bytes) for transport/persistence.
- Optional offline migration utility for legacy dataset rewrite to canonical codes.

