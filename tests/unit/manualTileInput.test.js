import test from "node:test";
import assert from "node:assert/strict";
import { isValidTileCode, normalizeTileCode, normalizeManualTiles } from "../../src/app/manualTileInput.js";

const winningTiles = [
  "1W", "1W", "1W",
  "2W", "3W", "4W",
  "5W", "6W", "7W",
  "2T", "3T", "4T",
  "9B", "9B"
];

test("normalizeTileCode trims and maps legacy aliases", () => {
  assert.equal(normalizeTileCode(" 1W "), "1W");
  assert.equal(normalizeTileCode("F1"), "Ch");
  assert.equal(normalizeTileCode("J4"), "Ju");
});

test("isValidTileCode returns false for unknown code", () => {
  assert.equal(isValidTileCode("1W"), true);
  assert.equal(isValidTileCode("bad"), false);
});

test("normalizeManualTiles accepts valid 14-slot input", () => {
  const out = normalizeManualTiles(winningTiles);
  assert.equal(out.ok, true);
  assert.equal(out.tileCodes.length, 14);
  assert.deepEqual(out.problems, []);
});

test("normalizeManualTiles rejects non-14 input length", () => {
  const out = normalizeManualTiles(winningTiles.slice(0, 13));
  assert.equal(out.ok, false);
  assert.match(out.problems[0], /14/);
});

test("normalizeManualTiles reports slot-level invalid code", () => {
  const badTiles = [...winningTiles];
  badTiles[4] = "??";
  const out = normalizeManualTiles(badTiles);
  assert.equal(out.ok, false);
  assert.equal(out.problems.some((p) => p.includes("tile_4")), true);
});

test("normalizeManualTiles canonicalizes legacy flower aliases", () => {
  const tiles = [...winningTiles];
  tiles[0] = "F1";
  tiles[1] = "J2";
  const out = normalizeManualTiles(tiles);
  assert.equal(out.ok, true);
  assert.equal(out.tileCodes[0], "Ch");
  assert.equal(out.tileCodes[1], "La");
});
