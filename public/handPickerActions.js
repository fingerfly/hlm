/**
 * Purpose: Build picker mutation actions.
 * Description:
 * - Applies pattern-based tile insertion for selected action.
 * - Applies slot selection, delete, and undo operations.
 */

/**
 * Create picker mutation action handlers.
 *
 * @param {object} input - Picker action dependencies.
 * @returns {object}
 */
export function createHandPickerActions(input) {
  const {
    store,
    refs,
    addTilesToPicker,
    resolvePatternAction,
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastAction,
    undoBySlot,
    getContextActionAvailability,
    syncHomeState
  } = input;
  function clearHand() {
    store.pickerState = clearTilePicker(store.pickerState);
    syncHomeState();
  }
  function setPatternAction(actionId) {
    store.pickerAction = actionId;
    syncHomeState();
  }
  function getContextMenuAvailability() {
    const idx = store.pickerState.editingIndex;
    if (!Number.isInteger(idx)) return {};
    const baseTile = store.pickerState.slots[idx] || null;
    return getContextActionAvailability(store.pickerState, baseTile);
  }
  function pickTile(baseTile) {
    const result = resolvePatternAction(
      store.pickerState,
      baseTile,
      store.pickerAction
    );
    if (!result.ok) {
      if (refs.pickerActionHintEl) {
        refs.pickerActionHintEl.textContent =
          `快捷动作不可用：${result.reason}`;
      }
      return false;
    }
    store.pickerState = addTilesToPicker(store.pickerState, result.tiles);
    syncHomeState();
    return true;
  }
  function selectSlot(index) {
    store.pickerState = selectPickerSlot(store.pickerState, index);
    syncHomeState();
  }
  function deleteSelected() {
    store.pickerState = deleteSelectedSlot(store.pickerState);
    syncHomeState();
  }
  function undoHand() {
    store.pickerState = undoLastAction(store.pickerState);
    syncHomeState();
  }
  function undoSelectedSlot() {
    const idx = store.pickerState.editingIndex;
    if (!Number.isInteger(idx)) return;
    store.pickerState = undoBySlot(store.pickerState, idx);
    syncHomeState();
  }
  return {
    clearHand,
    setPatternAction,
    getContextMenuAvailability,
    pickTile,
    selectSlot,
    deleteSelected,
    undoHand,
    undoSelectedSlot
  };
}
