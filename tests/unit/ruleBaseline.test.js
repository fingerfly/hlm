import test from "node:test";
import assert from "node:assert/strict";
import { RULE_BASELINE } from "../../src/config/ruleBaseline.js";
import { TERMINOLOGY_MAP } from "../../src/config/terminologyMap.js";

test("rule baseline freezes rule version and min fan gate", () => {
  assert.equal(RULE_BASELINE.ruleVersion, "MCR-SPORTS-GENERAL-ADMIN-2018");
  assert.equal(RULE_BASELINE.minWinningFan, 1);
});

test("terminology map includes key context vocabulary", () => {
  assert.equal(TERMINOLOGY_MAP.zimo, "自摸");
  assert.equal(TERMINOLOGY_MAP.dianhe, "点和");
  assert.equal(TERMINOLOGY_MAP.menqian, "门前清");
});
