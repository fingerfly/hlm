import test from "node:test";
import assert from "node:assert/strict";
import { resolveFanConflicts } from "../../src/rules/conflictResolver.js";

test("resolveFanConflicts keeps higher fan in same group", () => {
  const result = resolveFanConflicts([
    { id: "QING_YI_SE", fan: 24, evidence: "pure" },
    { id: "HUN_YI_SE", fan: 6, evidence: "mixed" }
  ]);
  assert.equal(result.matchedFans.length, 1);
  assert.equal(result.matchedFans[0].id, "QING_YI_SE");
  assert.equal(result.excludedFans[0].id, "HUN_YI_SE");
});
