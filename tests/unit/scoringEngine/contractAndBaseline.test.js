import test from "node:test";
import assert from "node:assert/strict";
import {
  buildScoringRuleSnapshot,
  getScoreRulePreset,
  SCORE_RULE_PRESET_IDS
} from "../../../src/config/scoreRuleConfig.js";
import { scoreHand } from "../../../src/rules/scoringEngine.js";

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

test("scoreHand rejects invalid structured context enum values", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "9B"],
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "none",
    waitType: "bad_wait"
  });
  assert.equal(result.errorCode, "INVALID_INPUT");
  assert.equal(result.isWin, false);
  assert.equal(result.problems.some((p) => p.includes("waitType")), true);
});

test("scoreHand rejects malformed structured context objects", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "9B"],
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "none",
    kongSummary: "bad",
    concealedPungCount: 8
  });
  assert.equal(result.errorCode, "INVALID_INPUT");
  assert.equal(result.isWin, false);
  assert.equal(result.problems.some((p) => p.includes("kongSummary")), true);
  assert.equal(
    result.problems.some((p) => p.includes("concealedPungCount")),
    true
  );
});

test("scoreHand now passes baseline with newly covered 1-fan items", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "9B"],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.rawWin, true);
  assert.equal(result.totalFan, 3);
  assert.equal(result.isWin, true);
});

test("scoreHand accepts hand when total fan reaches min gate", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "9B"],
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "none"
  });
  assert.equal(result.totalFan, 6);
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
  assert.equal(result.totalFan, 14);
  assert.equal(result.isWin, true);
});

test("scoreHand applies MCR 8-fan gate when snapshot from official preset", () => {
  const snap = buildScoringRuleSnapshot(
    getScoreRulePreset(SCORE_RULE_PRESET_IDS.MCR_OFFICIAL)
  );
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "9B"],
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "none",
    scoringRule: snap
  });
  assert.equal(result.totalFan, 6);
  assert.equal(result.gateFan, 6);
  assert.equal(result.minWinningFan, 8);
  assert.equal(result.isWin, false);
  assert.equal(result.errorCode, "NOT_A_WINNING_HAND");
});

test("scoreHand rejects malformed scoringRule", () => {
  const result = scoreHand({
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "9B"],
    winType: "zimo",
    handState: "menqian",
    kongType: "none",
    timingEvent: "none",
    scoringRule: { gateMinFan: 1.5, gateExcludeFanIds: [], settlementMode: "compatLinear", officialBasePoint: 8 }
  });
  assert.equal(result.errorCode, "INVALID_INPUT");
  assert.equal(result.isWin, false);
});
