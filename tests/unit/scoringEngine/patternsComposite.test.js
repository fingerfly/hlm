import test from "node:test";
import assert from "node:assert/strict";
import { scoreHand } from "../../../src/rules/scoringEngine.js";

test("scoreHand detects yi ban gao for duplicate chow pattern", () => {
  const result = scoreHand({
    tiles: ["1W", "2W", "3W", "1W", "2W", "3W", "4T", "4T", "4T", "7B", "8B", "9B", "5W", "5W"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 2);
  assert.equal(result.matchedFans.some((fan) => fan.id === "YI_BAN_GAO"), true);
});

test("scoreHand detects san se san tong shun for mixed triple chow", () => {
  const result = scoreHand({
    tiles: ["1W", "2W", "3W", "1T", "2T", "3T", "1B", "2B", "3B", "7W", "7W", "7W", "9B", "9B"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 9);
  assert.equal(
    result.matchedFans.some((fan) => fan.id === "SAN_SE_SAN_TONG_SHUN"),
    true
  );
});
