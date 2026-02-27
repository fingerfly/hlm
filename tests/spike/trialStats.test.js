/**
 * Purpose: Verify repeated-run metric aggregation helpers.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { computeEvalMetricsFromCsvText, summarizeTrials } from "../../src/spike/vlm/trialStats.js";

test("computeEvalMetricsFromCsvText derives aggregate metrics", () => {
  const csv = [
    "sample_id,exact_match_14,position_accuracy,tile_set_accuracy,tb_recall,uncertain_count,api_ok",
    "a,Y,1.00,1.00,1.00,0,Y",
    "b,N,0.50,0.50,0.00,3,Y",
    "c,N,0.00,0.10,0.20,2,N"
  ].join("\n");
  const out = computeEvalMetricsFromCsvText(csv);
  assert.equal(out.samples, 3);
  assert.equal(out.exactMatchCount, 1);
  assert.equal(out.exactMatchRate, 1 / 3);
  assert.equal(out.avgPosition, 0.5);
  assert.equal(out.avgTileSet, (1 + 0.5 + 0.1) / 3);
  assert.equal(out.avgTbRecall, (1 + 0 + 0.2) / 3);
  assert.equal(out.avgUncertain, (0 + 3 + 2) / 3);
  assert.equal(out.apiFailCount, 1);
});

test("summarizeTrials computes mean and std for configured keys", () => {
  const trials = [
    { avgTbRecall: 0.1, avgTileSet: 0.2, successRate: 1 },
    { avgTbRecall: 0.3, avgTileSet: 0.4, successRate: 0.8 },
    { avgTbRecall: 0.5, avgTileSet: 0.6, successRate: 1 }
  ];
  const out = summarizeTrials(trials, ["avgTbRecall", "avgTileSet", "successRate"]);
  assert.equal(out.avgTbRecall.mean, 0.3);
  assert.equal(out.avgTbRecall.std, 0.163299);
  assert.equal(out.avgTileSet.min, 0.2);
  assert.equal(out.successRate.max, 1);
});
