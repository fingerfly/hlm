import test from "node:test";
import assert from "node:assert/strict";
import { getScoreRulePreset, SCORE_RULE_PRESET_IDS } from "../../src/config/scoreRuleConfig.js";
import { evaluateCapturedHand } from "../../src/app/evaluateCapturedHand.js";

const winningTiles = [
  "1W", "1W", "1W",
  "2W", "3W", "4W",
  "5W", "6W", "7W",
  "2T", "3T", "4T",
  "9B", "9B"
];

test("evaluateCapturedHand returns INVALID_INPUT for invalid tile code", () => {
  const badTiles = [...winningTiles];
  badTiles[2] = "X9";
  const result = evaluateCapturedHand({
    tiles: badTiles,
    context: {
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "none"
    }
  });
  assert.equal(result.recognition.status, "manual_invalid");
  assert.equal(result.scoring.errorCode, "INVALID_INPUT");
  assert.equal(result.scoring.isWin, false);
  assert.match(result.explanation, /手牌输入无效/);
  assert.equal(result.scoring.problems.some((p) => p.includes("tile_2")), true);
});

test("evaluateCapturedHand returns NEED_CONTEXT when context is missing", () => {
  const result = evaluateCapturedHand({
    tiles: winningTiles,
    context: {
      handState: "menqian",
      kongType: "none",
      timingEvent: "gangshang"
    }
  });
  assert.equal(result.recognition.status, "manual_ready");
  assert.equal(result.scoring.errorCode, "NEED_CONTEXT");
  assert.equal(result.scoring.isWin, false);
  assert.deepEqual(result.scoring.missingFields, ["winType"]);
});

test("evaluateCapturedHand normalizes aliases and returns scoring + replay log", () => {
  const tilesWithAlias = [...winningTiles];
  tilesWithAlias[0] = " 1W ";
  const result = evaluateCapturedHand({
    tiles: tilesWithAlias,
    context: {
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "gangshang"
    }
  });
  assert.equal(result.recognition.status, "manual_ready");
  assert.equal(result.recognition.tileCodes.length, 14);
  assert.equal(result.recognition.tileCodes[0], "1W");
  assert.equal(result.scoring.isWin, true);
  assert.equal(typeof result.replayLog.timestamp, "string");
  assert.match(result.explanation, /总番/);
});

test("evaluateCapturedHand treats updated baseline hand as winning", () => {
  const result = evaluateCapturedHand({
    tiles: [...winningTiles],
    context: {
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "none"
    }
  });
  assert.equal(result.recognition.status, "manual_ready");
  assert.equal(result.scoring.totalFan, 6);
  assert.equal(result.scoring.isWin, true);
  assert.equal(result.scoring.errorCode, null);
});

test("evaluateCapturedHand uses MCR gate when ruleConfig is official preset", () => {
  const result = evaluateCapturedHand({
    tiles: [...winningTiles],
    ruleConfig: getScoreRulePreset(SCORE_RULE_PRESET_IDS.MCR_OFFICIAL),
    context: {
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "none"
    }
  });
  assert.equal(result.scoring.totalFan, 6);
  assert.equal(result.scoring.isWin, false);
  assert.equal(result.scoring.errorCode, "NOT_A_WINNING_HAND");
});

test("evaluateCapturedHand accepts legacy flower aliases as valid tiles", () => {
  const tiles = [...winningTiles];
  tiles[0] = "F1";
  tiles[1] = "J1";
  const result = evaluateCapturedHand({
    tiles,
    context: {
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "none"
    }
  });
  assert.equal(result.recognition.status, "manual_ready");
  assert.equal(result.recognition.tileCodes[0], "Ch");
  assert.equal(result.recognition.tileCodes[1], "Mm");
  assert.notEqual(result.scoring.errorCode, "INVALID_INPUT");
});
