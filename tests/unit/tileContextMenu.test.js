/**
 * Purpose: Unit tests for pickTileWithAction (tile-click context menu).
 * Description:
 * - Tests explicit action-id tile insertion.
 * - Verifies 12/13/14 boundary behavior.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  createTilePickerState,
  addTilesToPicker,
  selectPickerSlot as selectSlot,
  pickerToTiles
} from "../../src/app/tilePickerState.js";
import { resolvePatternAction } from "../../src/app/tilePatternActions.js";
import { createHandPickerActions } from "../../public/handPickerActions.js";

test("pickTileWithAction adds single tile when action is single", () => {
  const store = {
    pickerState: createTilePickerState([]),
    pickerAction: "single",
    pickerActionLock: null,
    pickerActionOnce: null
  };
  const input = {
    store,
    refs: {},
    addTilesToPicker,
    resolvePatternAction,
    selectPickerSlot: () => {},
    deleteSelectedSlot: () => {},
    clearTilePicker: () => {},
    undoLastAction: () => {},
    syncHomeState: () => {}
  };
  const actions = createHandPickerActions(input);
  assert.ok(typeof actions.pickTileWithAction === "function");

  const ok = actions.pickTileWithAction("5W", "single");
  assert.equal(ok, true);
  assert.deepEqual(pickerToTiles(store.pickerState), ["5W"]);
});

test("pickTileWithAction adds pair when action is pair", () => {
  const store = {
    pickerState: createTilePickerState([]),
    pickerAction: "single",
    pickerActionLock: null,
    pickerActionOnce: null
  };
  const input = {
    store,
    refs: {},
    addTilesToPicker,
    resolvePatternAction,
    selectPickerSlot: () => {},
    deleteSelectedSlot: () => {},
    clearTilePicker: () => {},
    undoLastAction: () => {},
    syncHomeState: () => {}
  };
  const actions = createHandPickerActions(input);

  const ok = actions.pickTileWithAction("3W", "pair");
  assert.equal(ok, true);
  assert.deepEqual(pickerToTiles(store.pickerState), ["3W", "3W"]);
});

test("pickTileWithAction returns false when insufficient slots", () => {
  const slots = ["1W", "1W", "1W", "2W", "2W", "2W", "3W", "3W", "3W",
    "4W", "4W", "4W", "5W", ""];
  const store = {
    pickerState: createTilePickerState(slots.filter(Boolean)),
    pickerAction: "single",
    pickerActionLock: null,
    pickerActionOnce: null
  };
  const input = {
    store,
    refs: {},
    addTilesToPicker,
    resolvePatternAction,
    selectPickerSlot: () => {},
    deleteSelectedSlot: () => {},
    clearTilePicker: () => {},
    undoLastAction: () => {},
    syncHomeState: () => {}
  };
  const actions = createHandPickerActions(input);

  const ok = actions.pickTileWithAction("9B", "pair");
  assert.equal(ok, false);
  assert.equal(pickerToTiles(store.pickerState).length, 13);
});

test("pickTileWithAction respects editingIndex for slot-tap flow", () => {
  const slots = ["1W", "1W", "9B", "2W", "3W", "4W", "5W", "6W", "7W",
    "2T", "3T", "4T", "9B", ""];
  const store = {
    pickerState: createTilePickerState(slots.filter(Boolean)),
    pickerAction: "single",
    pickerActionLock: null,
    pickerActionOnce: null
  };
  store.pickerState = selectSlot(store.pickerState, 2);
  const input = {
    store,
    refs: {},
    addTilesToPicker,
    resolvePatternAction,
    selectPickerSlot: selectSlot,
    deleteSelectedSlot: () => store.pickerState,
    clearTilePicker: () => store.pickerState,
    undoLastAction: () => store.pickerState,
    syncHomeState: () => {}
  };
  const actions = createHandPickerActions(input);

  const ok = actions.pickTileWithAction("5T", "single");
  assert.equal(ok, true);
  assert.equal(store.pickerState.slots[2], "5T");
  assert.equal(store.pickerState.editingIndex, null);
});
