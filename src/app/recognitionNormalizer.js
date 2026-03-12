import { normalizeVisionResult } from "../contracts/visionResult.js";
import {
  buildHumanConfirmedTile,
  getRemainingMissingIndices,
  normalizeConfirmedTileMap,
  toTileCodes
} from "./recognitionHelpers.js";

/**
 * Purpose: Normalize recognition payloads for scoring pipeline.
 * Description:
 * - Applies human-confirmed tile overrides by index.
 * - Converts failed/partial outputs into stable contract shape.
 * - Produces evaluation-safe recognition object or typed error.
 */
/**
 * Apply manual tile confirmations to recognition result.
 *
 * @param {object} recognition - Recognition payload.
 * @param {object|Array<string>} confirmedTiles - Human confirmations.
 * @returns {object}
 */
export function applyConfirmedTiles(recognition, confirmedTiles) {
  const confirmedMap = normalizeConfirmedTileMap(confirmedTiles);
  if (confirmedMap.size === 0) {
    return {
      ...recognition,
      tileCodes: toTileCodes(recognition.tiles)
    };
  }
  const tiles = recognition.tiles.map((tile, index) => {
    if (!confirmedMap.has(index)) return { ...tile };
    return buildHumanConfirmedTile(tile, confirmedMap.get(index));
  });
  const missingIndices = getRemainingMissingIndices(
    recognition.missingIndices,
    confirmedMap
  );
  return {
    ...recognition,
    status: missingIndices.length > 0 ? "need_human_confirm" : "accepted",
    missingIndices,
    tiles,
    tileCodes: toTileCodes(tiles)
  };
}

/**
 * Normalize recognition object for downstream evaluation.
 *
 * @param {object} recognition - Raw or partially normalized recognition.
 * @returns {{ok: boolean, code?: string, problems?: string[],
 *   recognition: object}}
 */
export function normalizeRecognitionForEvaluation(recognition) {
  if (recognition?.status === "failed") {
    const safeTiles = Array.isArray(recognition?.tiles)
      ? recognition.tiles
      : [];
    return {
      ok: false,
      code: "RECOGNITION_FAILED",
      problems: ["recognition failed before validation"],
      recognition: {
        status: "failed",
        tiles: safeTiles,
        missingIndices: Array.isArray(recognition?.missingIndices)
          ? recognition.missingIndices
          : [],
        tileCodes: toTileCodes(safeTiles)
      }
    };
  }
  const normalized = normalizeVisionResult({
    status: recognition?.status,
    tiles: recognition?.tiles,
    uncertainIndices: Array.isArray(recognition?.missingIndices)
      ? recognition.missingIndices
      : []
  });
  if (!normalized.ok) {
    return {
      ok: false,
      code: "RECOGNITION_INVALID",
      problems: normalized.problems,
      recognition: {
        status: "failed",
        tiles: [],
        missingIndices: [],
        tileCodes: []
      }
    };
  }
  const tiles = normalized.data.tiles.map((tile) => ({
    label: tile.finalLabel,
    finalLabel: tile.finalLabel,
    confidence: tile.confidence,
    candidates: tile.candidates,
    source: tile.source
  }));
  return {
    ok: true,
    recognition: {
      status: normalized.data.status,
      tiles,
      missingIndices: normalized.data.uncertainIndices,
      tileCodes: toTileCodes(tiles)
    }
  };
}
