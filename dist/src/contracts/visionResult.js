/**
 * Purpose: Normalize and validate model vision result payload.
 * Description:
 * - Validates status/source enums and slot counts.
 * - Normalizes candidate labels, scores, and uncertainty indices.
 * - Returns deterministic ok/data or problems contract.
 */
const ALLOWED_STATUS = new Set(["accepted", "need_human_confirm", "failed"]);
const ALLOWED_SOURCE = new Set(["model", "human"]);

function asNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function normalizeCandidates(candidates, finalLabel) {
  const out = [];
  const seen = new Set();
  const source = Array.isArray(candidates) ? candidates : [];
  for (const item of source) {
    const label = String(item?.label || "").trim();
    if (!label || seen.has(label)) continue;
    seen.add(label);
    const score = asNumber(item?.score);
    out.push({
      label,
      score: Number.isFinite(score)
        ? Math.max(0, Math.min(1, score))
        : 0
    });
  }
  if (finalLabel && !seen.has(finalLabel)) {
    out.push({ label: finalLabel, score: 1 });
  }
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, 3);
}

function normalizeUncertainIndices(indices) {
  if (!Array.isArray(indices)) {
    return {
      ok: false,
      value: [],
      problem: "uncertainIndices must be an array"
    };
  }
  const cleaned = [...new Set(indices)];
  if (!cleaned.every((i) => Number.isInteger(i) && i >= 0 && i <= 13)) {
    return {
      ok: false,
      value: [],
      problem: "uncertainIndices must be integers in 0..13"
    };
  }
  cleaned.sort((a, b) => a - b);
  return { ok: true, value: cleaned };
}

/**
 * Normalize raw vision result into contract-safe shape.
 *
 * @param {object} [input={}] - Raw provider payload.
 * @returns {{ok: boolean, data?: object, problems?: string[]}}
 */
export function normalizeVisionResult(input = {}) {
  const problems = [];
  const status = String(input.status || "").trim();
  if (!ALLOWED_STATUS.has(status)) {
    problems.push("status must be accepted|need_human_confirm|failed");
  }

  if (!Array.isArray(input.tiles) || input.tiles.length !== 14) {
    problems.push("tiles must contain 14 slots");
  }

  const uncertain = normalizeUncertainIndices(input.uncertainIndices || []);
  if (!uncertain.ok) problems.push(uncertain.problem);

  if (problems.length > 0) return { ok: false, problems };

  const tiles = input.tiles.map((tile, index) => {
    const finalLabel = String(tile?.finalLabel || tile?.label || "").trim();
    const confidenceRaw = asNumber(tile?.confidence);
    const confidence = Number.isFinite(confidenceRaw)
      ? Math.max(0, Math.min(1, confidenceRaw))
      : 0;
    const source = ALLOWED_SOURCE.has(tile?.source) ? tile.source : "model";
    return {
      index,
      finalLabel,
      confidence,
      candidates: normalizeCandidates(tile?.candidates, finalLabel),
      source
    };
  });

  return {
    ok: true,
    data: {
      status,
      tiles,
      uncertainIndices: uncertain.value
    }
  };
}
