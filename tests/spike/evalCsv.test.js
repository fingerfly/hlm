/**
 * Purpose: Verify CSV auto-fill helper behavior for spike results.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  buildEvalFields,
  countInvalidTiles,
  parseGroundTruthTiles
} from "../../src/spike/vlm/evalCsv.js";

test("countInvalidTiles counts unsupported tile codes", () => {
  assert.equal(countInvalidTiles(["1W", "9T", "BAD", "Wh", "Ch"]), 1);
});

test("buildEvalFields maps successful result to Y flags", () => {
  const fields = buildEvalFields({
    ok: true,
    data: { tiles: new Array(14).fill("1W"), uncertainIndices: [1, 2, 3] }
  });
  assert.equal(fields.run_cmd_ok, "Y");
  assert.equal(fields.api_ok, "Y");
  assert.equal(fields.tiles_len_14, "Y");
  assert.equal(fields.invalid_tile_count, "0");
  assert.equal(fields.uncertain_count, "3");
  assert.equal(fields.error_code, "");
});

test("buildEvalFields maps missing result to MISSING_RESULT", () => {
  const fields = buildEvalFields(null);
  assert.equal(fields.run_cmd_ok, "N");
  assert.equal(fields.error_code, "MISSING_RESULT");
});

test("parseGroundTruthTiles parses space-separated tile list", () => {
  assert.deepEqual(parseGroundTruthTiles("1W 2W 3W E S Wn N Wh"), ["1W", "2W", "3W", "E", "S", "Wn", "N", "Wh"]);
});

test("parseGroundTruthTiles normalizes legacy flower aliases", () => {
  assert.deepEqual(parseGroundTruthTiles("1W F1 J2 Wh"), ["1W", "Ch", "La", "Wh"]);
});

test("buildEvalFields computes GT accuracy metrics", () => {
  const fields = buildEvalFields(
    {
      ok: true,
      data: {
        tiles: ["1W", "2W", "3W", "4W", "5W", "6W", "7W", "8W", "9W", "E", "S", "Wn", "N", "Wh"],
        uncertainIndices: []
      }
    },
    {
      groundTruthTiles: ["1W", "2W", "3W", "4W", "5W", "6W", "7W", "8W", "9W", "1T", "2T", "3T", "4T", "5T"]
    }
  );
  assert.equal(fields.exact_match_14, "N");
  assert.equal(fields.position_accuracy, "0.64");
  assert.equal(fields.tile_set_accuracy, "0.64");
  assert.equal(fields.tb_recall, "0.00");
});

test("buildEvalFields preserves external output contract keys", () => {
  const fields = buildEvalFields({
    ok: true,
    data: { tiles: new Array(14).fill("1W"), uncertainIndices: [] }
  });
  assert.deepEqual(Object.keys(fields), [
    "run_cmd_ok",
    "api_ok",
    "tiles_len_14",
    "invalid_tile_count",
    "uncertain_count",
    "error_code",
    "exact_match_14",
    "position_accuracy",
    "tile_set_accuracy",
    "tb_recall"
  ]);
});
