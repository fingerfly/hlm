import test from "node:test";
import assert from "node:assert/strict";
import {
  computeRoundSettlement,
  createDefaultRoundPlayers
} from "../../src/app/roundSettlement.js";

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
