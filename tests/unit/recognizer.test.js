import test from "node:test";
import assert from "node:assert/strict";
import { fuseFrames } from "../../src/vision/recognizer.js";

test("fuseFrames builds per-slot top-k candidates", () => {
  const frameA = [
    { label: "1W", confidence: 0.9 },
    { label: "2W", confidence: 0.92 }
  ];
  const frameB = [
    { label: "1W", confidence: 0.8 },
    { label: "3W", confidence: 0.9 }
  ];
  const frameC = [
    { label: "4W", confidence: 0.7 },
    { label: "2W", confidence: 0.85 }
  ];

  const out = fuseFrames([frameA, frameB, frameC]);
  assert.equal(out.tiles.length, 2);
  assert.equal(out.tiles[0].label, "1W");
  assert.equal(out.tiles[0].candidates.length, 2);
  assert.equal(out.tiles[0].candidates[0].label, "1W");
  assert.equal(out.tiles[1].candidates[0].label, "2W");
});

test("fuseFrames marks ambiguous index when vote margin is narrow", () => {
  const frameA = [{ label: "1W", confidence: 0.9 }];
  const frameB = [{ label: "2W", confidence: 0.9 }];
  const frameC = [{ label: "1W", confidence: 0.2 }];
  const frameD = [{ label: "2W", confidence: 0.2 }];

  const out = fuseFrames([frameA, frameB, frameC, frameD]);
  assert.deepEqual(out.ambiguousIndices, [0]);
});
