import test from "node:test";
import assert from "node:assert/strict";
import {
  createTilePickerState,
  addTileToPicker,
  selectPickerSlot,
  deleteSelectedSlot,
  undoLastTile,
  clearTilePicker,
  pickerToTiles,
  isPickerReady
} from "../../src/app/tilePickerState.js";

test("tile picker adds tiles until 14 slots", () => {
  let state = createTilePickerState();
  for (let i = 0; i < 16; i += 1) {
    state = addTileToPicker(state, "1W");
  }
  assert.equal(state.cursor, 14);
  assert.equal(pickerToTiles(state).length, 14);
});

test("tile picker supports undo and clear", () => {
  let state = createTilePickerState();
  state = addTileToPicker(state, "1W");
  state = addTileToPicker(state, "2W");
  state = undoLastTile(state);
  assert.deepEqual(pickerToTiles(state), ["1W"]);
  state = clearTilePicker(state);
  assert.equal(pickerToTiles(state).length, 0);
});

test("tile picker reports readiness only at 14 tiles", () => {
  let state = createTilePickerState();
  for (let i = 0; i < 13; i += 1) {
    state = addTileToPicker(state, "1W");
  }
  assert.equal(isPickerReady(state), false);
  state = addTileToPicker(state, "1W");
  assert.equal(isPickerReady(state), true);
});

test("tile picker can select slot and replace tile", () => {
  let state = createTilePickerState(["1W", "2W", "3W"]);
  state = selectPickerSlot(state, 1);
  assert.equal(state.editingIndex, 1);
  state = addTileToPicker(state, "9W");
  assert.deepEqual(pickerToTiles(state), ["1W", "9W", "3W"]);
  assert.equal(state.cursor, 3);
  assert.equal(state.editingIndex, null);
});

test("tile picker can delete selected slot with left compaction", () => {
  let state = createTilePickerState(["1W", "2W", "3W", "4W"]);
  state = selectPickerSlot(state, 1);
  state = deleteSelectedSlot(state);
  assert.deepEqual(pickerToTiles(state), ["1W", "3W", "4W"]);
  assert.equal(state.cursor, 3);
  assert.equal(state.editingIndex, null);
});

test("clear and undo reset editing mode", () => {
  let state = createTilePickerState(["1W", "2W"]);
  state = selectPickerSlot(state, 0);
  state = undoLastTile(state);
  assert.equal(state.editingIndex, null);
  state = selectPickerSlot(state, 0);
  state = clearTilePicker(state);
  assert.equal(state.editingIndex, null);
});
