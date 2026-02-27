/**
 * Purpose: Verify centralized Mahjong tile code mapping.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  ALL_TILE_CODES,
  ENCODING_VERSION,
  FLOWER_TILE_CODES,
  LEGACY_CODE_ALIASES,
  TILE_CODE_TO_LABEL,
  codeToId,
  decodeHandV1,
  decodeTiles,
  encodeHandV1,
  encodeTiles,
  idToCode,
  isValidTileCode,
  normalizeTileCode,
  tryCodeToId
} from "../../src/spike/vlm/tileCodes.js";

test("tile code mapping includes core and flower codes", () => {
  assert.equal(Array.isArray(ALL_TILE_CODES), true);
  assert.equal(ENCODING_VERSION, "v1");
  assert.equal(ALL_TILE_CODES.includes("1W"), true);
  assert.equal(ALL_TILE_CODES.includes("Wh"), true);
  assert.equal(ALL_TILE_CODES.includes("Ch"), true);
  assert.equal(ALL_TILE_CODES.includes("Ju"), true);
  assert.equal(FLOWER_TILE_CODES.length, 8);
});

test("isValidTileCode validates known and unknown codes", () => {
  assert.equal(isValidTileCode("7T"), true);
  assert.equal(isValidTileCode("La"), true);
  assert.equal(isValidTileCode("F1"), true);
  assert.equal(isValidTileCode("FLOWER"), false);
  assert.equal(isValidTileCode("10W"), false);
});

test("legacy aliases normalize to canonical flower codes", () => {
  assert.equal(LEGACY_CODE_ALIASES.F1, "Ch");
  assert.equal(LEGACY_CODE_ALIASES.J4, "Ju");
  assert.equal(normalizeTileCode("F1"), "Ch");
  assert.equal(normalizeTileCode("J2"), "La");
  assert.equal(normalizeTileCode("Wh"), "Wh");
});

test("codeToId and idToCode roundtrip canonical codes", () => {
  for (const code of ALL_TILE_CODES) {
    const id = codeToId(code);
    assert.equal(idToCode(id), code);
  }
});

test("tryCodeToId reports invalid codes without throwing", () => {
  const ok = tryCodeToId("Wh");
  assert.equal(ok.ok, true);
  assert.equal(typeof ok.id, "number");

  const fail = tryCodeToId("XYZ");
  assert.equal(fail.ok, false);
  assert.equal(fail.reason, "INVALID_TILE_CODE");
});

test("encodeTiles and decodeTiles roundtrip 14-tile hand", () => {
  const hand = ["1W", "2W", "3W", "4W", "5W", "6W", "7W", "8W", "9W", "E", "S", "Wn", "N", "Wh"];
  const encoded = encodeTiles(hand);
  assert.equal(encoded instanceof Uint8Array, true);
  assert.equal(encoded.length, 14);
  assert.deepEqual(decodeTiles(encoded), hand);
});

test("encodeHandV1 and decodeHandV1 roundtrip with mask", () => {
  const hand = ["1W", "2W", "3W", "4W", "5W", "6W", "7W", "8W", "9W", "E", "S", "Wn", "N", "Wh"];
  const encoded = encodeHandV1({ tiles: hand, uncertainIndices: [1, 12] });
  assert.equal(encoded.encodingVersion, "v1");
  assert.equal(encoded.uncertainMask, (1 << 1) | (1 << 12));
  assert.deepEqual(decodeHandV1(encoded), { tiles: hand, uncertainIndices: [1, 12] });
});

test("tile code mapping provides human-readable labels", () => {
  assert.equal(TILE_CODE_TO_LABEL["E"], "east wind");
  assert.equal(TILE_CODE_TO_LABEL["Wh"], "white dragon");
  assert.equal(TILE_CODE_TO_LABEL["Ch"], "spring");
  assert.equal(TILE_CODE_TO_LABEL["Ju"], "chrysanthemum");
});
