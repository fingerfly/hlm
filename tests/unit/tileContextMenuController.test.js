/**
 * Purpose: Unit tests for tile context menu controller.
 * Description:
 * - openTileContextMenu(tile) without event uses fallback position.
 * - openTileContextMenu(tile, event) with event positions near anchor.
 */
import test from "node:test";
import assert from "node:assert/strict";

if (typeof globalThis.document === "undefined") {
  globalThis.document = {
    addEventListener: () => {},
    removeEventListener: () => {}
  };
}
if (typeof globalThis.window === "undefined") {
  globalThis.window = { innerWidth: 390, innerHeight: 844 };
}
import { createTilePickerState } from "../../src/app/tilePickerState.js";
import { createOpenTileContextMenu } from "../../public/tileContextMenuController.js";

function createFakeMenu() {
  const style = {};
  return {
    hidden: true,
    style,
    offsetHeight: 80,
    offsetWidth: 120,
    contains: () => false,
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  };
}

function createFakeAnchor(rect) {
  return {
    getBoundingClientRect: () => rect,
    closest: () => null
  };
}

test("openTileContextMenu without event uses fallback position", () => {
  const menu = createFakeMenu();
  const store = {
    pickerState: createTilePickerState(["1W", "2W"])
  };
  const { openTileContextMenu } = createOpenTileContextMenu({
    store,
    byId: (id) => (id === "tileContextMenu" ? menu : null),
    pickTileWithAction: () => true
  });

  openTileContextMenu("5W");

  assert.equal(menu.hidden, false);
  assert.equal(menu.style.bottom, "100px");
  assert.equal(menu.style.left, "50%");
  assert.equal(menu.style.transform, "translateX(-50%)");
});

test("openTileContextMenu with event positions near anchor", () => {
  const menu = createFakeMenu();
  const rect = {
    left: 100,
    top: 200,
    right: 140,
    bottom: 240,
    width: 40,
    height: 40
  };
  const anchor = createFakeAnchor(rect);
  const event = { target: anchor, currentTarget: anchor };
  Object.defineProperty(anchor, "closest", {
    value: () => anchor,
    configurable: true
  });

  const store = {
    pickerState: createTilePickerState(["1W", "2W"])
  };
  const { openTileContextMenu } = createOpenTileContextMenu({
    store,
    byId: (id) => (id === "tileContextMenu" ? menu : null),
    pickTileWithAction: () => true
  });

  openTileContextMenu("5W", event);

  assert.equal(menu.hidden, false);
  assert.equal(menu.style.bottom, "");
  assert.ok(menu.style.top !== undefined);
  assert.ok(menu.style.left !== undefined);
  assert.equal(menu.style.transform, "");
});

test("openTileContextMenu with null event uses fallback", () => {
  const menu = createFakeMenu();
  const store = {
    pickerState: createTilePickerState(["1W"])
  };
  const { openTileContextMenu } = createOpenTileContextMenu({
    store,
    byId: (id) => (id === "tileContextMenu" ? menu : null),
    pickTileWithAction: () => true
  });

  openTileContextMenu("2W", null);

  assert.equal(menu.hidden, false);
  assert.equal(menu.style.bottom, "100px");
  assert.equal(menu.style.left, "50%");
});
