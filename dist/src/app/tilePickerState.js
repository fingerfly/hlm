/**
 * Purpose: Manage fixed-slot tile picker state.
 * Description:
 * - Keeps a 14-slot tile array and write cursor.
 * - Supports append, undo, clear, and derived tile list helpers.
 * - Preserves immutable updates for UI state synchronization.
 */
const TILE_SLOTS = 14;
const MAX_HISTORY = 50;

/**
 * Create picker state from optional initial tiles.
 *
 * @param {string[]} [initialTiles=[]] - Initial tile codes.
 * @returns {{slots: string[], cursor: number}}
 */
export function createTilePickerState(initialTiles = []) {
  const slots = new Array(TILE_SLOTS).fill("");
  const tiles = initialTiles.slice(0, TILE_SLOTS);
  for (let i = 0; i < tiles.length; i += 1) {
    slots[i] = tiles[i];
  }
  return {
    slots,
    cursor: tiles.length,
    editingIndex: null,
    actionHistory: []
  };
}

/**
 * Add one tile to picker slots using cursor semantics.
 *
 * @param {{slots: string[], cursor: number}} state - Picker state.
 * @param {string} tileCode - Tile code to place.
 * @returns {{slots: string[], cursor: number}}
 */
export function addTileToPicker(state, tileCode) {
  const next = {
    slots: [...state.slots],
    cursor: state.cursor,
    editingIndex: state.editingIndex ?? null
  };
  if (typeof next.editingIndex === "number") {
    const index = next.editingIndex;
    if (index < 0 || index >= TILE_SLOTS) {
      next.editingIndex = null;
      return next;
    }
    next.slots[index] = tileCode;
    if (index >= next.cursor) {
      next.cursor = index + 1;
    }
    next.editingIndex = null;
    return next;
  }
  if (next.cursor < TILE_SLOTS) {
    next.slots[next.cursor] = tileCode;
    next.cursor += 1;
    return next;
  }
  next.slots[TILE_SLOTS - 1] = tileCode;
  next.editingIndex = null;
  return next;
}

/**
 * Add multiple tiles as one action and record for undo.
 *
 * @param {{slots: string[], cursor: number, editingIndex: number|null,
 *   actionHistory: object[]}} state - Picker state.
 * @param {string[]} tiles - Tile codes to add.
 * @returns {{slots: string[], cursor: number, editingIndex: number|null,
 *   actionHistory: object[]}}
 */
export function addTilesToPicker(state, tiles) {
  if (!tiles.length) return state;
  const next = {
    slots: [...state.slots],
    cursor: state.cursor,
    editingIndex: state.editingIndex ?? null,
    actionHistory: [...(state.actionHistory || [])]
  };
  const slotIndices = [];
  let writeIdx = next.editingIndex;
  if (Number.isInteger(writeIdx) && writeIdx >= 0 && writeIdx < TILE_SLOTS) {
    next.editingIndex = null;
  } else {
    writeIdx = next.cursor;
  }
  for (const tileCode of tiles) {
    if (writeIdx >= TILE_SLOTS) break;
    next.slots[writeIdx] = tileCode;
    slotIndices.push(writeIdx);
    writeIdx += 1;
  }
  next.cursor = Math.max(next.cursor, writeIdx);
  if (next.cursor >= TILE_SLOTS) {
    next.cursor = pickerToTiles({ slots: next.slots }).length;
  }
  const entry = { slotIndices, tiles: tiles.slice(0, slotIndices.length) };
  next.actionHistory = next.actionHistory.slice(-(MAX_HISTORY - 1));
  next.actionHistory.push(entry);
  return next;
}

/**
 * Select one picker slot for edit-mode replacement.
 *
 * @param {{slots: string[], cursor: number}} state - Picker state.
 * @param {number} index - Target slot index.
 * @returns {{slots: string[], cursor: number, editingIndex: number|null}}
 */
export function selectPickerSlot(state, index) {
  if (!Number.isInteger(index) || index < 0 || index >= TILE_SLOTS) {
    return {
      ...state,
      editingIndex: null
    };
  }
  return {
    ...state,
    editingIndex: index
  };
}

/**
 * Remove selected slot and compact tiles to the left.
 *
 * @param {{slots: string[], cursor: number, editingIndex: number|null}} state
 * @returns {{slots: string[], cursor: number, editingIndex: number|null}}
 */
