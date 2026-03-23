import test from "node:test";
import assert from "node:assert/strict";
import {
  applyAttachOncePrinciple,
  applyConflictGroupPrinciple,
  applyExclusionMapPrinciple,
  applySameFanOncePrinciple
} from "../../src/rules/principleConstraints.js";

test("applySameFanOncePrinciple keeps one per fan id", () => {
  const result = applySameFanOncePrinciple([
    { id: "WU_ZI", fan: 1, evidence: "a" },
    { id: "WU_ZI", fan: 1, evidence: "b" },
    { id: "QUE_YI_MEN", fan: 1, evidence: "c" }
  ]);
  assert.equal(result.matchedFans.filter((f) => f.id === "WU_ZI").length, 1);
  assert.equal(
    result.excludedFans.some((f) => f.reason.startsWith("same_fan_once_keep")),
    true
  );
});

test("applyAttachOncePrinciple keeps one attachable with hua long", () => {
  const result = applyAttachOncePrinciple([
    { id: "HUA_LONG", fan: 8, evidence: "mixedStraight" },
    { id: "XI_XIANG_FENG", fan: 1, evidence: "mixedDoubleChow" },
    { id: "LIAN_LIU", fan: 1, evidence: "shortStraight" }
  ]);
  const attachKept = result.matchedFans.filter(
    (f) => f.id === "XI_XIANG_FENG" || f.id === "LIAN_LIU"
  );
  assert.equal(attachKept.length, 1);
  assert.equal(
    result.excludedFans.some(
      (f) => f.reason.startsWith("attached_once_with_HUA_LONG")
    ),
    true
  );
});

test("applyConflictGroupPrinciple keeps higher fan in group", () => {
  const result = applyConflictGroupPrinciple([
    { id: "QING_YI_SE", fan: 24, evidence: "pure" },
    { id: "HUN_YI_SE", fan: 6, evidence: "mixed" }
  ]);
  assert.equal(result.matchedFans.length, 1);
  assert.equal(result.matchedFans[0].id, "QING_YI_SE");
  assert.equal(
    result.excludedFans.some((f) => f.reason.startsWith("conflict_with_")),
    true
  );
});

test("applyExclusionMapPrinciple excludes subordinate fans", () => {
  const result = applyExclusionMapPrinciple([
    { id: "QING_YI_SE", fan: 24, evidence: "pure" },
    { id: "WU_ZI", fan: 1, evidence: "noHonors" },
    { id: "QUE_YI_MEN", fan: 1, evidence: "oneVoided" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "QING_YI_SE"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "WU_ZI"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "QUE_YI_MEN"), false);
});
