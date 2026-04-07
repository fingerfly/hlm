import test from "node:test";
import assert from "node:assert/strict";
import {
  getPickerTilesByMode,
  syncWizardModals,
  handleWizardNextClick,
  createHelpHandlers,
  isDesktopHelpPopover
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

test("syncWizardModals keeps picker for missing tiles on tile step", () => {
  const calls = [];
  const modalActions = {
    openModalByKey: (key) => calls.push(`open:${key}`),
    closeModalByKey: (key) => calls.push(`close:${key}`)
  };
  syncWizardModals({ ok: false, needs: "tiles", step: 2 }, modalActions);
  assert.deepEqual(calls, ["close:context", "open:picker"]);
});

test("syncWizardModals switches from picker to context at step 3 (mobile)", () => {
  const calls = [];
  const modalActions = {
    openModalByKey: (key) => calls.push(`open:${key}`),
    closeModalByKey: (key) => calls.push(`close:${key}`)
  };
  syncWizardModals({ ok: true, step: 3 }, modalActions);
  assert.deepEqual(calls, ["close:picker", "open:context"]);
});

test("handleWizardNextClick from step 3 invokes hook when calculate false", () => {
  const hooks = { calls: 0 };
  const modalCalls = [];
  const store = {
    uiState: {
      wizard: { step: 3 },
      hand: { tiles: new Array(14).fill("1W") }
    }
  };
  const stateActions = {
    calculate: () => false,
    goWizardNext: () => {
      throw new Error("goWizardNext should not be called from step 3");
    }
  };
  const modalActions = {
    closeModalByKey: (key) => modalCalls.push(`close:${key}`),
    openModalByKey: (key) => modalCalls.push(`open:${key}`),
    updateModalUi: () => {
      throw new Error("updateModalUi should not run when calculate false");
    }
  };
  handleWizardNextClick(store, stateActions, modalActions, () => {}, {
    onStep3CalculateFailed: () => {
      hooks.calls += 1;
    }
  });
  assert.equal(hooks.calls, 1);
  assert.deepEqual(modalCalls, ["close:picker", "close:context", "open:context"]);
});

test("handleWizardNextClick from step 3 calculates and shows result", () => {
  const modalCalls = [];
  const store = {
    uiState: {
      wizard: { step: 3 },
      hand: { tiles: new Array(14).fill("1W") }
    }
  };
  const stateActions = {
    calculate: () => true,
    goWizardNext: () => {
      throw new Error("goWizardNext should not be called from step 3");
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

test("handleWizardNextClick from step 1 advances via goWizardNext + sync", () => {
  const modalCalls = [];
  const store = {
    uiState: {
      wizard: { step: 1 },
      hand: { tiles: [] }
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
  assert.deepEqual(modalCalls, ["close:context", "open:picker"]);
});

test("syncWizardModals desktop step 2 opens picker", () => {
  const prev = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: true });
  const calls = [];
  const modalActions = {
    openModalByKey: (key) => calls.push(`open:${key}`),
    closeModalByKey: (key) => calls.push(`close:${key}`)
  };
  syncWizardModals({ ok: true, step: 2 }, modalActions);
  globalThis.matchMedia = prev;
  assert.deepEqual(calls, ["close:context", "open:picker"]);
});

test("syncWizardModals desktop step 3 closes picker for inline context", () => {
  const prev = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: true });
  const calls = [];
  const modalActions = {
    openModalByKey: (key) => calls.push(`open:${key}`),
    closeModalByKey: (key) => calls.push(`close:${key}`)
  };
  syncWizardModals({ ok: true, step: 3 }, modalActions);
  globalThis.matchMedia = prev;
  assert.deepEqual(calls, ["close:context", "close:picker"]);
});

test("syncWizardModals desktop step 1 keeps picker closed", () => {
  const prev = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: true });
  const calls = [];
  const modalActions = {
    openModalByKey: (key) => calls.push(`open:${key}`),
    closeModalByKey: (key) => calls.push(`close:${key}`)
  };
  syncWizardModals({ ok: true, step: 1 }, modalActions);
  globalThis.matchMedia = prev;
  assert.deepEqual(calls, ["close:context", "close:picker"]);
});

test("createHelpHandlers opens help modal when not desktop popover", () => {
  const prev = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: false });
  const calls = [];
  const moreBtn = { focus: () => calls.push("focus:moreBtn") };
  const helpCloseBtn = { focus: () => calls.push("focus:helpCloseBtn") };
  const byId = (id) => {
    if (id === "moreBtn") return moreBtn;
    if (id === "helpCloseBtn") return helpCloseBtn;
    return null;
  };
  const modalActions = {
    openModalByKey: (key) => calls.push(`open:${key}`),
    closeModalByKey: () => {}
  };
  const { openHelp } = createHelpHandlers(byId, modalActions);
  openHelp({ currentTarget: moreBtn });
  globalThis.matchMedia = prev;
  assert.deepEqual(calls, ["open:help", "focus:helpCloseBtn"]);
});

