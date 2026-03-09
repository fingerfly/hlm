import { isValidTileCode as baseIsValidTileCode, normalizeTileCode as baseNormalizeTileCode } from "../spike/vlm/tileCodes.js";

export function normalizeTileCode(code) {
  return baseNormalizeTileCode(code);
}

export function isValidTileCode(code) {
  return baseIsValidTileCode(code);
}

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
