import {
  canCalculate,
  setWizardStep,
  nextWizardStep,
  prevWizardStep
} from "../src/app/uiFlowState.js";
import { syncHomeStateView } from "./homeStateView.js";
import {
  resolveInitialPickerMode as resolveInitialPickerModePolicy
} from "./pickerModeState.js";
import {
  initPickerMode,
  createHandStateActions
} from "./handStateActions.js";
import { createResultStateActions } from "./resultStateActions.js";

/** Inclusive bounds for round-setup score inputs (UI guardrail). */
export const PLAYER_SCORE_MIN = -99999;
export const PLAYER_SCORE_MAX = 99999;

/**
 * Clamp parsed integer score to PLAYER_SCORE_* (for tests and collectRound).
 *
 * @param {unknown} raw - Input value.
 * @returns {number}
 */
export function parsePlayerScoreInput(raw) {
  const n = Number.parseInt(String(raw ?? ""), 10);
  if (!Number.isInteger(n)) return 0;
  return Math.min(
    PLAYER_SCORE_MAX,
    Math.max(PLAYER_SCORE_MIN, n)
  );
}

/**
 * Read four seat rows from the round-setup form (stable ids).
 *
 * @param {(id: string) => Element|null} byId
 * @returns {{seat: string, name: string, score: number}[]}
 */
function collectRoundPlayers(byId) {
  return [
    {
      seat: "E",
      name: byId("playerNameE")?.value || "东家",
      score: parsePlayerScoreInput(byId("playerScoreE")?.value)
    },
    {
      seat: "S",
      name: byId("playerNameS")?.value || "南家",
      score: parsePlayerScoreInput(byId("playerScoreS")?.value)
    },
    {
      seat: "W",
      name: byId("playerNameW")?.value || "西家",
      score: parsePlayerScoreInput(byId("playerScoreW")?.value)
    },
    {
      seat: "N",
      name: byId("playerNameN")?.value || "北家",
      score: parsePlayerScoreInput(byId("playerScoreN")?.value)
    }
  ];
}

/**
 * Resolve initial picker mode. Always twoLayer after UI simplification.
 *
 * @returns {"twoLayer"}
 */
export function resolveInitialPickerMode() {
  return resolveInitialPickerModePolicy();
}

/**
 * Purpose: Provide stateful UI actions for hand workflow.
 * Description:
 * - Syncs picker and context state to home-screen widgets.
 * - Executes clear, undo, and calculate actions.
 * - Builds scoring request payload from current UI controls.
 *
 * @param {{uiState: object, pickerState: object,
 *   resultVm: object|null}} store
 * @param {object} deps - Rendering and domain dependencies.
 * @returns {object} Handlers including syncHomeState, clearHand, undoHand,
 *   calculate, and picker actions spread from hand state.
 */
export function createStateActions(store, deps) {
  const {
    byId,
    refs,
    wizardUi,
    addTilesToPicker,
    resolvePatternAction,
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastAction,
    undoBySlot,
    evaluateCapturedHand,
    renderTilePreview,
    renderResultModal
  } = deps;
  initPickerMode(store);
  function syncHomeState() {
    syncHomeStateView({
      store,
      byId,
      refs,
      renderTilePreview,
      canCalculate
    });
  }
  const handActions = createHandStateActions({
    store,
    byId,
    refs,
    afterPickerSync: () => wizardUi?.afterPickerSync?.(),
    addTilesToPicker,
    resolvePatternAction,
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastAction,
    undoBySlot,
    syncHomeState
  });
  const resultActions = createResultStateActions({
    store,
    byId,
    refs,
    evaluateCapturedHand,
    renderResultModal
  });

  function jumpWizardStep(step) {
    store.uiState = setWizardStep(store.uiState, step);
    syncHomeState();
    return store.uiState.wizard.step;
  }

  function goWizardNext() {
    const step = store.uiState.wizard?.step || 1;
    if (step === 1) {
      store.roundState = {
        ...(store.roundState || {}),
        initialized: true,
        dealerSeat: byId("dealerSeat")?.value || "E",
        players: collectRoundPlayers(byId)
      };
      store.uiState = nextWizardStep(store.uiState);
      syncHomeState();
      return { ok: true, step: store.uiState.wizard.step };
    }
    if (step === 2) {
      if (!canCalculate(store.uiState)) {
        return { ok: false, needs: "tiles", step: 2 };
      }
      store.uiState = nextWizardStep(store.uiState);
      syncHomeState();
      return { ok: true, step: store.uiState.wizard.step };
    }
    return { ok: true, step };
  }

  function goWizardPrev() {
    store.uiState = prevWizardStep(store.uiState);
    syncHomeState();
    return { ok: true, step: store.uiState.wizard.step };
  }

  return {
    syncHomeState,
    jumpWizardStep,
    goWizardNext,
    goWizardPrev,
    ...handActions,
    ...resultActions
  };
}
