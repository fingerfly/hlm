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
    result: false
  };
}

function initialWizardState() {
  return { step: 1, totalSteps: 2 };
}

function clampWizardStep(step) {
  if (!Number.isInteger(step)) return 1;
  if (step < 1) return 1;
  if (step > 2) return 2;
  return step;
}

/**
 * Build a fresh UI flow state object.
 *
 * @returns {{hand: {tiles: string[], activeTab: string},
 *   modal: {picker: boolean, context: boolean, result: boolean},
 *   result: unknown}}
 */
export function createUiFlowState() {
  return {
    hand: {
      tiles: [],
      activeTab: "W"
    },
    wizard: initialWizardState(),
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

/**
 * Set current wizard step with bounds.
 *
 * @param {object} state - Current ui flow state.
 * @param {number} step - Desired step number.
 * @returns {object}
 */
export function setWizardStep(state, step) {
  return {
    ...state,
    wizard: {
      ...(state.wizard || initialWizardState()),
      step: clampWizardStep(step),
      totalSteps: 2
    }
  };
}

/**
 * Move wizard one step forward.
 *
 * @param {object} state - Current ui flow state.
 * @returns {object}
 */
export function nextWizardStep(state) {
  const current = state.wizard?.step || 1;
  return setWizardStep(state, current + 1);
}

/**
 * Move wizard one step backward.
 *
 * @param {object} state - Current ui flow state.
 * @returns {object}
 */
export function prevWizardStep(state) {
  const current = state.wizard?.step || 1;
  return setWizardStep(state, current - 1);
}
