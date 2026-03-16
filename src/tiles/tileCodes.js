/**
 * Purpose: Store centralized Mahjong tile code mapping.
 * Author: Luke WU
 */
import {
  ALL_TILE_CODES,
  CODE_TO_ID,
  ENCODING_VERSION,
  FLOWER_TILE_CODES,
  LEGACY_CODE_ALIASES,
  TILE_CODE_SET,
  TILE_CODE_TO_LABEL
} from "./tileCatalog.js";
import {
  decodeHandV1 as decodeHandV1Core,
  decodeTiles as decodeTilesCore,
  encodeHandV1 as encodeHandV1Core,
  encodeTiles as encodeTilesCore,
  indicesToMask,
  maskToIndices
} from "./tileEncoding.js";

export {
  ALL_TILE_CODES,
  ENCODING_VERSION,
  FLOWER_TILE_CODES,
  indicesToMask,
  LEGACY_CODE_ALIASES,
  maskToIndices,
  TILE_CODE_TO_LABEL
};

export function isValidTileCode(code) {
  const canonical = normalizeTileCode(code);
  return TILE_CODE_SET.has(canonical);
}

export function normalizeTileCode(code) {
  const raw = String(code || "").trim();
  return LEGACY_CODE_ALIASES[raw] || raw;
}

export function tryCodeToId(code) {
  const canonical = normalizeTileCode(code);
  if (!TILE_CODE_SET.has(canonical)) {
    return {
      ok: false,
      id: null,
      code: canonical,
      reason: "INVALID_TILE_CODE"
    };
  }
  return {
    ok: true,
    id: CODE_TO_ID.get(canonical),
    code: canonical,
    reason: ""
  };
}

export function codeToId(code) {
  const out = tryCodeToId(code);
  if (!out.ok) {
    const err = new Error(`invalid tile code: ${code}`);
    err.code = out.reason;
    throw err;
  }
  return out.id;
}

export function tryIdToCode(id) {
  if (!Number.isInteger(id) || id < 0 || id >= ALL_TILE_CODES.length) {
    return { ok: false, code: "", reason: "INVALID_TILE_ID" };
  }
  return { ok: true, code: ALL_TILE_CODES[id], reason: "" };
}

export function idToCode(id) {
  const out = tryIdToCode(id);
  if (!out.ok) {
    const err = new Error(`invalid tile id: ${id}`);
    err.code = out.reason;
    throw err;
  }
  return out.code;
}

export function encodeTiles(codes) {
  return encodeTilesCore(codes, codeToId);
}

export function decodeTiles(ids) {
  return decodeTilesCore(ids, idToCode);
}

export function encodeHandV1({ tiles, uncertainIndices = [] }) {
  return encodeHandV1Core({ tiles, uncertainIndices }, codeToId);
}

export function decodeHandV1({ encodingVersion, tileIds, uncertainMask }) {
  return decodeHandV1Core(
    { encodingVersion, tileIds, uncertainMask },
    idToCode
  );
}

export function getAllowedTileCodesPromptText() {
  return ALL_TILE_CODES.join(",");
}
