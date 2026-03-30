/**
 * Purpose: Wire DOM events to UI and state actions.
 * Description:
 * - Renders picker content for current tab.
 * - Connects click/change handlers to action modules.
 * - Keeps event glue separate from state mutations.
 */
import { getPickerTilesByMode } from "./pickerModeView.js";
import { renderPickerByTab } from "./pickerRenderFlow.js";
import {
  createBindClick,
  bindModalCloseButtons
} from "./appEventBindings.js";
import {
  wireContextSegmentedControls,
  wireContextSteppers,
  wireDesktopContextControls,
  syncContextDesktopMirrors,
  wireSlotClickToPicker
} from "./contextWiring.js";

/**
 * Resolve tile list by picker mode and active tab.
 *
 * @param {Record<string, string[]>} tabTiles - Tile groups by tab.
 * @param {"twoLayer"|"flat"} pickerMode - Picker layout mode.
 * @param {string} activeTab - Active tab key.
 * @returns {string[]}
 */
export { getPickerTilesByMode, renderPickerByTab };

function isDesktopInlineContext() {
  return globalThis.matchMedia?.("(min-width: 1024px)")?.matches === true;
}

/**
 * True when help should use the anchored popover instead of `#helpModal`.
 *
 * @returns {boolean}
 */
export function isDesktopHelpPopover() {
  return isDesktopInlineContext();
}

function setHelpPopoverVisible(byId, visible) {
  const pop = byId("helpPopover");
  if (!pop) return;
  pop.hidden = !visible;
}

function syncMoreBtnExpanded(byId, expanded) {
  const moreBtn = byId("moreBtn");
  if (!moreBtn) return;
  moreBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
}

/**
 * Build open/close handlers for help (popover on desktop, modal on narrow).
 *
 * @param {(id: string) => HTMLElement|null} byId - Id lookup helper.
 * @param {{openModalByKey: Function, closeModalByKey: Function}} modalActions
 * @returns {{openHelp: Function, closeHelp: Function}}
 */
export function createHelpHandlers(byId, modalActions) {
  let returnFocusEl = null;

  const closeHelp = () => {
    if (isDesktopHelpPopover()) {
      setHelpPopoverVisible(byId, false);
      syncMoreBtnExpanded(byId, false);
    } else {
      modalActions.closeModalByKey("help");
    }
    if (returnFocusEl && typeof returnFocusEl.focus === "function") {
      returnFocusEl.focus();
    }
  };

  const openHelp = (event) => {
    returnFocusEl = event?.currentTarget || byId("moreBtn");
    if (isDesktopHelpPopover()) {
      setHelpPopoverVisible(byId, true);
      syncMoreBtnExpanded(byId, true);
      const btn = byId("helpPopoverCloseBtn");
      if (btn && typeof btn.focus === "function") btn.focus();
      return;
    }
    modalActions.openModalByKey("help");
    const closeBtn = byId("helpCloseBtn");
    if (closeBtn && typeof closeBtn.focus === "function") closeBtn.focus();
  };

  return { openHelp, closeHelp };
}

/**
 * Handle wizard "next": from step 2, calculate and show result modal;
 * else advance wizard step.
 *
 * @param {object} store - App store with uiState.
 * @param {object} stateActions - calculate, goWizardNext.
 * @param {object} modalActions - closeModalByKey, updateModalUi.
 * @param {Function} syncWizardModalsFn - syncWizardModals.
 * @returns {void}
 */
export function handleWizardNextClick(
  store,
  stateActions,
  modalActions,
  syncWizardModalsFn
) {
  const step = store.uiState.wizard?.step || 1;
  if (step === 2) {
    modalActions.closeModalByKey("picker");
    modalActions.closeModalByKey("context");
    if (stateActions.calculate()) modalActions.updateModalUi();
    return;
  }
  const result = stateActions.goWizardNext();
  syncWizardModalsFn(result, modalActions);
}

