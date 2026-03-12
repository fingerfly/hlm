/**
 * Purpose: Wire DOM events to UI and state actions.
 * Description:
 * - Renders picker content for current tab.
 * - Connects click/change handlers to action modules.
 * - Keeps event glue separate from state mutations.
 */
/**
 * Render current tab buttons and tile picker grid.
 *
 * @param {object} params - Rendering and state dependencies.
 * @returns {void}
 */
export function renderPickerByTab(params) {
  const {
    store,
    tabTiles,
    tilePickerGridEl,
    renderPickerTabButtons,
    renderTilePickerGrid,
    addTileToPicker,
    stateActions
  } = params;
  renderPickerTabButtons(store.uiState.hand.activeTab);
  renderTilePickerGrid({
    tilePickerGridEl,
    tiles: tabTiles[store.uiState.hand.activeTab],
    onPick: (tile) => {
      store.pickerState = addTileToPicker(store.pickerState, tile);
      stateActions.syncHomeState();
    }
  });
}

/**
 * Attach all app-level event listeners.
 *
 * @param {object} params - DOM and action dependencies.
 * @returns {void}
 */
export function wireAppEvents(params) {
  const {
    byId,
    bindTabButtons,
    bindPresetButtons,
    bindCloseButtons,
    modalActions,
    stateActions,
    store,
    tabTiles,
    tilePickerGridEl,
    renderPickerTabButtons,
    renderTilePickerGrid,
    addTileToPicker,
    resetContext
  } = params;

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
      addTileToPicker,
      stateActions
    });
  });

  bindPresetButtons(stateActions.applyPreset);
  bindCloseButtons("[data-close='picker']", () => {
    modalActions.closeModalByKey("picker");
  });
  bindCloseButtons("[data-close='context']", () => {
    modalActions.closeModalByKey("context");
  });
  bindCloseButtons("[data-close='result']", () => {
    modalActions.closeModalByKey("result");
  });
  bindCloseButtons("[data-close='info']", () => {
    modalActions.closeModalByKey("info");
  });

  byId("openPickerBtn").addEventListener("click", () => {
    modalActions.openModalByKey("picker");
  });
  byId("openContextBtn").addEventListener("click", () => {
    modalActions.openModalByKey("context");
  });
  byId("undoBtn").addEventListener("click", () => stateActions.undoHand());
  byId("pickerUndoBtn").addEventListener("click", () => {
    stateActions.undoHand();
  });
  byId("clearBtn").addEventListener("click", stateActions.clearHand);
  byId("pickerClearBtn").addEventListener("click", stateActions.clearHand);
  byId("calculateBtn").addEventListener("click", () => {
    if (stateActions.calculate()) modalActions.updateModalUi();
  });
  byId("playAgainBtn").addEventListener("click", () => {
    stateActions.clearHand();
    modalActions.closeModalByKey("result");
    modalActions.closeModalByKey("info");
  });
  byId("openInfoBtn").addEventListener("click", () => {
    if (!stateActions.openInfo()) return;
    modalActions.openModalByKey("info");
  });

  for (const id of ["winType", "handState", "kongType", "timingEvent"]) {
    byId(id).addEventListener("change", stateActions.syncHomeState);
  }
  byId("moreBtn").addEventListener("click", () => {
    resetContext(byId);
    stateActions.syncHomeState();
  });
}
