import test from "node:test";
import assert from "node:assert/strict";
import { scoreHand } from "../../../src/rules/scoringEngine.js";

test("scoreHand detects qing yi se in pure one-suit hand", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "3W", "4W", "5W", "9W", "9W"],
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 28);
});

test("scoreHand detects peng peng hu and reaches min fan gate", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "2W", "2W", "2W", "3T", "3T", "3T", "5B", "5B", "5B", "9B", "9B"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 7);
  assert.equal(result.matchedFans.some((fan) => fan.id === "PENG_PENG_HU"), true);
});

test("scoreHand detects hun yao jiu for terminals-and-honors hand", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "9W", "9W", "9W", "1T", "1T", "1T", "E", "E", "E", "9B", "9B"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 40);
  assert.equal(result.matchedFans.some((fan) => fan.id === "HUN_YAO_JIU"), true);
});

test("scoreHand detects qing yao jiu and excludes hun yao jiu", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "9W", "9W", "9W", "1T", "1T", "1T", "9T", "9T", "9T", "9B", "9B"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 73);
  assert.equal(result.matchedFans.some((fan) => fan.id === "QING_YAO_JIU"), true);
  assert.equal(result.matchedFans.some((fan) => fan.id === "HUN_YAO_JIU"), false);
});

test("scoreHand detects qing long for one-suit pure straight", () => {
  const result = scoreHand({
    tiles: ["1W", "2W", "3W", "4W", "5W", "6W", "7W", "8W", "9W", "2T", "3T", "4T", "9B", "9B"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 18);
  assert.equal(result.matchedFans.some((fan) => fan.id === "QING_LONG"), true);
  assert.equal(result.matchedFans.some((fan) => fan.id === "PING_HU"), true);
});

test("scoreHand detects ping hu in chow-only hand", () => {
  const result = scoreHand({
    tiles: ["1W", "2W", "3W", "4W", "5W", "6W", "2T", "3T", "4T", "6B", "7B", "8B", "5T", "5T"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 3);
  assert.equal(result.matchedFans.some((fan) => fan.id === "PING_HU"), true);
});
