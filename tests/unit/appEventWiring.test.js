import test from "node:test";
import assert from "node:assert/strict";
import { shouldOpenPickerForContextButton } from "../../public/appEventWiring.js";

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
