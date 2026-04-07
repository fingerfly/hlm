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

test("resolveFanConflicts excludes qi dui when qi lian dui is present", () => {
  const result = resolveFanConflicts([
    { id: "QI_LIAN_DUI", fan: 88, evidence: "sevenShiftedPairs" },
    { id: "QI_DUI", fan: 24, evidence: "sevenPairs" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "QI_LIAN_DUI"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "QI_DUI"), false);
  assert.equal(result.excludedFans.some((f) => f.id === "QI_DUI"), true);
});

test("resolveFanConflicts excludes jian ke under da san yuan", () => {
  const result = resolveFanConflicts([
    { id: "DA_SAN_YUAN", fan: 88, evidence: "dragons3" },
    { id: "JIAN_KE", fan: 2, evidence: "dragonPung" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "DA_SAN_YUAN"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "JIAN_KE"), false);
  assert.equal(result.excludedFans.some((f) => f.id === "JIAN_KE"), true);
});

test("resolveFanConflicts excludes yao jiu ke under da san yuan", () => {
  const result = resolveFanConflicts([
    { id: "DA_SAN_YUAN", fan: 88, evidence: "dragons3" },
    { id: "YAO_JIU_KE", fan: 1, evidence: "terminalHonorPung" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "DA_SAN_YUAN"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "YAO_JIU_KE"), false);
  assert.equal(result.excludedFans.some((f) => f.id === "YAO_JIU_KE"), true);
});

test("resolveFanConflicts excludes yao jiu ke under da si xi", () => {
  const result = resolveFanConflicts([
    { id: "DA_SI_XI", fan: 88, evidence: "winds4" },
    { id: "YAO_JIU_KE", fan: 1, evidence: "terminalHonorPung" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "DA_SI_XI"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "YAO_JIU_KE"), false);
  assert.equal(result.excludedFans.some((f) => f.id === "YAO_JIU_KE"), true);
});

test("resolveFanConflicts excludes yao jiu ke under xiao si xi", () => {
  const result = resolveFanConflicts([
    { id: "XIAO_SI_XI", fan: 64, evidence: "winds3pair" },
    { id: "YAO_JIU_KE", fan: 1, evidence: "terminalHonorPung" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "XIAO_SI_XI"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "YAO_JIU_KE"), false);
  assert.equal(result.excludedFans.some((f) => f.id === "YAO_JIU_KE"), true);
});

test("resolveFanConflicts excludes jian ke under xiao san yuan", () => {
  const result = resolveFanConflicts([
    { id: "XIAO_SAN_YUAN", fan: 64, evidence: "dragons2pair" },
    { id: "JIAN_KE", fan: 2, evidence: "dragonPung" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "XIAO_SAN_YUAN"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "JIAN_KE"), false);
  assert.equal(result.excludedFans.some((f) => f.id === "JIAN_KE"), true);
});

test("resolveFanConflicts excludes yao jiu ke under xiao san yuan", () => {
  const result = resolveFanConflicts([
    { id: "XIAO_SAN_YUAN", fan: 64, evidence: "dragons2pair" },
    { id: "YAO_JIU_KE", fan: 1, evidence: "terminalHonorPung" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "XIAO_SAN_YUAN"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "YAO_JIU_KE"), false);
  assert.equal(result.excludedFans.some((f) => f.id === "YAO_JIU_KE"), true);
});

test("resolveFanConflicts excludes yao jiu ke under da san feng", () => {
  const result = resolveFanConflicts([
    { id: "DA_SAN_FENG", fan: 12, evidence: "winds3" },
    { id: "YAO_JIU_KE", fan: 1, evidence: "terminalHonorPung" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "DA_SAN_FENG"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "YAO_JIU_KE"), false);
  assert.equal(result.excludedFans.some((f) => f.id === "YAO_JIU_KE"), true);
});

test("resolveFanConflicts excludes jian ke under shuang jian ke", () => {
  const result = resolveFanConflicts([
    { id: "SHUANG_JIAN_KE", fan: 6, evidence: "dragons2" },
    { id: "JIAN_KE", fan: 2, evidence: "dragonPung" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "SHUANG_JIAN_KE"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "JIAN_KE"), false);
  assert.equal(result.excludedFans.some((f) => f.id === "JIAN_KE"), true);
});

test("resolveFanConflicts excludes san gang under si gang", () => {
  const result = resolveFanConflicts([
    { id: "SI_GANG", fan: 88, evidence: "kong4" },
    { id: "SAN_GANG", fan: 32, evidence: "kong3" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "SI_GANG"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "SAN_GANG"), false);
  assert.equal(result.excludedFans.some((f) => f.id === "SAN_GANG"), true);
});

test("resolveFanConflicts excludes an gang under shuang an gang", () => {
  const result = resolveFanConflicts([
    { id: "SHUANG_AN_GANG", fan: 8, evidence: "anGang2" },
    { id: "AN_GANG", fan: 2, evidence: "anGang1" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "SHUANG_AN_GANG"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "AN_GANG"), false);
  assert.equal(result.excludedFans.some((f) => f.id === "AN_GANG"), true);
});

test("resolveFanConflicts excludes ming gang under shuang ming gang", () => {
  const result = resolveFanConflicts([
    { id: "SHUANG_MING_GANG", fan: 4, evidence: "mingGang2" },
    { id: "MING_GANG", fan: 1, evidence: "mingGang1" }
  ]);
  assert.equal(
    result.matchedFans.some((f) => f.id === "SHUANG_MING_GANG"),
    true
  );
  assert.equal(result.matchedFans.some((f) => f.id === "MING_GANG"), false);
  assert.equal(result.excludedFans.some((f) => f.id === "MING_GANG"), true);
});

test("resolveFanConflicts excludes lower gang fans under san gang", () => {
  const result = resolveFanConflicts([
    { id: "SAN_GANG", fan: 32, evidence: "kong3" },
    { id: "SHUANG_AN_GANG", fan: 8, evidence: "anGang2" },
    { id: "SHUANG_MING_GANG", fan: 4, evidence: "mingGang2" },
    { id: "AN_GANG", fan: 2, evidence: "anGang1" },
    { id: "MING_GANG", fan: 1, evidence: "mingGang1" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "SAN_GANG"), true);
  assert.equal(
    result.matchedFans.some((f) => f.id === "SHUANG_AN_GANG"),
    false
  );
  assert.equal(
    result.matchedFans.some((f) => f.id === "SHUANG_MING_GANG"),
    false
  );
  assert.equal(result.matchedFans.some((f) => f.id === "AN_GANG"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "MING_GANG"), false);
});

test("resolveFanConflicts excludes men/quan/jian/yao subfans under zi yi se", () => {
  const result = resolveFanConflicts([
    { id: "ZI_YI_SE", fan: 64, evidence: "allHonors" },
    { id: "MEN_FENG_KE", fan: 2, evidence: "seat" },
    { id: "QUAN_FENG_KE", fan: 2, evidence: "prev" },
    { id: "JIAN_KE", fan: 2, evidence: "dragonPung" },
    { id: "YAO_JIU_KE", fan: 1, evidence: "terminalHonorPung" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "ZI_YI_SE"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "MEN_FENG_KE"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "QUAN_FENG_KE"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "JIAN_KE"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "YAO_JIU_KE"), false);
});

test("resolveFanConflicts excludes peng peng hu and yao jiu ke under qing yao jiu", () => {
  const result = resolveFanConflicts([
    { id: "QING_YAO_JIU", fan: 64, evidence: "allTerminals" },
    { id: "PENG_PENG_HU", fan: 6, evidence: "allPungs" },
    { id: "YAO_JIU_KE", fan: 1, evidence: "terminalPung" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "QING_YAO_JIU"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "PENG_PENG_HU"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "YAO_JIU_KE"), false);
});

test("resolveFanConflicts excludes peng peng hu and yao jiu ke under hun yao jiu", () => {
  const result = resolveFanConflicts([
    { id: "HUN_YAO_JIU", fan: 32, evidence: "mixedTermHonors" },
    { id: "PENG_PENG_HU", fan: 6, evidence: "allPungs" },
    { id: "YAO_JIU_KE", fan: 1, evidence: "terminalHonorPung" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "HUN_YAO_JIU"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "PENG_PENG_HU"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "YAO_JIU_KE"), false);
});

test("resolveFanConflicts excludes qing men qing yao subfans under jiu lian bao deng", () => {
  const result = resolveFanConflicts([
    { id: "JIU_LIAN_BAO_DENG", fan: 88, evidence: "nineGates" },
    { id: "QING_YI_SE", fan: 24, evidence: "pure" },
    { id: "MEN_QIAN_QING", fan: 2, evidence: "concealed" },
    { id: "YAO_JIU_KE", fan: 1, evidence: "yao" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "JIU_LIAN_BAO_DENG"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "QING_YI_SE"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "MEN_QIAN_QING"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "YAO_JIU_KE"), false);
});

test("resolveFanConflicts excludes hun yao jiu and men qian qing under shi san yao", () => {
  const result = resolveFanConflicts([
    { id: "SHI_SAN_YAO", fan: 88, evidence: "orphans" },
    { id: "HUN_YAO_JIU", fan: 32, evidence: "mixed" },
    { id: "MEN_QIAN_QING", fan: 2, evidence: "concealed" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "SHI_SAN_YAO"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "HUN_YAO_JIU"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "MEN_QIAN_QING"), false);
});

test("resolveFanConflicts excludes dan diao jiang under shi san yao", () => {
  const result = resolveFanConflicts([
    { id: "SHI_SAN_YAO", fan: 88, evidence: "orphans" },
    { id: "DAN_DIAO_JIANG", fan: 1, evidence: "single" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "SHI_SAN_YAO"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "DAN_DIAO_JIANG"), false);
});

test("resolveFanConflicts excludes men qian qing under qi dui", () => {
  const result = resolveFanConflicts([
    { id: "QI_DUI", fan: 24, evidence: "sevenPairs" },
    { id: "MEN_QIAN_QING", fan: 2, evidence: "concealed" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "QI_DUI"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "MEN_QIAN_QING"), false);
});

test("resolveFanConflicts excludes ping xi lao hua subfans under san se shuang long hui", () => {
  const result = resolveFanConflicts([
    { id: "SAN_SE_SHUANG_LONG_HUI", fan: 16, evidence: "mixedDoubleDragon" },
    { id: "PING_HU", fan: 2, evidence: "chows" },
    { id: "XI_XIANG_FENG", fan: 1, evidence: "mixedDouble" },
    { id: "LAO_SHAO_FU", fan: 1, evidence: "termChows" },
    { id: "HUA_LONG", fan: 8, evidence: "mixedStraight" }
  ]);
  assert.equal(
    result.matchedFans.some((f) => f.id === "SAN_SE_SHUANG_LONG_HUI"),
    true
  );
  assert.equal(result.matchedFans.some((f) => f.id === "PING_HU"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "XI_XIANG_FENG"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "LAO_SHAO_FU"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "HUA_LONG"), false);
});

test("resolveFanConflicts excludes qing ping lao yi subfans under yi se shuang long hui", () => {
  const result = resolveFanConflicts([
    { id: "YI_SE_SHUANG_LONG_HUI", fan: 64, evidence: "pureDoubleDragon" },
    { id: "QING_YI_SE", fan: 24, evidence: "pure" },
    { id: "PING_HU", fan: 2, evidence: "chows" },
    { id: "YI_BAN_GAO", fan: 1, evidence: "doubleChow" },
    { id: "LAO_SHAO_FU", fan: 1, evidence: "termChows" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "YI_SE_SHUANG_LONG_HUI"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "QING_YI_SE"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "PING_HU"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "YI_BAN_GAO"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "LAO_SHAO_FU"), false);
});

test("resolveFanConflicts excludes duan yao wu zi dan diao under qi dui", () => {
  const result = resolveFanConflicts([
    { id: "QI_DUI", fan: 24, evidence: "sevenPairs" },
    { id: "DUAN_YAO", fan: 2, evidence: "simples" },
    { id: "WU_ZI", fan: 1, evidence: "noHonors" },
    { id: "DAN_DIAO_JIANG", fan: 1, evidence: "single" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "QI_DUI"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "DUAN_YAO"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "WU_ZI"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "DAN_DIAO_JIANG"), false);
});

test("resolveFanConflicts excludes jie tong yi ban under yi se si tong shun", () => {
  const result = resolveFanConflicts([
    { id: "YI_SE_SI_TONG_SHUN", fan: 48, evidence: "quadChow" },
    { id: "YI_SE_SAN_JIE_GAO", fan: 24, evidence: "triplePung" },
    { id: "YI_SE_SAN_TONG_SHUN", fan: 24, evidence: "tripleChow" },
    { id: "YI_BAN_GAO", fan: 1, evidence: "doubleChow" },
    { id: "SI_GUI_YI", fan: 2, evidence: "fourthTile" }
  ]);
  assert.equal(
    result.matchedFans.some((f) => f.id === "YI_SE_SI_TONG_SHUN"),
    true
  );
  assert.equal(
    result.matchedFans.some((f) => f.id === "YI_SE_SAN_JIE_GAO"),
    false
  );
  assert.equal(
    result.matchedFans.some((f) => f.id === "YI_SE_SAN_TONG_SHUN"),
    false
  );
  assert.equal(result.matchedFans.some((f) => f.id === "YI_BAN_GAO"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "SI_GUI_YI"), false);
});

test("resolveFanConflicts excludes yi se san tong shun under yi se san jie gao", () => {
  const result = resolveFanConflicts([
    { id: "YI_SE_SAN_JIE_GAO", fan: 24, evidence: "tripleShiftPung" },
    { id: "YI_SE_SAN_TONG_SHUN", fan: 24, evidence: "tripleChow" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "YI_SE_SAN_JIE_GAO"), true);
  assert.equal(
    result.matchedFans.some((f) => f.id === "YI_SE_SAN_TONG_SHUN"),
    false
  );
});

test("resolveFanConflicts excludes structure subfans under lv yi se", () => {
  const result = resolveFanConflicts([
    { id: "LV_YI_SE", fan: 88, evidence: "allGreen" },
    { id: "QING_YI_SE", fan: 24, evidence: "pure" },
    { id: "PENG_PENG_HU", fan: 6, evidence: "allPungs" },
    { id: "DUAN_YAO", fan: 2, evidence: "simples" },
    { id: "YI_SE_SAN_JIE_GAO", fan: 24, evidence: "tripleShift" },
    { id: "YI_SE_SAN_TONG_SHUN", fan: 24, evidence: "tripleChow" },
    { id: "YI_BAN_GAO", fan: 1, evidence: "doubleChow" }
  ]);
  assert.equal(result.matchedFans.some((f) => f.id === "LV_YI_SE"), true);
  assert.equal(result.matchedFans.some((f) => f.id === "QING_YI_SE"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "PENG_PENG_HU"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "DUAN_YAO"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "YI_SE_SAN_JIE_GAO"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "YI_SE_SAN_TONG_SHUN"), false);
  assert.equal(result.matchedFans.some((f) => f.id === "YI_BAN_GAO"), false);
});
