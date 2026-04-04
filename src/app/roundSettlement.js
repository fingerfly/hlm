/**
 * Purpose: Compute four-player settlement deltas per hand.
 * Description:
 * - Validates seat roles and normalizes player score rows.
 * - Computes per-seat deltas for zimo and dianhe by total fan.
 * - Produces before/delta/after rows with conservation check.
 */

import { SETTLEMENT_MODES } from "../config/scoreRuleConfig.js";
import { applyOfficialBaseFanDeltas } from "./officialBaseFanSettlement.js";

const SEATS = Object.freeze(["E", "S", "W", "N"]);

function asInt(value, fallback = 0) {
  const n = Number.parseInt(String(value), 10);
  if (!Number.isInteger(n)) return fallback;
  return n;
}

function validateSeat(seat) {
  return SEATS.includes(seat);
}

function resolvePointFromFan(totalFan, ruleConfig) {
  const fanToPoint = ruleConfig?.fanToPoint || {};
  if (fanToPoint.mode === "table") {
    const table = fanToPoint.table?.byFan || {};
    const raw = table[String(totalFan)];
    return Math.max(0, asInt(raw, 0));
  }
  const linear = fanToPoint.linear || {};
  const perFan = Math.max(1, asInt(linear.pointPerFan, 1));
  let point = totalFan * perFan;
  const minPoint = Math.max(0, asInt(linear.minPoint, 0));
  const maxRaw = linear.maxPoint;
  const maxPoint = maxRaw == null ? null : Math.max(0, asInt(maxRaw, 0));
  if (point < minPoint) point = minPoint;
  if (maxPoint != null && point > maxPoint) point = maxPoint;
  return point;
}

function normalizePlayers(players = []) {
  const map = new Map();
  for (const item of players) {
    if (!item || !validateSeat(item.seat)) continue;
    map.set(item.seat, {
      seat: item.seat,
      name: item.name || item.seat,
      score: asInt(item.score, 0)
    });
  }
  const rows = [];
  for (const seat of SEATS) {
    rows.push(map.get(seat) || { seat, name: seat, score: 0 });
  }
  return rows;
}

/**
 * Compute one-hand settlement and return next round scores.
 *
 * @param {object} input - Settlement inputs.
 * @returns {{ok: boolean, rows: object[], nextPlayers: object[],
 *   sumDelta: number, problems: string[]}}
 */
export function computeRoundSettlement(input = {}) {
  const players = normalizePlayers(input.players);
  const winType = input.winType === "dianhe" ? "dianhe" : "zimo";
  const winnerSeat = input.winnerSeat;
  const discarderSeat = input.discarderSeat || null;
  const totalFan = Math.max(0, asInt(input.totalFan, 0));
  const ruleConfig = input.ruleConfig || null;
  const isWin = input.isWin === true;
  const problems = [];
  if (!validateSeat(winnerSeat)) {
    problems.push("winnerSeat must be one of E/S/W/N");
  }
  if (
    winType === "dianhe" &&
    (!validateSeat(discarderSeat) || discarderSeat === winnerSeat)
  ) {
    problems.push("discarderSeat must be one of E/S/W/N and not winnerSeat");
  }
  const deltas = { E: 0, S: 0, W: 0, N: 0 };
  const official =
    ruleConfig?.settlement?.mode === SETTLEMENT_MODES.OFFICIAL_BASE_FAN;
  if (problems.length === 0 && isWin && totalFan > 0) {
    if (official) {
      applyOfficialBaseFanDeltas(
        deltas,
        winType,
        winnerSeat,
        discarderSeat,
        totalFan,
        ruleConfig
      );
    } else {
      const point = resolvePointFromFan(totalFan, ruleConfig);
      const dist = ruleConfig?.distribution || {};
      const zimoWinMul = Math.max(1, asInt(dist.zimo?.winnerMultiplier, 3));
      const zimoLoseMul = Math.max(1, asInt(dist.zimo?.loserMultiplier, 1));
      const dhWinMul = Math.max(1, asInt(dist.dianhe?.winnerMultiplier, 1));
      const dhLoseMul = Math.max(
        1,
        asInt(dist.dianhe?.discarderMultiplier, 1)
      );
      if (winType === "dianhe") {
        deltas[winnerSeat] += point * dhWinMul;
        deltas[discarderSeat] -= point * dhLoseMul;
      } else {
        deltas[winnerSeat] += point * zimoWinMul;
        for (const seat of SEATS) {
          if (seat !== winnerSeat) deltas[seat] -= point * zimoLoseMul;
        }
      }
    }
  }
  const rows = players.map((player) => {
    const delta = deltas[player.seat] || 0;
    return {
      seat: player.seat,
      name: player.name,
      scoreBefore: player.score,
      delta,
      scoreAfter: player.score + delta
    };
  });
  const sumDelta = rows.reduce((sum, row) => sum + row.delta, 0);
  if (sumDelta !== 0) problems.push("delta sum must be 0");
  const nextPlayers = rows.map((row) => ({
    seat: row.seat,
    name: row.name,
    score: row.scoreAfter
  }));
  return {
    ok: problems.length === 0,
    rows,
    nextPlayers,
    sumDelta,
    problems
  };
}

/**
 * Return default 4-seat players used by startup setup.
 *
 * @returns {{seat: string, name: string, score: number}[]}
 */
export function createDefaultRoundPlayers() {
  return [
    { seat: "E", name: "东家", score: 0 },
    { seat: "S", name: "南家", score: 0 },
    { seat: "W", name: "西家", score: 0 },
    { seat: "N", name: "北家", score: 0 }
  ];
}
