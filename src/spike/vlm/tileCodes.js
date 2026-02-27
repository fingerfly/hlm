/**
 * Purpose: Store centralized Mahjong tile code mapping.
 * Author: Luke WU
 */

const WAN = ["1W", "2W", "3W", "4W", "5W", "6W", "7W", "8W", "9W"];
const TIAO = ["1T", "2T", "3T", "4T", "5T", "6T", "7T", "8T", "9T"];
const TONG = ["1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B"];
const WINDS = ["E", "S", "Wn", "N"];
const DRAGONS = ["R", "G", "Wh"];

export const ENCODING_VERSION = "v1";
export const FLOWER_TILE_CODES = ["Ch", "Xi", "Qi", "Do", "Mm", "La", "Zh", "Ju"];
export const ALL_TILE_CODES = Object.freeze([...WAN, ...TIAO, ...TONG, ...WINDS, ...DRAGONS, ...FLOWER_TILE_CODES]);
export const LEGACY_CODE_ALIASES = Object.freeze({
  F1: "Ch",
  F2: "Xi",
  F3: "Qi",
  F4: "Do",
  J1: "Mm",
  J2: "La",
  J3: "Zh",
  J4: "Ju"
});

export const TILE_CODE_TO_LABEL = Object.freeze({
  "1W": "one wan",
  "2W": "two wan",
  "3W": "three wan",
  "4W": "four wan",
  "5W": "five wan",
  "6W": "six wan",
  "7W": "seven wan",
  "8W": "eight wan",
  "9W": "nine wan",
  "1T": "one tiao",
  "2T": "two tiao",
  "3T": "three tiao",
  "4T": "four tiao",
  "5T": "five tiao",
  "6T": "six tiao",
  "7T": "seven tiao",
  "8T": "eight tiao",
  "9T": "nine tiao",
  "1B": "one tong",
  "2B": "two tong",
  "3B": "three tong",
  "4B": "four tong",
  "5B": "five tong",
  "6B": "six tong",
  "7B": "seven tong",
  "8B": "eight tong",
  "9B": "nine tong",
  E: "east wind",
  S: "south wind",
  Wn: "west wind",
  N: "north wind",
  R: "red dragon",
  G: "green dragon",
  Wh: "white dragon",
  Ch: "spring",
  Xi: "summer",
  Qi: "autumn",
  Do: "winter",
  Mm: "plum blossom",
  La: "orchid",
  Zh: "bamboo flower",
  Ju: "chrysanthemum"
});

const TILE_CODE_SET = new Set(ALL_TILE_CODES);
const CODE_TO_ID = new Map(ALL_TILE_CODES.map((code, id) => [code, id]));

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
    return { ok: false, id: null, code: canonical, reason: "INVALID_TILE_CODE" };
  }
  return { ok: true, id: CODE_TO_ID.get(canonical), code: canonical, reason: "" };
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
  if (!Array.isArray(codes) || codes.length !== 14) {
    const err = new Error("tiles must be length 14");
    err.code = "INVALID_TILE_ARRAY_LENGTH";
    throw err;
  }
  return Uint8Array.from(codes.map((code) => codeToId(code)));
}

export function decodeTiles(ids) {
  if (!Array.isArray(ids) && !(ids instanceof Uint8Array)) {
    const err = new Error("tile ids must be an array");
    err.code = "INVALID_TILE_ID_ARRAY";
    throw err;
  }
  if (ids.length !== 14) {
    const err = new Error("tile ids must be length 14");
    err.code = "INVALID_TILE_ARRAY_LENGTH";
    throw err;
  }
  return Array.from(ids, (id) => idToCode(id));
}

export function indicesToMask(indices) {
  if (!Array.isArray(indices)) {
    const err = new Error("indices must be an array");
    err.code = "INVALID_UNCERTAIN_INDEX";
    throw err;
  }
  let mask = 0;
  for (const index of indices) {
    if (!Number.isInteger(index) || index < 0 || index > 13) {
      const err = new Error(`invalid uncertain index: ${index}`);
      err.code = "INVALID_UNCERTAIN_INDEX";
      throw err;
    }
    mask |= (1 << index);
  }
  return mask;
}

export function maskToIndices(mask) {
  if (!Number.isInteger(mask) || mask < 0 || mask > 0x3fff) {
    const err = new Error(`invalid uncertain mask: ${mask}`);
    err.code = "INVALID_UNCERTAIN_MASK";
    throw err;
  }
  const out = [];
  for (let i = 0; i < 14; i += 1) {
    if (mask & (1 << i)) out.push(i);
  }
  return out;
}

export function encodeHandV1({ tiles, uncertainIndices = [] }) {
  return {
    encodingVersion: ENCODING_VERSION,
    tileIds: encodeTiles(tiles),
    uncertainMask: indicesToMask(uncertainIndices)
  };
}

export function decodeHandV1({ encodingVersion, tileIds, uncertainMask }) {
  if (encodingVersion !== ENCODING_VERSION) {
    const err = new Error(`unsupported encoding version: ${encodingVersion}`);
    err.code = "UNSUPPORTED_ENCODING_VERSION";
    throw err;
  }
  return {
    tiles: decodeTiles(tileIds),
    uncertainIndices: maskToIndices(uncertainMask)
  };
}

export function getAllowedTileCodesPromptText() {
  return ALL_TILE_CODES.join(",");
}
