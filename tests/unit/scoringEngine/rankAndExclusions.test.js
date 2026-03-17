import test from "node:test";
import assert from "node:assert/strict";
import { scoreHand } from "../../../src/rules/scoringEngine.js";

test("scoreHand detects hua long", () => {
  const result = scoreHand({
    tiles: ["1W", "2W", "3W", "4T", "5T", "6T", "7B", "8B", "9B", "E", "E", "E", "R", "R"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 8);
  assert.equal(result.matchedFans.some((fan) => fan.id === "HUA_LONG"), true);
});

test("scoreHand detects one-voided and no-honor with short straight", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "7T", "8T", "9T", "9T", "9T"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 3);
  assert.equal(result.matchedFans.some((fan) => fan.id === "QUE_YI_MEN"), true);
  assert.equal(result.matchedFans.some((fan) => fan.id === "WU_ZI"), true);
});

test("scoreHand detects yi se san bu gao", () => {
  const result = scoreHand({
    tiles: ["1W", "2W", "3W", "2W", "3W", "4W", "3W", "4W", "5W", "E", "E", "E", "R", "R"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 22);
  assert.equal(
    result.matchedFans.some((fan) => fan.id === "YI_SE_SAN_BU_GAO"),
    true
  );
});

test("scoreHand detects san se san bu gao", () => {
  const result = scoreHand({
    tiles: ["1W", "2W", "3W", "2T", "3T", "4T", "3B", "4B", "5B", "E", "E", "E", "R", "R"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 6);
  assert.equal(
    result.matchedFans.some((fan) => fan.id === "SAN_SE_SAN_BU_GAO"),
    true
  );
});

test("scoreHand detects quan da and excludes subfans", () => {
  const result = scoreHand({
    tiles: ["7W", "8W", "9W", "7T", "8T", "9T", "7B", "8B", "9B", "7W", "8W", "9W", "9T", "9T"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 35);
  assert.equal(result.matchedFans.some((fan) => fan.id === "QUAN_DA"), true);
  assert.equal(result.matchedFans.some((fan) => fan.id === "DA_YU_WU"), false);
  assert.equal(result.matchedFans.some((fan) => fan.id === "WU_ZI"), false);
});
