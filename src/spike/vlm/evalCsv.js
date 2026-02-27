/**
 * Purpose: Provide pure helpers to map spike JSON outputs into CSV fields.
 * Author: Luke WU
 */
import { isValidTileCode, normalizeTileCode } from "./tileCodes.js";

/**
 * Count invalid tile codes from output payload.
 * @param {unknown} tiles
 * @returns {number}
 */
export function countInvalidTiles(tiles) {
  if (!Array.isArray(tiles)) return 0;
  return tiles.filter((t) => !isValidTileCode(String(t))).length;
}

export function parseGroundTruthTiles(text) {
  const raw = String(text || "").trim();
  if (!raw) return [];
  return raw
    .split(/[\s|/]+/)
    .map((t) => normalizeTileCode(t.trim()))
    .filter((t) => t.length > 0);
}

function formatRatio(numerator, denominator) {
  if (!denominator) return "";
  return (numerator / denominator).toFixed(2);
}

function countIntersectionByMultiplicity(a, b) {
  const bag = new Map();
  for (const tile of b) bag.set(tile, (bag.get(tile) || 0) + 1);
  let matched = 0;
  for (const tile of a) {
    const left = bag.get(tile) || 0;
    if (left > 0) {
      matched += 1;
      bag.set(tile, left - 1);
    }
  }
  return matched;
}

function countTbTiles(tiles) {
  return tiles.filter((t) => /^[1-9][TB]$/.test(t)).length;
}

/**
 * Build auto-fill fields for evaluation CSV row.
 * @param {{ok?:boolean,code?:string,data?:{tiles?:string[],uncertainIndices?:number[]}}|null} result
 * @param {{groundTruthTiles?:string[]}} [options]
 * @returns {{run_cmd_ok:string,api_ok:string,tiles_len_14:string,invalid_tile_count:string,uncertain_count:string,error_code:string,exact_match_14:string,position_accuracy:string,tile_set_accuracy:string,tb_recall:string}}
 */
export function buildEvalFields(result, options = {}) {
  const gt = Array.isArray(options.groundTruthTiles) ? options.groundTruthTiles : [];
  if (!result) {
    return {
      run_cmd_ok: "N",
      api_ok: "N",
      tiles_len_14: "",
      invalid_tile_count: "",
      uncertain_count: "",
      error_code: "MISSING_RESULT",
      exact_match_14: "",
      position_accuracy: "",
      tile_set_accuracy: "",
      tb_recall: ""
    };
  }

  const ok = result.ok === true;
  const tiles = result?.data?.tiles;
  const uncertain = result?.data?.uncertainIndices;
  const pred = Array.isArray(tiles) ? tiles : [];
  const hasGt = gt.length > 0;
  const positionMatched = hasGt ? pred.filter((tile, i) => tile === gt[i]).length : 0;
  const setMatched = hasGt ? countIntersectionByMultiplicity(pred, gt) : 0;
  const gtTb = hasGt ? countTbTiles(gt) : 0;
  const predTbMatched = gtTb > 0 ? countIntersectionByMultiplicity(pred.filter((t) => /^[1-9][TB]$/.test(t)), gt.filter((t) => /^[1-9][TB]$/.test(t))) : 0;
  return {
    run_cmd_ok: "Y",
    api_ok: ok ? "Y" : "N",
    tiles_len_14: Array.isArray(tiles) && tiles.length === 14 ? "Y" : "N",
    invalid_tile_count: String(countInvalidTiles(tiles)),
    uncertain_count: Array.isArray(uncertain) ? String(uncertain.length) : "",
    error_code: ok ? "" : String(result.code || "UNKNOWN_ERROR"),
    exact_match_14: hasGt ? (pred.length === 14 && gt.length === 14 && positionMatched === 14 ? "Y" : "N") : "",
    position_accuracy: hasGt ? formatRatio(positionMatched, gt.length) : "",
    tile_set_accuracy: hasGt ? formatRatio(setMatched, gt.length) : "",
    tb_recall: gtTb > 0 ? formatRatio(predTbMatched, gtTb) : ""
  };
}
