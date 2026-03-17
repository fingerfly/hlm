import test from "node:test";
import assert from "node:assert/strict";
import { scoreHand } from "../../../src/rules/scoringEngine.js";

test("scoreHand detects both seat and prevalent wind pungs", () => {
  const result = scoreHand({
    tiles: ["E", "E", "E", "1W", "2W", "3W", "4W", "5W", "6W", "7T", "8T", "9T", "5B", "5B"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    seatWind: "E",
    prevalentWind: "E"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 5);
  assert.equal(result.matchedFans.some((fan) => fan.id === "MEN_FENG_KE"), true);
  assert.equal(result.matchedFans.some((fan) => fan.id === "QUAN_FENG_KE"), true);
});

test("scoreHand detects da si xi and excludes wind pung sub-fans", () => {
  const result = scoreHand({
    tiles: ["E", "E", "E", "S", "S", "S", "Wn", "Wn", "Wn", "N", "N", "N", "R", "R"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    seatWind: "E",
    prevalentWind: "S"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 88);
  assert.equal(result.matchedFans.some((fan) => fan.id === "DA_SI_XI"), true);
  assert.equal(result.matchedFans.some((fan) => fan.id === "MEN_FENG_KE"), false);
  assert.equal(result.matchedFans.some((fan) => fan.id === "QUAN_FENG_KE"), false);
});

test("scoreHand detects xiao san yuan", () => {
  const result = scoreHand({
    tiles: ["R", "R", "R", "G", "G", "G", "Wh", "Wh", "1W", "2W", "3W", "4T", "5T", "6T"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 65);
  assert.equal(result.matchedFans.some((fan) => fan.id === "XIAO_SAN_YUAN"), true);
});

test("scoreHand detects zi yi se with xiao san yuan", () => {
  const result = scoreHand({
    tiles: ["E", "E", "E", "S", "S", "S", "R", "R", "R", "G", "G", "G", "Wh", "Wh"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 134);
  assert.equal(result.matchedFans.some((fan) => fan.id === "ZI_YI_SE"), true);
  assert.equal(result.matchedFans.some((fan) => fan.id === "XIAO_SAN_YUAN"), true);
  assert.equal(result.matchedFans.some((fan) => fan.id === "HUN_YAO_JIU"), false);
});

test("scoreHand detects da san feng", () => {
  const result = scoreHand({
    tiles: ["E", "E", "E", "S", "S", "S", "Wn", "Wn", "Wn", "2W", "2W", "2W", "9B", "9B"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 19);
  assert.equal(result.matchedFans.some((fan) => fan.id === "DA_SAN_FENG"), true);
});

test("scoreHand xiao san yuan excludes shuang jian ke", () => {
  const result = scoreHand({
    tiles: ["R", "R", "R", "G", "G", "G", "Wh", "Wh", "1W", "2W", "3W", "4T", "5T", "6T"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 65);
  assert.equal(result.matchedFans.some((fan) => fan.id === "XIAO_SAN_YUAN"), true);
  assert.equal(
    result.matchedFans.some((fan) => fan.id === "SHUANG_JIAN_KE"),
    false
  );
});
