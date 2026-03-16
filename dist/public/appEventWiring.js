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
    onPick: (tile) => stateActions.pickTile(tile)
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
  const bindClick = (id, onClick) => {
    const element = byId(id);
    if (!element) return;
    element.addEventListener("click", onClick);
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

  bindClick("openPickerBtn", () => {
    modalActions.openModalByKey("picker");
  });
  bindClick("openContextBtn", () => {
    modalActions.openModalByKey("context");
  });
  for (const button of document.querySelectorAll("[data-pattern-action]")) {
    button.addEventListener("click", () => {
      stateActions.setPatternAction(button.dataset.patternAction);
    });
  }
  bindClick("undoBtn", () => stateActions.undoHand());
  byId("tilePreview").addEventListener("click", (event) => {
    const target = event.target.closest("[data-slot-index]");
    if (!target) return;
    const index = Number.parseInt(target.dataset.slotIndex || "", 10);
    if (!Number.isInteger(index)) return;
    stateActions.selectSlot(index);
    modalActions.openModalByKey("picker");
  });
  bindClick("pickerDeleteBtn", () => {
    stateActions.deleteSelected();
  });
  bindClick("pickerUndoBtn", () => {
    stateActions.undoHand();
  });
  bindClick("clearBtn", stateActions.clearHand);
  bindClick("pickerClearBtn", stateActions.clearHand);
  bindClick("calculateBtn", () => {
    if (stateActions.calculate()) modalActions.updateModalUi();
  });
  bindClick("playAgainBtn", () => {
    stateActions.clearHand();
    modalActions.closeModalByKey("result");
    modalActions.closeModalByKey("info");
  });
  bindClick("openInfoBtn", () => {
    if (!stateActions.openInfo()) return;
    modalActions.openModalByKey("info");
  });

  for (const id of ["winType", "handState", "kongType", "timingEvent"]) {
    byId(id).addEventListener("change", stateActions.syncHomeState);
  }
  bindClick("moreBtn", () => {
    resetContext(byId);
    stateActions.syncHomeState();
  });
}
