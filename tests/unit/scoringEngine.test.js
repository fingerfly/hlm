import test from "node:test";
import assert from "node:assert/strict";
import { scoreHand } from "../../src/rules/scoringEngine.js";

test("scoreHand returns NEED_CONTEXT when required context is missing", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "9B"],
    handState: "menqian",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.errorCode, "NEED_CONTEXT");
  assert.equal(result.isWin, false);
});

test("scoreHand rejects winning pattern below min fan threshold", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "9B"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.rawWin, true);
  assert.equal(result.totalFan, 0);
  assert.equal(result.isWin, false);
});

test("scoreHand accepts hand when total fan reaches min gate", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "9B"],
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.totalFan, 3);
  assert.equal(result.isWin, true);
});

test("scoreHand accepts higher-fan hand", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "9B"],
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "gangshang"
  });
  assert.equal(result.totalFan, 11);
  assert.equal(result.isWin, true);
});
