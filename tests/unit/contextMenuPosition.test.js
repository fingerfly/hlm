import test from "node:test";
import assert from "node:assert/strict";
import { computeContextMenuPosition } from "../../public/contextMenuPosition.js";

test("context menu uses below placement when space allows", () => {
  const point = { left: 20, top: 100, right: 80, bottom: 140 };
  const menu = { width: 180, height: 200 };
  const viewport = { width: 390, height: 844 };
  const pos = computeContextMenuPosition(point, menu, viewport);
  assert.equal(pos.placement, "bottom");
  assert.equal(pos.top >= 144, true);
});

test("context menu flips above when bottom space is tight", () => {
  const point = { left: 20, top: 700, right: 80, bottom: 740 };
  const menu = { width: 180, height: 200 };
  const viewport = { width: 390, height: 844 };
  const pos = computeContextMenuPosition(point, menu, viewport);
  assert.equal(pos.placement, "top");
  assert.equal(pos.top < point.top, true);
});

test("context menu clamps left and right to viewport", () => {
  const point = { left: 320, top: 200, right: 380, bottom: 240 };
  const menu = { width: 220, height: 200 };
  const viewport = { width: 390, height: 844 };
  const pos = computeContextMenuPosition(point, menu, viewport);
  assert.equal(pos.left <= viewport.width - menu.width, true);
  assert.equal(pos.left >= 8, true);
});
