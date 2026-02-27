import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCapturedHand } from "../../src/app/evaluateCapturedHand.js";

const stableFrame = [
  { label: "1W", confidence: 0.97 },
  { label: "1W", confidence: 0.97 },
  { label: "1W", confidence: 0.97 },
  { label: "2W", confidence: 0.97 },
  { label: "3W", confidence: 0.97 },
  { label: "4W", confidence: 0.97 },
  { label: "5W", confidence: 0.97 },
  { label: "6W", confidence: 0.97 },
  { label: "7W", confidence: 0.97 },
  { label: "2T", confidence: 0.97 },
  { label: "3T", confidence: 0.97 },
  { label: "4T", confidence: 0.97 },
  { label: "9B", confidence: 0.97 },
  { label: "9B", confidence: 0.97 }
];

test("stability: repeated e2e calls stay deterministic", () => {
  const request = {
    frames: [stableFrame, stableFrame, stableFrame],
    context: {
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "gangshang"
    }
  };

  for (let i = 0; i < 200; i += 1) {
    const result = evaluateCapturedHand(request);
    assert.equal(result.scoring.isWin, true);
    assert.equal(result.scoring.totalFan, 11);
  }
});
