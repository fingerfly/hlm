import test from "node:test";
import assert from "node:assert/strict";
import { scoreHand } from "../../../src/rules/scoringEngine.js";

test("scoreHand detects quan xiao and excludes subfans", () => {
  const result = scoreHand({
    tiles: ["1W", "2W", "3W", "1T", "2T", "3T", "1B", "2B", "3B", "1W", "2W", "3W", "1T", "1T"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 35);
  assert.equal(result.matchedFans.some((fan) => fan.id === "QUAN_XIAO"), true);
  assert.equal(result.matchedFans.some((fan) => fan.id === "XIAO_YU_WU"), false);
  assert.equal(result.matchedFans.some((fan) => fan.id === "WU_ZI"), false);
});

test("scoreHand detects quan zhong and excludes duan yao/wu zi", () => {
  const result = scoreHand({
    tiles: ["4W", "5W", "6W", "4T", "5T", "6T", "4B", "5B", "6B", "4W", "5W", "6W", "5T", "5T"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 35);
  assert.equal(result.matchedFans.some((fan) => fan.id === "QUAN_ZHONG"), true);
  assert.equal(result.matchedFans.some((fan) => fan.id === "DUAN_YAO"), false);
  assert.equal(result.matchedFans.some((fan) => fan.id === "WU_ZI"), false);
});

test("scoreHand san tong ke excludes shuang tong ke", () => {
  const result = scoreHand({
    tiles: ["5W", "5W", "5W", "5T", "5T", "5T", "5B", "5B", "5B", "E", "E", "E", "R", "R"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 22);
  assert.equal(result.matchedFans.some((fan) => fan.id === "SAN_TONG_KE"), true);
  assert.equal(
    result.matchedFans.some((fan) => fan.id === "SHUANG_TONG_KE"),
    false
  );
});
