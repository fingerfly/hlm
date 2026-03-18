import test from "node:test";
import assert from "node:assert/strict";
import {
  getPickerTilesByMode,
  syncWizardModals,
  handleWizardNextClick
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

test("syncWizardModals keeps picker for missing tiles", () => {
  const calls = [];
  const modalActions = {
    openModalByKey: (key) => calls.push(`open:${key}`),
    closeModalByKey: (key) => calls.push(`close:${key}`)
  };
  syncWizardModals({ ok: false, needs: "tiles", step: 1 }, modalActions);
  assert.deepEqual(calls, ["close:context", "open:picker"]);
});

test("syncWizardModals switches from picker to context at step 2", () => {
  const calls = [];
  const modalActions = {
    openModalByKey: (key) => calls.push(`open:${key}`),
    closeModalByKey: (key) => calls.push(`close:${key}`)
  };
  syncWizardModals({ ok: true, step: 2 }, modalActions);
  assert.deepEqual(calls, ["close:picker", "open:context"]);
});

test("handleWizardNextClick from step 2 directly calculates and shows result", () => {
  const modalCalls = [];
  const store = {
    uiState: {
      wizard: { step: 2 },
      hand: { tiles: new Array(14).fill("1W") }
    }
  };
  const stateActions = {
    calculate: () => true,
    goWizardNext: () => {
      throw new Error("goWizardNext should not be called from step 2");
    }
  };
  const modalActions = {
    closeModalByKey: (key) => modalCalls.push(`close:${key}`),
    updateModalUi: () => modalCalls.push("updateModalUi")
  };
  const syncWizardModalsFn = () => modalCalls.push("syncWizardModals");
  handleWizardNextClick(store, stateActions, modalActions, syncWizardModalsFn);
  assert.deepEqual(modalCalls, [
    "close:picker",
    "close:context",
    "updateModalUi"
  ]);
});

test("handleWizardNextClick from step 1 advances wizard via goWizardNext", () => {
  const modalCalls = [];
  const store = {
    uiState: {
      wizard: { step: 1 },
      hand: { tiles: new Array(14).fill("1W") }
    }
  };
  const stateActions = {
    calculate: () => {
      throw new Error("calculate should not be called from step 1");
    },
    goWizardNext: () => ({ ok: true, step: 2 })
  };
  const modalActions = {
    closeModalByKey: (key) => modalCalls.push(`close:${key}`),
    updateModalUi: () => modalCalls.push("updateModalUi"),
    openModalByKey: (key) => modalCalls.push(`open:${key}`)
  };
  handleWizardNextClick(store, stateActions, modalActions, syncWizardModals);
  assert.deepEqual(modalCalls, ["close:picker", "open:context"]);
});
