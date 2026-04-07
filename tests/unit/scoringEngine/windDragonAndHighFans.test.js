import test from "node:test";
import assert from "node:assert/strict";
import { scoreHand } from "../../../src/rules/scoringEngine.js";
import { COMPAT_SCORING_RULE_SNAPSHOT } from "../../helpers/scoringTestSnapshots.js";

test("scoreHand detects both seat and prevalent wind pungs", () => {
  const result = scoreHand({
    tiles: ["E", "E", "E", "1W", "2W", "3W", "4W", "5W", "6W", "7T", "8T", "9T", "5B", "5B"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    seatWind: "E",
    prevalentWind: "E",
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
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

test("scoreHand zi yi se excludes men/quan wind subfans when winds set", () => {
  const result = scoreHand({
    tiles: ["E", "E", "E", "S", "S", "S", "R", "R", "R", "G", "G", "G", "Wh", "Wh"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    seatWind: "E",
    prevalentWind: "S"
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 134);
  assert.equal(result.matchedFans.some((fan) => fan.id === "ZI_YI_SE"), true);
  assert.equal(result.matchedFans.some((fan) => fan.id === "MEN_FENG_KE"), false);
  assert.equal(result.matchedFans.some((fan) => fan.id === "QUAN_FENG_KE"), false);
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

test("scoreHand jiu lian bao deng excludes qing men qing yao subfans", () => {
  const result = scoreHand({
    tiles: [
      "1W", "1W", "1W",
      "2W", "3W", "4W",
      "5W", "6W", "7W",
      "8W", "9W", "9W",
      "9W", "5W"
    ],
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "none",
    advancedAuto: true,
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 89);
  assert.equal(result.matchedFans.some((f) => f.id === "JIU_LIAN_BAO_DENG"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "QING_YI_SE"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "MEN_QIAN_QING"), false);
});

test("scoreHand lv yi se excludes bundled structure fans", () => {
  const result = scoreHand({
    tiles: [
      "2T", "2T", "2T",
      "3T", "3T", "3T",
      "4T", "4T", "4T",
      "6T", "6T", "6T",
      "8T", "8T"
    ],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    advancedAuto: true,
    scoringRule: COMPAT_SCORING_RULE_SNAPSHOT
  });
  assert.equal(result.isWin, true);
  assert.equal(result.totalFan, 88);
  assert.equal(result.matchedFans.some((f) => f.id === "LV_YI_SE"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "QING_YI_SE"), false);
});
