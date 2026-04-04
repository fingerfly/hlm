import test from "node:test";
import assert from "node:assert/strict";
import { formatResultFanSummary } from "../../public/resultModalView.js";

test("formatResultFanSummary shows total only when gate equals total", () => {
  assert.equal(formatResultFanSummary(8, 8), "8 番");
  assert.equal(formatResultFanSummary(0, 0), "0 番");
});

test("formatResultFanSummary shows gate line when gate differs from total", () => {
  assert.equal(
    formatResultFanSummary(10, 8),
    "10 番（起和 8 番）"
  );
});

test("formatResultFanSummary clamps negatives to zero", () => {
  assert.equal(formatResultFanSummary(-1, 2), "0 番（起和 2 番）");
  assert.equal(formatResultFanSummary(3, -1), "3 番（起和 0 番）");
});
