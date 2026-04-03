import test from "node:test";
import assert from "node:assert/strict";
import {
  computeRoundSettlement,
  createDefaultRoundPlayers
} from "../../src/app/roundSettlement.js";
import {
  SCORE_RULE_PRESET_IDS,
  getScoreRulePreset
} from "../../src/config/scoreRuleConfig.js";

test("createDefaultRoundPlayers returns four seats in order", () => {
  const players = createDefaultRoundPlayers();
  assert.equal(players.length, 4);
  assert.deepEqual(
    players.map((item) => item.seat),
    ["E", "S", "W", "N"]
  );
});

test("computeRoundSettlement handles dianhe one-payer transfer", () => {
  const result = computeRoundSettlement({
    players: [
      { seat: "E", name: "东", score: 10 },
      { seat: "S", name: "南", score: 10 },
      { seat: "W", name: "西", score: 10 },
      { seat: "N", name: "北", score: 10 }
    ],
    isWin: true,
    totalFan: 3,
    winType: "dianhe",
    winnerSeat: "E",
    discarderSeat: "S"
  });
  assert.equal(result.ok, true);
  assert.equal(result.sumDelta, 0);
  const e = result.rows.find((row) => row.seat === "E");
  const s = result.rows.find((row) => row.seat === "S");
  const w = result.rows.find((row) => row.seat === "W");
  assert.equal(e.delta, 3);
  assert.equal(s.delta, -3);
  assert.equal(w.delta, 0);
});

test("computeRoundSettlement handles zimo three-payer transfer", () => {
  const result = computeRoundSettlement({
    players: createDefaultRoundPlayers(),
    isWin: true,
    totalFan: 2,
    winType: "zimo",
    winnerSeat: "W"
  });
  assert.equal(result.ok, true);
  assert.equal(result.sumDelta, 0);
  const winner = result.rows.find((row) => row.seat === "W");
  const east = result.rows.find((row) => row.seat === "E");
  assert.equal(winner.delta, 6);
  assert.equal(east.delta, -2);
});

test("computeRoundSettlement rejects invalid dianhe roles", () => {
  const result = computeRoundSettlement({
    players: createDefaultRoundPlayers(),
    isWin: true,
    totalFan: 2,
    winType: "dianhe",
    winnerSeat: "E",
    discarderSeat: "E"
  });
  assert.equal(result.ok, false);
  assert.equal(result.problems.length > 0, true);
});

test("computeRoundSettlement rejects empty dianhe discarderSeat", () => {
  const result = computeRoundSettlement({
    players: createDefaultRoundPlayers(),
    isWin: true,
    totalFan: 2,
    winType: "dianhe",
    winnerSeat: "E",
    discarderSeat: ""
  });
  assert.equal(result.ok, false);
  assert.equal(result.problems.length > 0, true);
});

test("computeRoundSettlement applies ruleConfig multipliers", () => {
  const result = computeRoundSettlement({
    players: createDefaultRoundPlayers(),
    isWin: true,
    totalFan: 2,
    winType: "dianhe",
    winnerSeat: "E",
    discarderSeat: "S",
    ruleConfig: {
      fanToPoint: {
        mode: "linear",
        linear: { pointPerFan: 2, minPoint: 0, maxPoint: null }
      },
      distribution: {
        zimo: { winnerMultiplier: 3, loserMultiplier: 1 },
        dianhe: { winnerMultiplier: 1, discarderMultiplier: 1 }
      }
    }
  });
  const east = result.rows.find((row) => row.seat === "E");
  const south = result.rows.find((row) => row.seat === "S");
  assert.equal(east.delta, 4);
  assert.equal(south.delta, -4);
});

test("MCR_Official preset uses fan as settlement unit for dianhe", () => {
  const result = computeRoundSettlement({
    players: createDefaultRoundPlayers(),
    isWin: true,
    totalFan: 6,
    winType: "dianhe",
    winnerSeat: "N",
    discarderSeat: "W",
    ruleConfig: getScoreRulePreset(SCORE_RULE_PRESET_IDS.MCR_OFFICIAL)
  });
  const north = result.rows.find((row) => row.seat === "N");
  const west = result.rows.find((row) => row.seat === "W");
  assert.equal(north.delta, 6);
  assert.equal(west.delta, -6);
  assert.equal(result.sumDelta, 0);
});

test("MCR_Official preset uses fan as settlement unit for zimo", () => {
  const result = computeRoundSettlement({
    players: createDefaultRoundPlayers(),
    isWin: true,
    totalFan: 4,
    winType: "zimo",
    winnerSeat: "S",
    ruleConfig: getScoreRulePreset(SCORE_RULE_PRESET_IDS.MCR_OFFICIAL)
  });
  const south = result.rows.find((row) => row.seat === "S");
  const east = result.rows.find((row) => row.seat === "E");
  assert.equal(south.delta, 12);
  assert.equal(east.delta, -4);
  assert.equal(result.sumDelta, 0);
});
