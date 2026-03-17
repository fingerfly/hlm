import test from "node:test";
import assert from "node:assert/strict";
import {
  hasUndoBySlotTarget,
  getContextMenuControlState
} from "../../public/contextMenuView.js";

test("hasUndoBySlotTarget returns false for invalid inputs", () => {
  assert.equal(hasUndoBySlotTarget([], -1), false);
  assert.equal(hasUndoBySlotTarget([], 14), false);
  assert.equal(hasUndoBySlotTarget(null, 1), false);
});

test("hasUndoBySlotTarget returns true when history includes slot", () => {
  const history = [
    { slotIndices: [0, 1], tiles: ["1W", "1W"] },
    { slotIndices: [3], tiles: ["3W"] }
  ];
  assert.equal(hasUndoBySlotTarget(history, 1), true);
  assert.equal(hasUndoBySlotTarget(history, 3), true);
  assert.equal(hasUndoBySlotTarget(history, 2), false);
});

test("getContextMenuControlState enables undo buttons by state", () => {
  const none = getContextMenuControlState({
    editingIndex: null,
    actionHistory: []
  });
  assert.equal(none.undoLastEnabled, false);
  assert.equal(none.undoSlotEnabled, false);

  const withLast = getContextMenuControlState({
    editingIndex: null,
    actionHistory: [{ slotIndices: [0], tiles: ["1W"] }]
  });
  assert.equal(withLast.undoLastEnabled, true);
  assert.equal(withLast.undoSlotEnabled, false);

  const withSlot = getContextMenuControlState({
    editingIndex: 0,
    actionHistory: [{ slotIndices: [0], tiles: ["1W"] }]
  });
  assert.equal(withSlot.undoLastEnabled, true);
  assert.equal(withSlot.undoSlotEnabled, true);
});
