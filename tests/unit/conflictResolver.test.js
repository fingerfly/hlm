import test from "node:test";
import assert from "node:assert/strict";
import { resolveFanConflicts } from "../../src/rules/conflictResolver.js";

test("resolveFanConflicts keeps higher fan in same group", () => {
  const result = resolveFanConflicts([
    { id: "QING_YI_SE", fan: 24, evidence: "pure" },
    { id: "HUN_YI_SE", fan: 6, evidence: "mixed" }
  ]);
  assert.equal(result.matchedFans.length, 1);
  assert.equal(result.matchedFans[0].id, "QING_YI_SE");
  assert.equal(result.excludedFans[0].id, "HUN_YI_SE");
});

test("resolveFanConflicts keeps both seat and prevalent wind pungs", () => {
  const result = resolveFanConflicts([
    { id: "MEN_FENG_KE", fan: 2, evidence: "seat" },
    { id: "QUAN_FENG_KE", fan: 2, evidence: "prev" }
  ]);
  assert.equal(result.matchedFans.length, 2);
  assert.equal(result.excludedFans.length, 0);
});

test("resolveFanConflicts lets da si xi exclude lower wind/honor fans", () => {
  const result = resolveFanConflicts([
    { id: "DA_SI_XI", fan: 88, evidence: "winds4" },
    { id: "XIAO_SI_XI", fan: 64, evidence: "winds3pair" },
    { id: "MEN_FENG_KE", fan: 2, evidence: "seat" },
    { id: "QUAN_FENG_KE", fan: 2, evidence: "prev" },
    { id: "ZI_YI_SE", fan: 64, evidence: "allHonors" }
  ]);
  assert.equal(result.matchedFans.length, 1);
  assert.equal(result.matchedFans[0].id, "DA_SI_XI");
  assert.equal(result.excludedFans.some((f) => f.id === "MEN_FENG_KE"), true);
  assert.equal(result.excludedFans.some((f) => f.id === "QUAN_FENG_KE"), true);
  assert.equal(result.excludedFans.some((f) => f.id === "ZI_YI_SE"), true);
});

test("resolveFanConflicts excludes no-honor and one-voided under flush fans", () => {
  const result = resolveFanConflicts([
    { id: "QING_YI_SE", fan: 24, evidence: "fullFlush" },
    { id: "QUE_YI_MEN", fan: 1, evidence: "oneVoidedSuit" },
    { id: "WU_ZI", fan: 1, evidence: "noHonors" }
  ]);
  assert.equal(result.matchedFans.length, 1);
  assert.equal(result.matchedFans[0].id, "QING_YI_SE");
  assert.equal(result.excludedFans.some((f) => f.id === "QUE_YI_MEN"), true);
  assert.equal(result.excludedFans.some((f) => f.id === "WU_ZI"), true);
});

test("resolveFanConflicts excludes subfans under ping hu and qing long", () => {
  const result = resolveFanConflicts([
    { id: "PING_HU", fan: 2, evidence: "allChows" },
    { id: "WU_ZI", fan: 1, evidence: "noHonors" },
    { id: "QING_LONG", fan: 16, evidence: "pureStraight" },
    { id: "LIAN_LIU", fan: 1, evidence: "shortStraight" },
    { id: "LAO_SHAO_FU", fan: 1, evidence: "terminalChows" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "PING_HU"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "QING_LONG"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "WU_ZI"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "LIAN_LIU"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "LAO_SHAO_FU"), false);
});

test("resolveFanConflicts excludes subfans under rank-range fans", () => {
  const result = resolveFanConflicts([
    { id: "QUAN_DA", fan: 24, evidence: "all789" },
    { id: "DA_YU_WU", fan: 12, evidence: "all6789" },
    { id: "WU_ZI", fan: 1, evidence: "noHonors" },
    { id: "QUAN_ZHONG", fan: 24, evidence: "all456" },
    { id: "DUAN_YAO", fan: 2, evidence: "allSimples" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "QUAN_DA"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "DA_YU_WU"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "WU_ZI"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "QUAN_ZHONG"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "DUAN_YAO"), false);
});

test("resolveFanConflicts excludes wind/dragon and pung subfans", () => {
  const result = resolveFanConflicts([
    { id: "DA_SI_XI", fan: 88, evidence: "winds4" },
    { id: "DA_SAN_FENG", fan: 12, evidence: "winds3" },
    { id: "DA_SAN_YUAN", fan: 88, evidence: "dragons3" },
    { id: "SHUANG_JIAN_KE", fan: 6, evidence: "dragons2" },
    { id: "SAN_TONG_KE", fan: 16, evidence: "triplet" },
    { id: "SHUANG_TONG_KE", fan: 2, evidence: "double" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "DA_SAN_FENG"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "SHUANG_JIAN_KE"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "SHUANG_TONG_KE"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "SAN_TONG_KE"), true);
});

test("resolveFanConflicts allows only one attachable fan with hua long", () => {
  const result = resolveFanConflicts([
    { id: "HUA_LONG", fan: 8, evidence: "mixedStraight" },
    { id: "XI_XIANG_FENG", fan: 1, evidence: "mixedDoubleChow" },
    { id: "LIAN_LIU", fan: 1, evidence: "shortStraight" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "HUA_LONG"), true);
  const attachMatched = result.matchedFans.filter(
    (f) => f.id === "XI_XIANG_FENG" || f.id === "LIAN_LIU"
  );
  assert.equal(attachMatched.length, 1);
  assert.equal(
    result.excludedFans.some(
      (f) => f.reason.startsWith("attached_once_with_HUA_LONG")
    ),
    true
  );
});

test("resolveFanConflicts excludes all repeated target fan instances", () => {
  const result = resolveFanConflicts([
    { id: "QING_YI_SE", fan: 24, evidence: "fullFlush" },
    { id: "WU_ZI", fan: 1, evidence: "noHonorsA" },
    { id: "WU_ZI", fan: 1, evidence: "noHonorsB" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "QING_YI_SE"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "WU_ZI"), false);
  const excludedWuZi = result.excludedFans.filter((f) => f.id === "WU_ZI");
  assert.equal(excludedWuZi.length, 2);
});

test("resolveFanConflicts keeps only one instance for same fan id", () => {
  const result = resolveFanConflicts([
    { id: "WU_ZI", fan: 1, evidence: "noHonorsA" },
    { id: "WU_ZI", fan: 1, evidence: "noHonorsB" },
    { id: "QUE_YI_MEN", fan: 1, evidence: "oneVoidedSuit" }
  ]);
  const kept = result.matchedFans.filter((f) => f.id === "WU_ZI");
  assert.equal(kept.length, 1);
  assert.equal(
    result.excludedFans.some((f) => f.reason.startsWith("same_fan_once_keep")),
    true
  );
});
