/**
 * Purpose: Apply sports-authority base + basic-fan settlement deltas.
 * Description:
 * - Implements zimo (three equal payers) and dianhe (discarder + two base).
 * - Mutates a seat-keyed delta map in place.
 * - Uses officialBasePoint from ruleConfig.settlement.
 */

const SEATS = Object.freeze(["E", "S", "W", "N"]);

function asInt(value, fallback = 0) {
  const n = Number.parseInt(String(value), 10);
  if (!Number.isInteger(n)) return fallback;
  return n;
}

/**
 * Add official base + fan payments into deltas (four-seat map).
 *
 * @param {Record<string, number>} deltas - Mutable E/S/W/N deltas.
 * @param {"zimo"|"dianhe"} winType
 * @param {string} winnerSeat
 * @param {string|null} discarderSeat
 * @param {number} totalFan
 * @param {object} ruleConfig
 */
export function applyOfficialBaseFanDeltas(
  deltas,
  winType,
  winnerSeat,
  discarderSeat,
  totalFan,
  ruleConfig
) {
  const base = Math.max(
    1,
    asInt(ruleConfig?.settlement?.officialBasePoint, 8)
  );
  const basic = Math.max(0, asInt(totalFan, 0));
  const unit = base + basic;
  if (winType === "dianhe") {
    deltas[winnerSeat] += unit + base + base;
    deltas[discarderSeat] -= unit;
    for (const seat of SEATS) {
      if (seat === winnerSeat || seat === discarderSeat) continue;
      deltas[seat] -= base;
    }
  } else {
    for (const seat of SEATS) {
      if (seat === winnerSeat) deltas[seat] += 3 * unit;
      else deltas[seat] -= unit;
    }
  }
}
