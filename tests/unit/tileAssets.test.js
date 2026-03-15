import test from "node:test";
import assert from "node:assert/strict";
import {
  getTileLabel,
  getTileImageDataUrl
} from "../../public/tileAssets.js";

test("getTileLabel returns Chinese labels for suited and honor tiles", () => {
  assert.equal(getTileLabel("1W"), "一万");
  assert.equal(getTileLabel("9T"), "九条");
  assert.equal(getTileLabel("Wh"), "白板");
});

test("getTileImageDataUrl returns deterministic local data URI", () => {
  const first = getTileImageDataUrl("1W");
  const second = getTileImageDataUrl("1W");
  assert.equal(first.startsWith("data:image/svg+xml;utf8,"), true);
  assert.equal(first, second);
});

test("getTileImageDataUrl returns null for unknown tile code", () => {
  const value = getTileImageDataUrl("X9");
  assert.equal(value, null);
});
