/**
 * Purpose: Hold immutable UI flow state transitions.
 * Description:
 * - Creates the initial state for hand, modal, and result areas.
 * - Applies modal open/close transitions by modal key.
 * - Stores latest scoring payload for modal rendering.
 */
function initialModalState() {
  return {
    picker: false,
    context: false,
    result: false,
    info: false
  };
}

/**
 * Build a fresh UI flow state object.
 *
 * @returns {{hand: {tiles: string[], activeTab: string},
 *   modal: {picker: boolean, context: boolean, result: boolean,
 *   info: boolean}, result: unknown}}
 */
export function createUiFlowState() {
  return {
    hand: {
      tiles: [],
      activeTab: "W"
    },
    modal: initialModalState(),
    result: null
  };
}

/**
 * Open one modal while preserving other modal flags.
 *
 * @param {object} state - Current ui flow state.
 * @param {string} modalKey - Modal key to open.
 * @returns {object}
 */
export function openModal(state, modalKey) {
  return {
    ...state,
    modal: {
      ...state.modal,
      [modalKey]: true
    }
  };
}

/**
 * Close one modal while preserving other modal flags.
 *
 * @param {object} state - Current ui flow state.
 * @param {string} modalKey - Modal key to close.
 * @returns {object}
 */
export function closeModal(state, modalKey) {
  return {
    ...state,
    modal: {
      ...state.modal,
      [modalKey]: false
    }
  };
}

/**
 * Store result payload and show the result modal.
 *
 * @param {object} state - Current ui flow state.
 * @param {unknown} payload - Evaluation output payload.
 * @returns {object}
 */
export function setResultPayload(state, payload) {
  return {
    ...state,
    result: payload,
    modal: {
      ...state.modal,
      result: true
    }
  };
}

/**
 * Check whether current state has enough tiles to score.
 *
 * @param {object} state - Current ui flow state.
 * @returns {boolean}
 */
export function canCalculate(state) {
  return Array.isArray(state.hand.tiles) && state.hand.tiles.length === 14;
}