export function deleteSelectedSlot(state) {
  if (!Number.isInteger(state.editingIndex)) {
    return {
      ...state,
      editingIndex: null
    };
  }
  const index = state.editingIndex;
  if (index < 0 || index >= TILE_SLOTS) {
    return {
      ...state,
      editingIndex: null
    };
  }
  const nextSlots = [...state.slots];
  for (let i = index; i < TILE_SLOTS - 1; i += 1) {
    nextSlots[i] = nextSlots[i + 1];
  }
  nextSlots[TILE_SLOTS - 1] = "";
  const nextCursor = Math.max(0, pickerToTiles({ slots: nextSlots }).length);
  return {
    ...state,
    slots: nextSlots,
    cursor: nextCursor,
    editingIndex: null
  };
}

/**
 * Undo the latest tile insertion if cursor is not zero.
 *
 * @param {{slots: string[], cursor: number}} state - Picker state.
 * @returns {{slots: string[], cursor: number}}
 */
export function undoLastTile(state) {
  if (state.cursor <= 0) return state;
  const next = {
    slots: [...state.slots],
    cursor: state.cursor - 1,
    editingIndex: null
  };
  next.slots[next.cursor] = "";
  return next;
}

/**
 * Undo the last recorded action (whole group).
 *
 * @param {{slots: string[], actionHistory: object[]}} state - Picker state.
 * @returns {{slots: string[], cursor: number, actionHistory: object[]}}
 */
export function undoLastAction(state) {
  const history = state.actionHistory || [];
  if (!history.length) return state;
  const entry = history[history.length - 1];
  const slotIndices = new Set(entry.slotIndices || []);
  const remaining = [];
  for (let i = 0; i < TILE_SLOTS; i += 1) {
    if (!slotIndices.has(i) && state.slots[i]) {
      remaining.push(state.slots[i]);
    }
  }
  const pad = TILE_SLOTS - remaining.length;
  const nextSlots = [...remaining, ...new Array(pad).fill("")];
  return {
    ...state,
    slots: nextSlots,
    cursor: remaining.length,
    editingIndex: null,
    actionHistory: history.slice(0, -1)
  };
}

/**
 * Undo the last action affecting the given slot.
 *
 * @param {{slots: string[], actionHistory: object[]}} state - Picker state.
 * @param {number} slotIndex - Slot to undo for.
 * @returns {{slots: string[], cursor: number, actionHistory: object[]}}
 */
export function undoBySlot(state, slotIndex) {
  const history = state.actionHistory || [];
  const invalid =
    !Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= TILE_SLOTS;
  if (invalid) return state;
  let idx = history.length - 1;
  for (; idx >= 0; idx -= 1) {
    const entry = history[idx];
    if ((entry.slotIndices || []).includes(slotIndex)) break;
  }
  if (idx < 0) return state;
  const entry = history[idx];
  const slotIndices = new Set(entry.slotIndices || []);
  const remaining = [];
  for (let i = 0; i < TILE_SLOTS; i += 1) {
    if (!slotIndices.has(i) && state.slots[i]) {
      remaining.push(state.slots[i]);
    }
  }
  const pad = TILE_SLOTS - remaining.length;
  const nextSlots = [...remaining, ...new Array(pad).fill("")];
  const newHistory = [...history.slice(0, idx), ...history.slice(idx + 1)];
  return {
    ...state,
    slots: nextSlots,
    cursor: remaining.length,
    editingIndex: null,
    actionHistory: newHistory
  };
}

/**
 * Clear all picker slots and reset cursor to zero.
 *
 * @param {{selectedTab?: string}} state - Picker state.
 * @returns {{slots: string[], cursor: number, selectedTab: string}}
 */
export function clearTilePicker(state) {
  return {
    slots: new Array(TILE_SLOTS).fill(""),
    cursor: 0,
    selectedTab: state.selectedTab || "W",
    editingIndex: null,
    actionHistory: []
  };
}

/**
 * Convert picker slots into compact tile list.
 *
 * @param {{slots: string[]}} state - Picker state.
 * @returns {string[]}
 */
export function pickerToTiles(state) {
  return state.slots.filter(Boolean);
}

/**
 * Check whether picker has all 14 tiles selected.
 *
 * @param {{slots: string[]}} state - Picker state.
 * @returns {boolean}
 */
export function isPickerReady(state) {
  return pickerToTiles(state).length === TILE_SLOTS;
}
