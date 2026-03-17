/**
 * Purpose: Render slot context menu visibility state.
 * Description:
 * - Toggles add-action buttons by availability map.
 * - Hides chow submenu when no chow option is visible.
 */

/**
 * Apply visibility map onto context menu actions.
 *
 * @param {HTMLElement} menuEl - Context menu root element.
 * @param {Record<string, {visible: boolean}>} map - Action availability map.
 * @returns {void}
 */
export function applyContextMenuAvailability(menuEl, map) {
  const actions = ["single", "pair", "pung"];
  for (const action of actions) {
    const btn = menuEl.querySelector(`[data-context-action="${action}"]`);
    if (!btn || !map[action]) continue;
    btn.hidden = !map[action].visible;
  }
  const chowActions = ["chow_front", "chow_middle", "chow_back"];
  let anyChow = false;
  for (const action of chowActions) {
    const btn = menuEl.querySelector(`[data-context-action="${action}"]`);
    if (!btn || !map[action]) continue;
    const visible = Boolean(map[action].visible);
    btn.hidden = !visible;
    anyChow = anyChow || visible;
  }
  const chowWrap = menuEl.querySelector(".context-chow-submenu");
  if (chowWrap) chowWrap.hidden = !anyChow;
}

/**
 * Check whether slot-specific undo has a matching history entry.
 *
 * @param {Array<{slotIndices?: number[]}>} actionHistory - History entries.
 * @param {number} slotIndex - Target slot index.
 * @returns {boolean}
 */
export function hasUndoBySlotTarget(actionHistory, slotIndex) {
  const invalidSlot =
    !Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex > 13;
  if (invalidSlot) return false;
  if (!Array.isArray(actionHistory) || !actionHistory.length) return false;
  for (let i = actionHistory.length - 1; i >= 0; i -= 1) {
    const slotIndices = actionHistory[i].slotIndices || [];
    if (slotIndices.includes(slotIndex)) return true;
  }
  return false;
}

/**
 * Compute undo control enabled states for context menu.
 *
 * @param {{editingIndex: number|null, actionHistory: object[]}} pickerState
 * @returns {{undoLastEnabled: boolean, undoSlotEnabled: boolean}}
 */
export function getContextMenuControlState(pickerState) {
  const history = Array.isArray(pickerState?.actionHistory)
    ? pickerState.actionHistory
    : [];
  const editingIndex = pickerState?.editingIndex;
  return {
    undoLastEnabled: history.length > 0,
    undoSlotEnabled: hasUndoBySlotTarget(history, editingIndex)
  };
}
