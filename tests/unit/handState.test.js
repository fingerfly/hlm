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

test("validateHandInput rejects invalid structured context enum values", () => {
  const result = validateHandInput({
    ...base,
    waitType: "bad_wait",
    specialPattern: "bad_pattern"
  });
  assert.equal(result.ok, false);
  assert.equal(result.code, "INVALID_INPUT");
  assert.equal(result.problems.some((p) => p.includes("waitType")), true);
  assert.equal(result.problems.some((p) => p.includes("specialPattern")), true);
});

test("validateHandInput rejects invalid structured context numeric values", () => {
  const result = validateHandInput({
    ...base,
    flowerCount: -1,
    concealedPungCount: 7,
    kongSummary: { an: -2, ming: 2.5 }
  });
  assert.equal(result.ok, false);
  assert.equal(result.code, "INVALID_INPUT");
  assert.equal(result.problems.some((p) => p.includes("flowerCount")), true);
  assert.equal(result.problems.some((p) => p.includes("concealedPungCount")), true);
  assert.equal(result.problems.some((p) => p.includes("kongSummary")), true);
});

test("validateHandInput rejects non-boolean structured context flags", () => {
  const result = validateHandInput({
    ...base,
    allSetsMelded: "yes",
    noMeldClaims: 1,
    lastTileOfKind: "true",
    isChickenHand: null
  });
  assert.equal(result.ok, false);
  assert.equal(result.code, "INVALID_INPUT");
  assert.equal(result.problems.some((p) => p.includes("allSetsMelded")), true);
  assert.equal(result.problems.some((p) => p.includes("noMeldClaims")), true);
  assert.equal(result.problems.some((p) => p.includes("lastTileOfKind")), true);
  assert.equal(result.problems.some((p) => p.includes("isChickenHand")), true);
});

test("validateHandInput accepts valid structured context payload", () => {
  const result = validateHandInput({
    ...base,
    waitType: "edge",
    specialPattern: "zu_he_long",
    flowerCount: 2,
    concealedPungCount: 3,
    kongSummary: { an: 2, ming: 1 },
    allSetsMelded: true,
    noMeldClaims: false,
    lastTileOfKind: true,
    isChickenHand: false
  });
  assert.equal(result.ok, true);
  assert.equal(result.code, null);
});

test("validateHandInput rejects flowerCount above 8", () => {
  const result = validateHandInput({
    ...base,
    flowerCount: 9
  });
  assert.equal(result.ok, false);
  assert.equal(result.problems.some((p) => p.includes("flowerCount")), true);
});

test("validateHandInput rejects kongSummary over 4 total", () => {
  const result = validateHandInput({
    ...base,
    kongSummary: { an: 3, ming: 2 }
  });
  assert.equal(result.ok, false);
  assert.equal(result.problems.some((p) => p.includes("an+ming")), true);
});
