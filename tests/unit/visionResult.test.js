import test from "node:test";
import assert from "node:assert/strict";
import { normalizeVisionResult } from "../../src/contracts/visionResult.js";

test("normalizeVisionResult normalizes 14-slot payload and sorts uncertain indices", () => {
  const payload = {
    status: "need_human_confirm",
    tiles: Array.from({ length: 14 }, (_, index) => ({
      finalLabel: `${(index % 9) + 1}W`,
      confidence: 0.9,
      candidates: [
        { label: `${(index % 9) + 1}W`, score: 0.9 },
        { label: `${(index % 9) + 2}W`, score: 0.1 }
      ],
      source: "model"
    })),
    uncertainIndices: [3, 1, 3, 12]
  };

  const out = normalizeVisionResult(payload);
  assert.equal(out.ok, true);
  assert.equal(out.data.tiles.length, 14);
  assert.deepEqual(out.data.uncertainIndices, [1, 3, 12]);
  assert.equal(out.data.tiles[0].index, 0);
});

test("normalizeVisionResult rejects payload with non-14 tiles", () => {
  const out = normalizeVisionResult({ status: "accepted", tiles: [], uncertainIndices: [] });
  assert.equal(out.ok, false);
  assert.match(out.problems.join(" "), /tiles must contain 14 slots/);
});

test("normalizeVisionResult rejects out-of-range uncertain index", () => {
  const payload = {
    status: "accepted",
    tiles: Array.from({ length: 14 }, () => ({
      finalLabel: "1W",
      confidence: 0.9,
      candidates: [{ label: "1W", score: 0.9 }],
      source: "model"
    })),
    uncertainIndices: [14]
  };
  const out = normalizeVisionResult(payload);
  assert.equal(out.ok, false);
  assert.match(out.problems.join(" "), /uncertainIndices must be integers in 0..13/);
});

test("normalizeVisionResult injects finalLabel into candidates and keeps top3", () => {
  const payload = {
    status: "accepted",
    tiles: Array.from({ length: 14 }, () => ({
      finalLabel: "3W",
      confidence: 0.8,
      candidates: [
        { label: "1W", score: 0.1 },
        { label: "2W", score: 0.2 },
        { label: "4W", score: 0.3 },
        { label: "5W", score: 0.4 }
      ],
      source: "model"
    })),
    uncertainIndices: []
  };

  const out = normalizeVisionResult(payload);
  assert.equal(out.ok, true);
  assert.equal(out.data.tiles[0].candidates.length, 3);
  assert.equal(out.data.tiles[0].candidates.some((it) => it.label === "3W"), true);
});
