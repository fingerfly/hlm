import test from "node:test";
import assert from "node:assert/strict";
import {
  matchesFanSearchQuery,
  normalizeFanLexiconEntry
} from "../../public/helpContentMount.js";
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

test("normalizeFanLexiconEntry supports legacy string payload", () => {
  const entry = normalizeFanLexiconEntry("门前清：和牌时未副露。");
  assert.equal(typeof entry.brief, "string");
  assert.equal(Array.isArray(entry.criteria), true);
  assert.equal(Array.isArray(entry.pitfalls), true);
  assert.equal(typeof entry.example, "string");
  assert.equal(entry.brief.includes("门前清"), true);
});

test("normalizeFanLexiconEntry keeps four-block object payload", () => {
  const raw = {
    brief: "自摸：最后一张为自摸进张。",
    criteria: ["必须为自摸和牌"],
    pitfalls: ["把点和错当自摸"],
    example: "示例：摸入听牌后和。"
  };
  const entry = normalizeFanLexiconEntry(raw);
  assert.deepEqual(entry.criteria, ["必须为自摸和牌"]);
  assert.deepEqual(entry.pitfalls, ["把点和错当自摸"]);
  assert.equal(entry.example, "示例：摸入听牌后和。");
});
