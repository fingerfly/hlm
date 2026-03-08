import test from "node:test";
import assert from "node:assert/strict";
import { runConfidenceGate } from "../../src/vision/confidenceGate.js";

test("runConfidenceGate requests human confirm when low confidence exists", () => {
  const out = runConfidenceGate({
    tiles: [{ label: "1W", confidence: 0.7, candidates: [{ label: "1W", score: 0.7 }] }],
    lowConfidenceIndices: [0],
    ambiguousIndices: []
  });
  assert.equal(out.status, "need_human_confirm");
  assert.deepEqual(out.missingIndices, [0]);
});

test("runConfidenceGate merges low-confidence and ambiguous indices", () => {
  const out = runConfidenceGate({
    tiles: [{ label: "1W", confidence: 0.9, candidates: [{ label: "1W", score: 0.9 }] }],
    lowConfidenceIndices: [2, 1],
    ambiguousIndices: [1, 3]
  });
  assert.deepEqual(out.missingIndices, [1, 2, 3]);
});

test("runConfidenceGate accepts confident and unambiguous result", () => {
  const out = runConfidenceGate({
    tiles: [{ label: "1W", confidence: 0.9, candidates: [{ label: "1W", score: 0.9 }] }],
    lowConfidenceIndices: [],
    ambiguousIndices: []
  });
  assert.equal(out.status, "accepted");
  assert.deepEqual(out.missingIndices, []);
});
