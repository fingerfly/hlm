import test from "node:test";
import assert from "node:assert/strict";
import {
  getPickerTilesByMode
} from "../../public/appEventWiring.js";
import { shouldOpenPickerForContextButton } from "../../public/appEventBindings.js";

test("parent menu button does not open picker", () => {
  const btn = { dataset: { contextAction: "tab", tab: "W", menuLevel: "parent" } };
  assert.equal(shouldOpenPickerForContextButton(btn), false);
});

test("leaf menu button opens picker", () => {
  const btn = { dataset: { contextAction: "single" } };
  assert.equal(shouldOpenPickerForContextButton(btn), true);
});

test("leaf with explicit menuLevel opens picker", () => {
  const btn = { dataset: { contextAction: "pair", menuLevel: "leaf" } };
  assert.equal(shouldOpenPickerForContextButton(btn), true);
});

test("chow options as leaf open picker", () => {
  for (const action of ["chow_front", "chow_middle", "chow_back"]) {
    const btn = { dataset: { contextAction: action } };
    assert.equal(shouldOpenPickerForContextButton(btn), true, action);
  }
});

test("null or missing btn returns false", () => {
  assert.equal(shouldOpenPickerForContextButton(null), false);
  assert.equal(shouldOpenPickerForContextButton(undefined), false);
});

test("getPickerTilesByMode returns all tiles in flat mode", () => {
  const tabTiles = {
    W: ["1W", "2W"],
    T: ["1T"],
    B: ["1B"],
    Z: ["E"]
  };
  const tiles = getPickerTilesByMode(tabTiles, "flat", "W");
  assert.deepEqual(tiles, ["1W", "2W", "1T", "1B", "E"]);
});

test("getPickerTilesByMode returns active tab in twoLayer mode", () => {
  const tabTiles = {
    W: ["1W", "2W"],
    T: ["1T"],
    B: ["1B"],
    Z: ["E"]
  };
  const tiles = getPickerTilesByMode(tabTiles, "twoLayer", "T");
  assert.deepEqual(tiles, ["1T"]);
});
