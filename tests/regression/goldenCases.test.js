import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { scoreHand } from "../../src/rules/scoringEngine.js";

const fixtures = JSON.parse(
  readFileSync(new URL("./goldenCases.json", import.meta.url), "utf8")
);

for (const fixture of fixtures) {
  test(`golden: ${fixture.id}`, () => {
    const result = scoreHand(fixture.input);
    assert.equal(result.errorCode, fixture.expect.errorCode);
    assert.equal(result.isWin, fixture.expect.isWin);
    assert.equal(result.totalFan, fixture.expect.totalFan);
  });
}
