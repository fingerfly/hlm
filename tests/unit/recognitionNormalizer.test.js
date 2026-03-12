import test from "node:test";
import assert from "node:assert/strict";
import {
  applyConfirmedTiles,
  normalizeRecognitionForEvaluation
} from "../../src/app/recognitionNormalizer.js";

test("applyConfirmedTiles overrides labels and trims missing indices", () => {
  const recognition = {
    status: "need_human_confirm",
    missingIndices: [0, 2],
    tiles: [
      {
        label: "1W",
        finalLabel: "1W",
        confidence: 0.8,
        candidates: [{ label: "1W", score: 0.8 }],
        source: "model"
      },
      {
        label: "2W",
        finalLabel: "2W",
        confidence: 0.8,
        candidates: [{ label: "2W", score: 0.8 }],
        source: "model"
      },
      {
        label: "3W",
        finalLabel: "3W",
        confidence: 0.8,
        candidates: [{ label: "3W", score: 0.8 }],
        source: "model"
      }
    ]
  };

  const out = applyConfirmedTiles(recognition, { 0: "Wh" });
  assert.equal(out.tiles[0].label, "Wh");
  assert.equal(out.tiles[0].source, "human");
  assert.deepEqual(out.missingIndices, [2]);
  assert.equal(out.status, "need_human_confirm");
});

test("normalizeRecognitionForEvaluation maps failed payload shape", () => {
  const out = normalizeRecognitionForEvaluation({
    status: "failed",
    tiles: [{ label: "1W" }],
    missingIndices: [0]
  });
  assert.equal(out.ok, false);
  assert.equal(out.code, "RECOGNITION_FAILED");
  assert.deepEqual(out.recognition.tileCodes, ["1W"]);
});

test("normalizeRecognitionForEvaluation returns normalized accepted payload", () => {
  const tiles = new Array(14).fill(null).map((_, index) => ({
    finalLabel: "1W",
    confidence: 0.9,
    candidates: [{ label: "1W", score: 0.9 }],
    source: "model",
    index
  }));
  const out = normalizeRecognitionForEvaluation({
    status: "accepted",
    tiles,
    missingIndices: []
  });
  assert.equal(out.ok, true);
  assert.equal(out.recognition.status, "accepted");
  assert.equal(out.recognition.tiles.length, 14);
  assert.equal(out.recognition.tileCodes.length, 14);
});
