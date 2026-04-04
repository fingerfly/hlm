import test from "node:test";
import assert from "node:assert/strict";
import { buildResultViewModel } from "../../src/app/resultViewModel.js";

test("buildResultViewModel maps status and win pattern to Chinese labels", () => {
  const vm = buildResultViewModel({
    recognition: { status: "manual_ready" },
    scoring: { isWin: true, totalFan: 3, minWinningFan: 1, winPattern: "standard", matchedFans: [], excludedFans: [] },
    explanation: "ok"
  });
  assert.equal(vm.statusText, "手动输入已就绪");
  assert.equal(vm.winPatternText, "基本和型");
  assert.equal(vm.winText, "和牌");
});

test("buildResultViewModel maps fan IDs and keeps unknown IDs", () => {
  const vm = buildResultViewModel({
    recognition: { status: "manual_ready" },
    scoring: {
      isWin: true,
      totalFan: 3,
      minWinningFan: 1,
      winPattern: "standard",
      matchedFans: [{ id: "MEN_QIAN_QING", fan: 2 }, { id: "X_UNKNOWN", fan: 5 }],
      excludedFans: []
    },
    explanation: "ok"
  });
  assert.equal(vm.matchedFans[0].name, "门前清");
  assert.equal(vm.matchedFans[1].name, "X_UNKNOWN");
  assert.equal(
    typeof vm.matchedFans[0].detailText,
    "string"
  );
  assert.equal(vm.matchedFans[0].detailText.length > 0, true);
});

test("buildResultViewModel handles invalid/manual error states", () => {
  const vm = buildResultViewModel({
    recognition: { status: "manual_invalid" },
    scoring: {
      isWin: false,
      totalFan: 0,
      minWinningFan: 1,
      winPattern: null,
      matchedFans: [],
      excludedFans: []
    },
    explanation: "bad input"
  });
  assert.equal(vm.statusText, "手牌输入无效");
  assert.equal(vm.winPatternText, "未成和");
  assert.equal(vm.winText, "未和牌");
});

test("buildResultViewModel keeps meld groups for row rendering", () => {
  const vm = buildResultViewModel({
    recognition: { status: "manual_ready" },
    scoring: {
      isWin: true,
      totalFan: 3,
      minWinningFan: 1,
      winPattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["2W", "3W", "4W"] },
        { type: "pair", tiles: ["9B", "9B"] }
      ],
      matchedFans: [],
      excludedFans: []
    },
    explanation: "ok"
  });
  assert.equal(vm.meldGroups.length, 2);
  assert.equal(vm.meldGroups[0].type, "chow");
  assert.equal(vm.meldGroups[1].type, "pair");
});

test("buildResultViewModel keeps settlement payload for rendering", () => {
  const vm = buildResultViewModel({
    recognition: { status: "manual_ready" },
    scoring: {
      isWin: true,
      totalFan: 2,
      minWinningFan: 1,
      winPattern: "standard",
      matchedFans: [],
      excludedFans: []
    },
    settlement: {
      rows: [
        { seat: "E", name: "东家", scoreBefore: 0, delta: 2, scoreAfter: 2 }
      ]
    },
    explanation: "ok"
  });
  assert.equal(Array.isArray(vm.settlement.rows), true);
  assert.equal(vm.settlement.rows[0].seat, "E");
});

test("buildResultViewModel exposes settlementErrorText when settlement is invalid", () => {
  const vm = buildResultViewModel({
    recognition: { status: "manual_ready" },
    scoring: {
      isWin: true,
      totalFan: 2,
      minWinningFan: 1,
      winPattern: "standard",
      matchedFans: [],
      excludedFans: []
    },
    settlement: {
      ok: false,
      problems: ["discarderSeat must be one of E/S/W/N and not winnerSeat"],
      rows: [
        { seat: "E", name: "东家", scoreBefore: 0, delta: 0, scoreAfter: 0 }
      ]
    },
    explanation: "ok"
  });
  assert.equal(vm.hasSettlementError, true);
  assert.match(vm.settlementErrorText, /结算校验失败：/);
});

test("buildResultViewModel maps rule meta text", () => {
  const vm = buildResultViewModel({
    recognition: { status: "manual_ready" },
    scoring: {
      isWin: true,
      totalFan: 2,
      minWinningFan: 1,
      winPattern: "standard",
      matchedFans: [],
      excludedFans: []
    },
    ruleMeta: { id: "MCR_Official", name: "国标预设", version: "1.0.0" }
  });
  assert.match(vm.ruleMetaText, /国标预设/);
  assert.match(vm.ruleMetaText, /1.0.0/);
});

test("buildResultViewModel defaults gateFan to totalFan when omitted", () => {
  const vm = buildResultViewModel({
    recognition: { status: "manual_ready" },
    scoring: {
      isWin: true,
      totalFan: 5,
      minWinningFan: 8,
      winPattern: "standard",
      matchedFans: [],
      excludedFans: []
    },
    explanation: "ok"
  });
  assert.equal(vm.gateFan, 5);
});

test("buildResultViewModel maps gateFan when below totalFan (花牌等不计起和)", () => {
  const vm = buildResultViewModel({
    recognition: { status: "manual_ready" },
    scoring: {
      isWin: true,
      totalFan: 10,
      gateFan: 8,
      minWinningFan: 8,
      winPattern: "standard",
      matchedFans: [],
      excludedFans: []
    },
    explanation: "ok"
  });
  assert.equal(vm.totalFan, 10);
  assert.equal(vm.gateFan, 8);
});
