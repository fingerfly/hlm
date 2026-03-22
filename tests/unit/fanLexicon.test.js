import test from "node:test";
import assert from "node:assert/strict";
import { FAN_REGISTRY } from "../../src/rules/fanRegistry.js";
import { getFanLexiconText } from "../../src/config/fanLexicon.js";

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
