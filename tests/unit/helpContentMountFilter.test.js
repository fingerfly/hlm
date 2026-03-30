import test from "node:test";
import assert from "node:assert/strict";
import { matchesFanSearchQuery } from "../../public/helpContentMount.js";
import { parseFanRegistryIdFromHash } from "../../public/helpFanHash.js";

test("matchesFanSearchQuery: empty query shows all", () => {
  assert.equal(matchesFanSearchQuery("清一色", ""), true);
  assert.equal(matchesFanSearchQuery("清一色", "   "), true);
});

test("matchesFanSearchQuery: substring case-insensitive", () => {
  assert.equal(matchesFanSearchQuery("大三元", "三元"), true);
  assert.equal(matchesFanSearchQuery("大三元", "大"), true);
  assert.equal(matchesFanSearchQuery("大三元", "foo"), false);
});

test("parseFanRegistryIdFromHash: canonical and legacy suffixes", () => {
  assert.equal(parseFanRegistryIdFromHash("#fan-QING_YI_SE"), "QING_YI_SE");
  assert.equal(
    parseFanRegistryIdFromHash("#fan-QING_YI_SE-popover"),
    "QING_YI_SE"
  );
  assert.equal(parseFanRegistryIdFromHash("#fan-QING_YI_SE-modal"), "QING_YI_SE");
  assert.equal(parseFanRegistryIdFromHash(""), null);
  assert.equal(parseFanRegistryIdFromHash("#settings"), null);
  assert.equal(parseFanRegistryIdFromHash("#fan-NOT_A_REAL_FAN_KEY"), null);
});
