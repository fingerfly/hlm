import test from "node:test";
import assert from "node:assert/strict";
import {
  validateWin,
  enumerateStandardWinGroups
} from "../../src/rules/winValidator.js";

test("validateWin returns standard pattern for 4 meld + 1 pair", () => {
  const tiles = ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "9B"];
  const result = validateWin(tiles);
  assert.equal(result.isWin, true);
  assert.equal(result.pattern, "standard");
  assert.equal(Array.isArray(result.meldGroups), true);
  assert.equal(result.meldGroups.length, 5);
  assert.equal(result.meldGroups.at(-1).type, "pair");
});

test("validateWin returns seven_pairs pattern", () => {
  const tiles = ["1W", "1W", "2W", "2W", "3W", "3W", "4T", "4T", "5T", "5T", "6B", "6B", "R", "R"];
  const result = validateWin(tiles);
  assert.equal(result.isWin, true);
  assert.equal(result.pattern, "seven_pairs");
  assert.equal(Array.isArray(result.meldGroups), true);
  assert.equal(result.meldGroups.length, 7);
  assert.equal(result.meldGroups[0].type, "pair");
});

test("validateWin rejects non-winning hand", () => {
  const tiles = ["1W", "1W", "2W", "2W", "3W", "3W", "4T", "4T", "5T", "5T", "6B", "6B", "R", "G"];
  const result = validateWin(tiles);
  assert.equal(result.isWin, false);
});

test("enumerateStandardWinGroups returns multiple groups for ambiguity", () => {
  const tiles = [
    "1W", "1W", "1W",
    "2W", "2W", "2W",
    "3W", "3W", "3W",
    "4W", "5W", "6W",
    "7W", "7W"
  ];
  const all = enumerateStandardWinGroups(tiles);
  assert.equal(all.length > 1, true);
});
