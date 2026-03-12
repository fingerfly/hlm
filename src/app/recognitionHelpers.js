/**
 * Purpose: Shared helpers for recognition normalization flows.
 * Description:
 * - Normalizes human-confirmed tile map input.
 * - Builds merged tile entries for human overrides.
 * - Provides common tile-code and missing-index derivations.
 */
/**
 * Normalize confirmed tiles into index->label map.
 *
 * @param {object|Array<string>|undefined} confirmedTiles
 * @returns {Map<number, string>}
 */
export function normalizeConfirmedTileMap(confirmedTiles) {
  const map = new Map();
  if (!confirmedTiles) return map;
  if (Array.isArray(confirmedTiles)) {
    for (let i = 0; i < confirmedTiles.length; i += 1) {
      const label = String(confirmedTiles[i] || "").trim();
      if (label) map.set(i, label);
    }
    return map;
  }
  for (const [rawIndex, rawLabel] of Object.entries(confirmedTiles)) {
    const index = Number(rawIndex);
    const label = String(rawLabel || "").trim();
    const validIndex = Number.isInteger(index) && index >= 0 && index <= 13;
    if (validIndex && label) map.set(index, label);
  }
  return map;
}

/**
 * Build one tile object after human confirmation override.
 *
 * @param {object} tile - Original tile object.
 * @param {string} label - Confirmed label.
 * @returns {object}
 */
export function buildHumanConfirmedTile(tile, label) {
  const candidates = Array.isArray(tile.candidates) ? tile.candidates : [];
  return {
    ...tile,
    label,
    finalLabel: label,
    source: "human",
    candidates: [
      { label, score: 1 },
      ...candidates.filter((item) => item?.label !== label)
    ].slice(0, 3)
  };
}

/**
 * Convert tile array into plain tile-code list.
 *
 * @param {{label?: string}[]} tiles - Tile list.
 * @returns {string[]}
 */
export function toTileCodes(tiles) {
  return tiles.map((tile) => tile?.label).filter(Boolean);
}

/**
 * Remove confirmed indices from recognition missing list.
 *
 * @param {number[]|undefined} missingIndices - Existing missing list.
 * @param {Map<number, string>} confirmedMap - Confirmed map.
 * @returns {number[]}
 */
export function getRemainingMissingIndices(missingIndices, confirmedMap) {
  return (missingIndices || []).filter((index) => !confirmedMap.has(index));
}
