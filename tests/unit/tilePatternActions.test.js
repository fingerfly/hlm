import test from "node:test";
import assert from "node:assert/strict";
import {
  buildActionTiles,
  resolvePatternAction
} from "../../src/app/tilePatternActions.js";

test("buildActionTiles returns pair and pung for suited tile", () => {
  const pair = buildActionTiles("3W", "pair");
  assert.equal(pair.ok, true);
  assert.deepEqual(pair.tiles, ["3W", "3W"]);

  const pung = buildActionTiles("3W", "pung");
  assert.equal(pung.ok, true);
  assert.deepEqual(pung.tiles, ["3W", "3W", "3W"]);
});

test("buildActionTiles rejects chow for honor tile", () => {
  const result = buildActionTiles("E", "chow_front");
  assert.equal(result.ok, false);
  assert.equal(result.reason, "chow_requires_suited_tile");
});

test("buildActionTiles rejects out-of-range chow patterns", () => {
  const front = buildActionTiles("8W", "chow_front");
  assert.equal(front.ok, false);
  assert.equal(front.reason, "chow_rank_out_of_range");

  const middle = buildActionTiles("1W", "chow_middle");
  assert.equal(middle.ok, false);
  assert.equal(middle.reason, "chow_rank_out_of_range");
});

test("resolvePatternAction blocks when remaining slots are insufficient", () => {
  const state = {
    slots: [
      "1W", "1W", "1W", "2W", "2W", "2W", "3W",
      "3W", "3W", "4W", "4W", "4W", "5W", ""
    ]
  };
  const result = resolvePatternAction(state, "7W", "pair");
  assert.equal(result.ok, false);
  assert.equal(result.reason, "insufficient_slots");
});

test("resolvePatternAction blocks when tile copies exceed four", () => {
  const state = {
    slots: [
      "1W", "1W", "1W", "1W", "2W", "3W", "",
      "", "", "", "", "", "", ""
    ]
  };
  const result = resolvePatternAction(state, "1W", "single");
  assert.equal(result.ok, false);
  assert.equal(result.reason, "tile_copy_limit");
});

test("resolvePatternAction accepts legal chow and returns ordered tiles", () => {
  const state = {
    slots: ["1W", "1W", "", "", "", "", "", "", "", "", "", "", "", ""]
  };
  const result = resolvePatternAction(state, "5W", "chow_middle");
  assert.equal(result.ok, true);
  assert.deepEqual(result.tiles, ["4W", "5W", "6W"]);
});
