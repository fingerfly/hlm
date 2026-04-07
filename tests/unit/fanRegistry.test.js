import test from "node:test";
import assert from "node:assert/strict";
import { FAN_CATALOG } from "../../src/rules/fanCatalog.js";
import {
  FAN_REGISTRY,
  FAN_REGISTRY_MAP,
  IMPLEMENTED_FAN_IDS,
  MCR_TARGET_FAN_COUNT,
  getFanCoverageProgress,
  getFanDisplayName,
  getFanValue
} from "../../src/rules/fanRegistry.js";

test("fan registry has unique ids", () => {
  const ids = FAN_REGISTRY.map((item) => item.id);
  const unique = new Set(ids);
  assert.equal(ids.length, unique.size);
});

test("fan catalog ids all exist in canonical fan registry", () => {
  for (const fan of FAN_CATALOG) {
    assert.ok(FAN_REGISTRY_MAP[fan.id], `missing registry item: ${fan.id}`);
  }
});

test("fan catalog fan values come from registry", () => {
  for (const fan of FAN_CATALOG) {
    assert.equal(fan.fan, getFanValue(fan.id));
  }
});

test("fan display name resolves canonical Chinese and keeps unknown id", () => {
  assert.equal(getFanDisplayName("MEN_QIAN_QING"), "门前清");
  assert.equal(getFanDisplayName("X_UNKNOWN"), "X_UNKNOWN");
});

test("registry includes new MJ.pdf canonical fan ids", () => {
  assert.equal(Boolean(FAN_REGISTRY_MAP.QUAN_BU_KAO), true);
  assert.equal(Boolean(FAN_REGISTRY_MAP.ZU_HE_LONG), true);
  assert.equal(Boolean(FAN_REGISTRY_MAP.YI_SE_SI_JIE_GAO), true);
  assert.equal(Boolean(FAN_REGISTRY_MAP.MIAO_SHOU_HUI_CHUN), true);
});

test("fan coverage progress tracks implemented count toward MCR target", () => {
  const progress = getFanCoverageProgress();
  assert.equal(progress.implemented, IMPLEMENTED_FAN_IDS.length);
  assert.equal(progress.target, MCR_TARGET_FAN_COUNT);
  assert.equal(progress.remaining, MCR_TARGET_FAN_COUNT - FAN_REGISTRY.length);
});

test("fan registry reaches full 81-item MJ.pdf coverage", () => {
  const progress = getFanCoverageProgress();
  assert.equal(progress.implemented, 81);
  assert.equal(progress.target, 81);
  assert.equal(progress.remaining, 0);
});
