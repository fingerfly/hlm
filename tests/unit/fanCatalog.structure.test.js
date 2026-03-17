import test from "node:test";
import assert from "node:assert/strict";
import { FAN_CATALOG } from "../../src/rules/fanCatalog.js";
import { CONTEXT_DETECTORS } from "../../src/rules/detectors/contextDetectors.js";
import { PATTERN_DETECTORS } from "../../src/rules/detectors/patternDetectors.js";
import { FEATURE_DETECTORS } from "../../src/rules/detectors/featureDetectors.js";

test("fan catalog composes detector category modules", () => {
  const expected =
    CONTEXT_DETECTORS.length
    + PATTERN_DETECTORS.length
    + FEATURE_DETECTORS.length;
  assert.equal(FAN_CATALOG.length, expected);
});

test("fan catalog entries include required runtime fields", () => {
  for (const item of FAN_CATALOG) {
    assert.equal(typeof item.id, "string");
    assert.equal(typeof item.fan, "number");
    assert.equal(typeof item.detect, "function");
    assert.equal(typeof item.evidence, "string");
  }
});
