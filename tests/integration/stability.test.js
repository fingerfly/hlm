import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCapturedHand } from "../../src/app/evaluateCapturedHand.js";

const stableTiles = [
  "1W", "1W", "1W",
  "2W", "3W", "4W",
  "5W", "6W", "7W",
  "2T", "3T", "4T",
  "9B", "9B"
];

test("stability: repeated e2e calls stay deterministic", () => {
  const request = {
    tiles: stableTiles,
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
    assert.equal(result.scoring.totalFan, 14);
  }
});
