import {
  isValidTileCode as baseIsValidTileCode,
  normalizeTileCode as baseNormalizeTileCode
} from "../tiles/tileCodes.js";

/**
 * Purpose: Normalize and validate manual tile input.
 * Description:
 * - Reuses canonical tile-code normalization from spike mapping.
 * - Validates 14-slot manual tile list with slot-level errors.
 * - Returns stable normalized payload for scoring flow.
 */
/**
 * Normalize one tile code to canonical representation.
 *
 * @param {string} code - Input tile code.
 * @returns {string}
 */
export function normalizeTileCode(code) {
  return baseNormalizeTileCode(code);
}

/**
 * Check whether tile code is valid after normalization.
 *
 * @param {string} code - Tile code.
 * @returns {boolean}
 */
export function isValidTileCode(code) {
  return baseIsValidTileCode(code);
}

/**
 * Normalize and validate manual 14-tile input list.
 *
 * @param {string[]} tiles - Raw tile code list.
 * @returns {{ok: boolean, tileCodes: string[], problems: string[]}}
 */
export function normalizeManualTiles(tiles) {
  if (!Array.isArray(tiles) || tiles.length !== 14) {
    return {
      ok: false,
      tileCodes: [],
      problems: ["tiles must contain 14 tile codes"]
    };
  }

  const tileCodes = [];
  const problems = [];
  for (let i = 0; i < tiles.length; i += 1) {
    const canonical = normalizeTileCode(tiles[i]);
    if (!isValidTileCode(canonical)) {
      problems.push(`tile_${i} invalid tile code: ${String(tiles[i])}`);
      continue;
    }
    tileCodes.push(canonical);
  }

  return {
    ok: problems.length === 0,
    tileCodes,
    problems
  };
}