/**
 * Keep modal stack aligned with wizard step.
 *
 * @param {{ok:boolean, needs?:string, step?:number}} result - Step result.
 * @param {{openModalByKey:Function, closeModalByKey:Function}} modalActions
 * @returns {void}
 */
export function syncWizardModals(result, modalActions) {
  if (isDesktopInlineContext()) {
    modalActions.closeModalByKey("context");
    if (!result.ok && result.needs === "tiles") {
      modalActions.openModalByKey("picker");
      return;
    }
    if (result.step === 1) {
      modalActions.openModalByKey("picker");
      return;
    }
    if (result.step === 2) {
      modalActions.closeModalByKey("picker");
    }
    return;
  }
  if (!result.ok && result.needs === "tiles") {
    modalActions.closeModalByKey("context");
    modalActions.openModalByKey("picker");
    return;
  }
  if (result.step === 1) {
    modalActions.closeModalByKey("context");
    modalActions.openModalByKey("picker");
    return;
  }
  if (result.step === 2) {
    modalActions.closeModalByKey("picker");
    modalActions.openModalByKey("context");
  }
}


/**
 * Attach all app-level event listeners.
 *
 * @param {object} params - DOM and action dependencies.
 * @returns {{openHelp: Function, closeHelp: Function}}
 */
export function wireAppEvents(params) {
  const {
    byId,
    bindTabButtons,
    bindCloseButtons,
    modalActions,
    stateActions,
    store,
    tabTiles,
    tilePickerGridEl,
    renderPickerTabButtons,
    renderTilePickerGrid,
    resetContext
  } = params;
  const bindClick = createBindClick(byId);
  const { openHelp, closeHelp } = createHelpHandlers(byId, modalActions);
  const renderPicker = () => {
    renderPickerByTab({
      store,
      tabTiles,
      tilePickerGridEl,
      renderPickerTabButtons,
      renderTilePickerGrid,
      stateActions
    });
  };

  bindTabButtons((tab) => {
    store.uiState = {
      ...store.uiState,
      hand: { ...store.uiState.hand, activeTab: tab }
    };
    renderPickerByTab({
      store,
      tabTiles,
      tilePickerGridEl,
      renderPickerTabButtons,
      renderTilePickerGrid,
      stateActions
    });
  });

  bindModalCloseButtons(bindCloseButtons, modalActions);

  bindClick("openPickerBtn", () => {
    stateActions.jumpWizardStep(1);
    modalActions.closeModalByKey("context");
    modalActions.openModalByKey("picker");
  });
  bindClick("clearHandBtn", stateActions.clearHand);
  bindClick("wizardNextBtn", () =>
    handleWizardNextClick(store, stateActions, modalActions, syncWizardModals)
  );
  bindClick("wizardBackBtn", () => {
    const result = stateActions.goWizardPrev();
    syncWizardModals(result, modalActions);
  });
  wireSlotClickToPicker({
    byId,
    stateActions,
    modalActions,
    renderPicker
  });
  bindClick("pickerDeleteBtn", () => {
    stateActions.deleteSelected();
  });
  bindClick("pickerUndoBtn", () => {
    stateActions.undoHand();
  });
  bindClick("pickerClearBtn", stateActions.clearHand);
  bindClick("playAgainBtn", () => {
    stateActions.clearHand();
    stateActions.jumpWizardStep(1);
    modalActions.closeModalByKey("result");
  });

  wireContextSegmentedControls(byId, stateActions);
  wireContextSteppers(byId, stateActions);
  wireDesktopContextControls(byId, stateActions);
  syncContextDesktopMirrors(byId);
  bindClick("moreBtn", openHelp);
  bindClick("resetContextBtn", () => {
    resetContext(byId);
    stateActions.syncHomeState();
  });
  bindClick("helpCloseBtn", closeHelp);
  bindClick("helpPopoverCloseBtn", closeHelp);
  const helpModal = byId("helpModal");
  if (helpModal) {
    helpModal.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeHelp();
    });
  }
  const helpPopover = byId("helpPopover");
  if (helpPopover) {
    helpPopover.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeHelp();
    });
  }
  return { openHelp, closeHelp };
}
