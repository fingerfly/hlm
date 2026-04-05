import test from "node:test";
import assert from "node:assert/strict";
import {
  parsePlayerScoreInput,
  PLAYER_SCORE_MIN,
  PLAYER_SCORE_MAX
} from "../../public/appStateActions.js";

test("parsePlayerScoreInput clamps to bounds", () => {
  assert.equal(parsePlayerScoreInput(PLAYER_SCORE_MAX + 1), PLAYER_SCORE_MAX);
  assert.equal(parsePlayerScoreInput(PLAYER_SCORE_MIN - 1), PLAYER_SCORE_MIN);
});

test("parsePlayerScoreInput parses valid integers", () => {
  assert.equal(parsePlayerScoreInput("0"), 0);
  assert.equal(parsePlayerScoreInput("-100"), -100);
  assert.equal(parsePlayerScoreInput(5000), 5000);
});

test("parsePlayerScoreInput non-integer falls back to zero", () => {
  assert.equal(parsePlayerScoreInput("x"), 0);
  assert.equal(parsePlayerScoreInput(""), 0);
  assert.equal(parsePlayerScoreInput(null), 0);
});
