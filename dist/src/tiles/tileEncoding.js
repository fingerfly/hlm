/**
 * Purpose: Provide compact hand encoding helpers for tile ids and masks.
 * Description:
 * - Converts 14-tile code arrays to/from id arrays.
 * - Converts uncertain index arrays to/from 14-bit masks.
 * - Wraps full v1 hand payload encode/decode operations.
 */
import { ENCODING_VERSION } from "./tileCatalog.js";

function createCodedError(message, code) {
  const err = new Error(message);
  err.code = code;
  return err;
}

/**
 * Encode canonical tile codes into Uint8Array ids.
 *
 * @param {string[]} codes - Canonical tile-code array of length 14.
 * @param {(code: string) => number} codeToId - Code lookup callback.
 * @returns {Uint8Array}
 * @throws {Error}
 */
export function encodeTiles(codes, codeToId) {
  if (!Array.isArray(codes) || codes.length !== 14) {
    throw createCodedError(
      "tiles must be length 14",
      "INVALID_TILE_ARRAY_LENGTH"
    );
  }
  return Uint8Array.from(codes.map((code) => codeToId(code)));
}

/**
 * Decode tile ids into canonical tile codes.
 *
 * @param {Array<number>|Uint8Array} ids - Tile id array length 14.
 * @param {(id: number) => string} idToCode - Id lookup callback.
 * @returns {string[]}
 * @throws {Error}
 */
export function decodeTiles(ids, idToCode) {
  if (!Array.isArray(ids) && !(ids instanceof Uint8Array)) {
    throw createCodedError(
      "tile ids must be an array",
      "INVALID_TILE_ID_ARRAY"
    );
  }
  if (ids.length !== 14) {
    throw createCodedError(
      "tile ids must be length 14",
      "INVALID_TILE_ARRAY_LENGTH"
    );
  }
  return Array.from(ids, (id) => idToCode(id));
}

/**
 * Pack uncertain index array into 14-bit mask.
 *
 * @param {number[]} indices - Uncertain indices in range 0..13.
 * @returns {number}
 * @throws {Error}
 */
export function indicesToMask(indices) {
  if (!Array.isArray(indices)) {
    throw createCodedError(
      "indices must be an array",
      "INVALID_UNCERTAIN_INDEX"
    );
  }
  let mask = 0;
  for (const index of indices) {
    if (!Number.isInteger(index) || index < 0 || index > 13) {
      throw createCodedError(
        `invalid uncertain index: ${index}`,
        "INVALID_UNCERTAIN_INDEX"
      );
    }
    mask |= (1 << index);
  }
  return mask;
}

/**
 * Expand 14-bit uncertain mask into index list.
 *
 * @param {number} mask - Uncertain bitmask.
 * @returns {number[]}
 * @throws {Error}
 */
export function maskToIndices(mask) {
  if (!Number.isInteger(mask) || mask < 0 || mask > 0x3fff) {
    throw createCodedError(
      `invalid uncertain mask: ${mask}`,
      "INVALID_UNCERTAIN_MASK"
    );
  }
  const out = [];
  for (let i = 0; i < 14; i += 1) {
    if (mask & (1 << i)) out.push(i);
  }
  return out;
}

/**
 * Encode v1 payload from tile codes and uncertain indices.
 *
 * @param {{tiles: string[], uncertainIndices?: number[]}} input
 * @param {(code: string) => number} codeToId - Code lookup callback.
 * @returns {{encodingVersion: string, tileIds: Uint8Array,
 *   uncertainMask: number}}
 */
export function encodeHandV1(input, codeToId) {
  return {
    encodingVersion: ENCODING_VERSION,
    tileIds: encodeTiles(input.tiles, codeToId),
    uncertainMask: indicesToMask(input.uncertainIndices || [])
  };
}

/**
 * Decode v1 payload into tile codes and uncertain indices.
 *
 * @param {{encodingVersion: string, tileIds: Array<number>|Uint8Array,
 *   uncertainMask: number}} input
 * @param {(id: number) => string} idToCode - Id lookup callback.
 * @returns {{tiles: string[], uncertainIndices: number[]}}
 * @throws {Error}
 */
export function decodeHandV1(input, idToCode) {
  if (input.encodingVersion !== ENCODING_VERSION) {
    throw createCodedError(
      `unsupported encoding version: ${input.encodingVersion}`,
      "UNSUPPORTED_ENCODING_VERSION"
    );
  }
  if (!input.tileIds || input.tileIds.length !== 14) {
    throw createCodedError(
      "tile ids must be length 14",
      "INVALID_TILE_ARRAY_LENGTH"
    );
  }
  return {
    tiles: decodeTiles(input.tileIds, idToCode),
    uncertainIndices: maskToIndices(input.uncertainMask)
  };
}
