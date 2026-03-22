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
