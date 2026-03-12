/**
 * Purpose: Manage fixed-slot tile picker state.
 * Description:
 * - Keeps a 14-slot tile array and write cursor.
 * - Supports append, undo, clear, and derived tile list helpers.
 * - Preserves immutable updates for UI state synchronization.
 */
const TILE_SLOTS = 14;

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
    cursor: tiles.length
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
    cursor: state.cursor
  };
  if (next.cursor < TILE_SLOTS) {
    next.slots[next.cursor] = tileCode;
    next.cursor += 1;
    return next;
  }
  next.slots[TILE_SLOTS - 1] = tileCode;
  return next;
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
    cursor: state.cursor - 1
  };
  next.slots[next.cursor] = "";
  return next;
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
    selectedTab: state.selectedTab || "W"
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
