/**
 * Purpose: Verify summary metric aggregation from spike result payloads.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { computeSummary } from "../../src/spike/vlm/summaryMetrics.js";

test("computeSummary handles empty sample set", () => {
  const s = computeSummary([], {});
  assert.equal(s.total, 0);
  assert.equal(s.successRate, 0);
  assert.equal(s.tilesLen14Rate, 0);
});

test("computeSummary counts mixed success/failure and codes", () => {
  const ids = ["a", "b", "c"];
  const results = {
    a: { ok: true, data: { tiles: new Array(14).fill("1W"), uncertainIndices: [1] } },
    b: { ok: false, code: "INVALID_VLM_OUTPUT", data: { uncertainIndices: [2, 3] } }
  };
  const s = computeSummary(ids, results);
  assert.equal(s.total, 3);
  assert.equal(s.success, 1);
  assert.equal(s.failed, 2);
  assert.equal(s.byCode.OK, 1);
  assert.equal(s.byCode.INVALID_VLM_OUTPUT, 1);
  assert.equal(s.byCode.MISSING_RESULT, 1);
  assert.equal(s.tilesLen14Count, 1);
  assert.equal(s.averageUncertainCount, 1);
});
