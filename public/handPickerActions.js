/**
 * Purpose: Build picker mutation actions.
 * Description:
 * - Applies pattern-based tile insertion for selected action.
 * - Applies slot selection, delete, and undo operations.
 */
import { writeStoredGestureTipDismissed } from "./pickerModeState.js";

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
    syncHomeState
  } = input;
  function effectiveActionId() {
    return store.pickerActionLock || store.pickerActionOnce || "single";
  }
  function clearOneShotAction() {
    store.pickerActionOnce = null;
    if (!store.pickerActionLock) {
      store.pickerAction = "single";
    }
  }
  function clearHand() {
    store.pickerState = clearTilePicker(store.pickerState);
    syncHomeState();
  }
  function tapPatternAction(actionId) {
    if (store.pickerActionLock === actionId) {
      store.pickerActionLock = null;
      clearOneShotAction();
      syncHomeState();
      return;
    }
    store.pickerActionOnce = actionId;
    store.pickerAction = actionId;
    syncHomeState();
  }
  function lockPatternAction(actionId) {
    if (store.pickerActionLock === actionId) {
      store.pickerActionLock = null;
      clearOneShotAction();
      syncHomeState();
      return;
    }
    store.pickerActionLock = actionId;
    store.pickerActionOnce = null;
    store.pickerAction = actionId;
    syncHomeState();
  }
  function setPatternAction(actionId) {
    tapPatternAction(actionId);
  }
  function dismissPickerGestureTip() {
    if (store.pickerGestureTipDismissed) return;
    store.pickerGestureTipDismissed = true;
    writeStoredGestureTipDismissed(true);
    syncHomeState();
  }
  function pickTile(baseTile) {
    const actionId = effectiveActionId();
    const result = resolvePatternAction(
      store.pickerState,
      baseTile,
      actionId
    );
    if (!result.ok) {
      if (refs.pickerActionHintEl) {
        refs.pickerActionHintEl.textContent =
          `快捷动作不可用：${result.reason}`;
      }
      return false;
    }
    store.pickerState = addTilesToPicker(store.pickerState, result.tiles);
    if (!store.pickerActionLock && store.pickerActionOnce) {
      clearOneShotAction();
    }
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
  return {
    clearHand,
    tapPatternAction,
    lockPatternAction,
    dismissPickerGestureTip,
    setPatternAction,
    pickTile,
    selectSlot,
    deleteSelected,
    undoHand
  };
}
