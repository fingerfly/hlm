import test from "node:test";
import assert from "node:assert/strict";
import { RULE_BASELINE, RULE_SOURCE } from "../../src/config/ruleBaseline.js";
import { TERMINOLOGY_MAP } from "../../src/config/terminologyMap.js";

test("rule baseline freezes rule version and min fan gate", () => {
  assert.equal(RULE_BASELINE.ruleVersion, "MCR-SPORTS-GENERAL-ADMIN-2018");
  assert.equal(RULE_BASELINE.minWinningFan, 1);
});

test("RULE_SOURCE matches baseline id and registry fan count", () => {
  assert.equal(RULE_SOURCE.baselineId, RULE_BASELINE.ruleVersion);
  assert.equal(RULE_SOURCE.registryFanCount, 82);
  assert.equal(typeof RULE_SOURCE.authorityZh, "string");
  assert.equal(typeof RULE_SOURCE.documentZh, "string");
});

test("terminology map includes key context vocabulary", () => {
  assert.equal(TERMINOLOGY_MAP.zimo, "自摸");
  assert.equal(TERMINOLOGY_MAP.dianhe, "点和");
  assert.equal(TERMINOLOGY_MAP.menqian, "门前清");
});
