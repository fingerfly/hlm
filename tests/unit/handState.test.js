import test from "node:test";
import assert from "node:assert/strict";
import { validateHandInput } from "../../src/contracts/handState.js";
import { validHandStateFixture } from "../fixtures/handStateFixture.js";

const base = validHandStateFixture;

test("validateHandInput flags missing required context as NEED_CONTEXT", () => {
  const input = { ...base };
  delete input.winType;
  const result = validateHandInput(input);
  assert.equal(result.ok, false);
  assert.equal(result.code, "NEED_CONTEXT");
  assert.deepEqual(result.missingFields, ["winType"]);
});

test("validateHandInput validates successful shape", () => {
  const result = validateHandInput(base);
  assert.equal(result.ok, true);
  assert.deepEqual(result.missingFields, []);
});

test("validateHandInput rejects invalid seat wind", () => {
  const result = validateHandInput({
    ...base,
    seatWind: "X"
  });
  assert.equal(result.ok, false);
  assert.equal(result.code, "INVALID_INPUT");
});
