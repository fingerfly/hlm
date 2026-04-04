import test from "node:test";
import assert from "node:assert/strict";
import { aggregateScore } from "../../src/rules/scoreAggregator.js";
import { SETTLEMENT_MODES } from "../../src/config/scoreRuleConfig.js";

const snap8 = {
  gateMinFan: 8,
  gateExcludeFanIds: ["HUA_PAI"],
  settlementMode: SETTLEMENT_MODES.OFFICIAL_BASE_FAN,
  officialBasePoint: 8
};

test("aggregateScore uses full totalFan and gateFan without exclusions", () => {
  const r = aggregateScore(
    [{ id: "MEN_QIAN_QING", fan: 2 }, { id: "ZI_MO", fan: 1 }],
    { gateMinFan: 1, gateExcludeFanIds: [] }
  );
  assert.equal(r.totalFan, 3);
  assert.equal(r.gateFan, 3);
  assert.equal(r.reachesMinWinningFan, true);
});

test("aggregateScore excludes HUA_PAI from gate only", () => {
  const r = aggregateScore(
    [
      { id: "HUA_PAI", fan: 4 },
      { id: "MEN_QIAN_QING", fan: 2 }
    ],
    snap8
  );
  assert.equal(r.totalFan, 6);
  assert.equal(r.gateFan, 2);
  assert.equal(r.reachesMinWinningFan, false);
});

test("aggregateScore reaches gate when non-flower fans suffice", () => {
  const r = aggregateScore(
    [
      { id: "HUA_PAI", fan: 2 },
      { id: "GANG_SHANG_HUA", fan: 8 }
    ],
    snap8
  );
  assert.equal(r.totalFan, 10);
  assert.equal(r.gateFan, 8);
  assert.equal(r.reachesMinWinningFan, true);
});
