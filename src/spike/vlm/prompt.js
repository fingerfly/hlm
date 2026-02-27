/**
 * Purpose: Build strict DeepSeek prompt for Mahjong tile JSON extraction.
 * Author: Luke WU
 */
import { getAllowedTileCodesPromptText } from "./tileCodes.js";
/**
 * Create prompt text with strict output schema requirement.
 * @returns {string}
 */
export function buildSpikePrompt() {
  const allowedCodes = getAllowedTileCodesPromptText();
  return [
    "You are an OCR+vision parser for Chinese Mahjong tiles.",
    "Return ONLY JSON with keys: tiles, confidences, uncertainIndices.",
    "tiles must contain exactly 14 tile codes.",
    "Never return fewer or more than 14 tiles.",
    "If any tile is hard to read, still output your best 14-tile guess and include that position in uncertainIndices.",
    `Allowed tile codes: ${allowedCodes}.`,
    "Recognize each tile independently from left to right; do not infer missing tiles from sequence continuity.",
    "For each tile, decide suit first: W, T, B, Honor, or Flower; then decide rank/symbol.",
    "Use this T vs B rule: T has elongated bamboo stems with joints; B has round circle pips (single or concentric rings).",
    "When circles are clearly visible, prefer B over T.",
    "When stems are clearly visible, prefer T over B.",
    "Honor and Flower tiles usually contain Chinese characters and symbolic drawings; do not map them to W/T/B by sequence pattern.",
    "Use uncertainIndices sparingly: include an index only when visual evidence is genuinely ambiguous and likely wrong.",
    "When confidence for a tile is >= 0.75 and visual features are clear, do not include that index in uncertainIndices.",
    "If uncertain between T and B, choose best guess and include the index only if ambiguity remains after visual checks.",
    "confidences must be 14 numbers in range 0..1.",
    "uncertainIndices must be zero-based indexes of uncertain tiles."
  ].join(" ");
}
