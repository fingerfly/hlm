import test from "node:test";
import assert from "node:assert/strict";
import { explainScoringResult } from "../../src/llm/explainer.js";

test("explainer uses Chinese fan names instead of internal ids", () => {
  const text = explainScoringResult({
    errorCode: null,
    winPattern: "standard",
    totalFan: 3,
    matchedFans: [
      { id: "MEN_QIAN_QING", fan: 2 },
      { id: "ZI_MO", fan: 1 }
    ]
  });
  assert.equal(text.includes("门前清(2)"), true);
  assert.equal(text.includes("自摸(1)"), true);
  assert.equal(text.includes("MEN_QIAN_QING"), false);
});

test("explainer maps known win pattern to Chinese text", () => {
  const text = explainScoringResult({
    errorCode: null,
    winPattern: "seven_pairs",
    totalFan: 24,
    matchedFans: [{ id: "QI_DUI", fan: 24 }]
  });
  assert.equal(text.includes("和牌类型：七对"), true);
});
