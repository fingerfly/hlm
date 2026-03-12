import test from "node:test";
import assert from "node:assert/strict";
import {
  createTilePickerState,
  addTileToPicker,
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
