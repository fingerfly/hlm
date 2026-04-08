import test from "node:test";
import assert from "node:assert/strict";
import { FAN_REGISTRY } from "../../src/rules/fanRegistry.js";
import { getFanLexiconText } from "../../src/config/fanLexicon.js";
import { FAN_LEXICON_ENTRIES } from "../../src/config/fanLexiconEntries.js";

test("getFanLexiconText returns non-empty string for every registry id", () => {
  for (const { id } of FAN_REGISTRY) {
    const t = getFanLexiconText(id);
    assert.equal(typeof t, "string");
    assert.equal(t.length > 3, true);
    assert.equal(t.includes("释义待补"), false);
  }
});

test("getFanLexiconText uses curated copy for HUA_PAI", () => {
  const t = getFanLexiconText("HUA_PAI");
  assert.equal(t.includes("花牌"), true);
});

test("FAN_LEXICON_ENTRIES provides four-block structure", () => {
  for (const id of Object.keys(FAN_LEXICON_ENTRIES)) {
    const entry = FAN_LEXICON_ENTRIES[id];
    assert.equal(typeof entry, "object");
    assert.equal(typeof entry.brief, "string");
    assert.equal(Array.isArray(entry.criteria), true);
    assert.equal(Array.isArray(entry.pitfalls), true);
    assert.equal(typeof entry.example, "string");
    assert.equal(entry.example.length > 0, true);
  }
});