test("createHelpHandlers uses popover on desktop without opening help modal", () => {
  const prev = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: true });
  const calls = [];
  const popover = { hidden: true };
  const moreBtn = {
    focus: () => calls.push("focus:moreBtn"),
    setAttribute: (name, v) => calls.push(`attr:${name}=${v}`)
  };
  const popClose = { focus: () => calls.push("focus:helpPopoverCloseBtn") };
  const byId = (id) => {
    if (id === "moreBtn") return moreBtn;
    if (id === "helpPopover") return popover;
    if (id === "helpPopoverCloseBtn") return popClose;
    return null;
  };
  const modalActions = {
    openModalByKey: (key) => calls.push(`open:${key}`),
    closeModalByKey: () => {}
  };
  const { openHelp } = createHelpHandlers(byId, modalActions);
  openHelp({ currentTarget: moreBtn });
  globalThis.matchMedia = prev;
  assert.equal(popover.hidden, false);
  assert.deepEqual(calls, [
    "attr:aria-expanded=true",
    "focus:helpPopoverCloseBtn"
  ]);
});

test("createHelpHandlers restores focus to trigger when closing modal help", () => {
  const prev = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: false });
  const calls = [];
  const moreBtn = { focus: () => calls.push("focus:moreBtn") };
  const byId = (id) => (id === "moreBtn" ? moreBtn : null);
  const modalActions = {
    openModalByKey: () => {},
    closeModalByKey: (key) => calls.push(`close:${key}`)
  };
  const { openHelp, closeHelp } = createHelpHandlers(byId, modalActions);
  openHelp({ currentTarget: moreBtn });
  closeHelp();
  globalThis.matchMedia = prev;
  assert.deepEqual(calls, ["close:help", "focus:moreBtn"]);
});

test("createHelpHandlers closes desktop popover without modal close", () => {
  const prev = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: true });
  const calls = [];
  const popover = { hidden: false };
  const moreBtn = {
    focus: () => calls.push("focus:moreBtn"),
    setAttribute: (name, v) => calls.push(`attr:${name}=${v}`)
  };
  const popClose = { focus: () => calls.push("focus:helpPopoverCloseBtn") };
  const byId = (id) => {
    if (id === "moreBtn") return moreBtn;
    if (id === "helpPopover") return popover;
    if (id === "helpPopoverCloseBtn") return popClose;
    return null;
  };
  const modalActions = {
    openModalByKey: () => {},
    closeModalByKey: (key) => calls.push(`close:${key}`)
  };
  const { openHelp, closeHelp } = createHelpHandlers(byId, modalActions);
  openHelp({ currentTarget: moreBtn });
  closeHelp();
  globalThis.matchMedia = prev;
  assert.equal(popover.hidden, true);
  assert.deepEqual(calls, [
    "attr:aria-expanded=true",
    "focus:helpPopoverCloseBtn",
    "attr:aria-expanded=false",
    "focus:moreBtn"
  ]);
});

test("isDesktopHelpPopover follows min-width 1024px media query", () => {
  const prev = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: true });
  assert.equal(isDesktopHelpPopover(), true);
  globalThis.matchMedia = () => ({ matches: false });
  assert.equal(isDesktopHelpPopover(), false);
  globalThis.matchMedia = prev;
});
