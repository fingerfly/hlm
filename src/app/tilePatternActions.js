/**
 * Purpose: Generate and validate quick pattern insert actions.
 * Description:
 * - Builds single/pair/pung/chow tile sequences from one base tile.
 * - Validates slot space and per-tile copy limits before insert.
 * - Returns deterministic rejection reasons for UI feedback.
 */
const HONOR_TILES = new Set(["E", "S", "Wn", "N", "R", "G", "Wh"]);
const SUITED = new Set(["W", "T", "B"]);
const MAX_SLOTS = 14;
const MAX_TILE_COPIES = 4;

export const QUICK_ACTIONS = Object.freeze([
  "single",
  "pair",
  "pung",
  "chow_front",
  "chow_middle",
  "chow_back"
]);

function tileSuit(tileCode) {
  const suit = tileCode.slice(-1);
  return SUITED.has(suit) ? suit : null;
}

function tileRank(tileCode) {
  const suit = tileSuit(tileCode);
  if (!suit) return null;
  return Number.parseInt(tileCode[0], 10);
}

function isCanonicalTileCode(tileCode) {
  if (HONOR_TILES.has(tileCode)) return true;
  const suit = tileSuit(tileCode);
  if (!suit) return false;
  const rank = tileRank(tileCode);
  return Number.isInteger(rank) && rank >= 1 && rank <= 9;
}

function countTiles(tiles) {
  const map = new Map();
  for (const tile of tiles) {
    map.set(tile, (map.get(tile) || 0) + 1);
  }
  return map;
}

function remainingSlots(state) {
  return MAX_SLOTS - state.slots.filter(Boolean).length;
}

function chowTiles(baseTile, variant) {
  const suit = tileSuit(baseTile);
  if (!suit) {
    return { ok: false, reason: "chow_requires_suited_tile", tiles: [] };
  }
  const rank = tileRank(baseTile);
  if (!Number.isInteger(rank)) {
    return { ok: false, reason: "invalid_tile_code", tiles: [] };
  }
  if (variant === "chow_front") {
    if (rank > 7) {
      return { ok: false, reason: "chow_rank_out_of_range", tiles: [] };
    }
    return {
      ok: true,
      reason: null,
      tiles: [`${rank}${suit}`, `${rank + 1}${suit}`, `${rank + 2}${suit}`]
    };
  }
  if (variant === "chow_middle") {
    if (rank < 2 || rank > 8) {
      return { ok: false, reason: "chow_rank_out_of_range", tiles: [] };
    }
    return {
      ok: true,
      reason: null,
      tiles: [`${rank - 1}${suit}`, `${rank}${suit}`, `${rank + 1}${suit}`]
    };
  }
  if (variant === "chow_back") {
    if (rank < 3) {
      return { ok: false, reason: "chow_rank_out_of_range", tiles: [] };
    }
    return {
      ok: true,
      reason: null,
      tiles: [`${rank - 2}${suit}`, `${rank - 1}${suit}`, `${rank}${suit}`]
    };
  }
  return { ok: false, reason: "unknown_action", tiles: [] };
}

/**
 * Build tile sequence from one action id and base tile.
 *
 * @param {string} baseTile - Canonical tile code.
 * @param {string} actionId - Quick action id.
 * @returns {{ok: boolean, reason: string|null, tiles: string[]}}
 */
export function buildActionTiles(baseTile, actionId) {
  if (!isCanonicalTileCode(baseTile)) {
    return { ok: false, reason: "invalid_tile_code", tiles: [] };
  }
  if (actionId === "single") {
    return { ok: true, reason: null, tiles: [baseTile] };
  }
  if (actionId === "pair") {
    return { ok: true, reason: null, tiles: [baseTile, baseTile] };
  }
  if (actionId === "pung") {
    return { ok: true, reason: null, tiles: [baseTile, baseTile, baseTile] };
  }
  return chowTiles(baseTile, actionId);
}

/**
 * Resolve pattern action against current picker state.
 *
 * @param {{slots: string[]}} state - Picker state.
 * @param {string} baseTile - Canonical tile code.
 * @param {string} actionId - Quick action id.
 * @returns {{ok: boolean, reason: string|null, tiles: string[]}}
 */
export function resolvePatternAction(state, baseTile, actionId) {
  const built = buildActionTiles(baseTile, actionId);
  if (!built.ok) return built;

  if (built.tiles.length > remainingSlots(state)) {
    return { ok: false, reason: "insufficient_slots", tiles: [] };
  }

  const existing = countTiles(state.slots.filter(Boolean));
  const delta = countTiles(built.tiles);
  for (const [tile, needed] of delta.entries()) {
    const total = (existing.get(tile) || 0) + needed;
    if (total > MAX_TILE_COPIES) {
      return { ok: false, reason: "tile_copy_limit", tiles: [] };
    }
  }
  return built;
}
