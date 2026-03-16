/**
 * Purpose: Wire DOM events to UI and state actions.
 * Description:
 * - Renders picker content for current tab.
 * - Connects click/change handlers to action modules.
 * - Keeps event glue separate from state mutations.
 */

/**
 * Whether a context menu button should open the picker modal.
 * Parent items (data-menu-level="parent") expand only;
 * leaf items open picker.
 *
 * @param {HTMLElement} btn - Button with data-context-action.
 * @returns {boolean}
 */
export function shouldOpenPickerForContextButton(btn) {
  if (!btn || !btn.dataset) return false;
  return btn.dataset.menuLevel !== "parent";
}
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
 * Wire slot tap to context menu and menu actions to picker.
 *
 * @param {object} params - DOM and action dependencies.
 * @returns {void}
 */
function wireContextSegmentedControls(byId, stateActions) {
  const pairs = [
    ["winType", "winType"],
    ["handState", "handState"],
    ["kongType", "kongType"],
    ["timingEvent", "timingEvent"]
  ];
  for (const [hiddenId, radioName] of pairs) {
    const hidden = byId(hiddenId);
    if (!hidden) continue;
    const selector = `input[name="${radioName}"]`;
    for (const radio of document.querySelectorAll(selector)) {
      radio.addEventListener("change", () => {
        hidden.value = radio.value;
        stateActions.syncHomeState();
      });
    }
  }
  for (const id of ["winType", "handState", "kongType", "timingEvent"]) {
    const el = byId(id);
    if (el) el.addEventListener("change", stateActions.syncHomeState);
  }
}

function wireSlotContextMenu(params) {
  const {
    byId,
    store,
    stateActions,
    modalActions,
    tabTiles,
    tilePickerGridEl,
    renderPickerTabButtons,
    renderTilePickerGrid
  } = params;
  const menuEl = byId("slotContextMenu");
  if (!menuEl) return;

  function hideMenu() {
    menuEl.hidden = true;
  }

  function showMenuNear(el) {
    const rect = el.getBoundingClientRect();
    menuEl.style.left = `${rect.left}px`;
    menuEl.style.top = `${rect.bottom + 4}px`;
    menuEl.hidden = false;
  }

  byId("tilePreview").addEventListener("click", (event) => {
    const target = event.target.closest("[data-slot-index]");
    if (!target) return;
    const index = Number.parseInt(target.dataset.slotIndex || "", 10);
    if (!Number.isInteger(index)) return;
    stateActions.selectSlot(index);
    showMenuNear(target);
  });

  document.addEventListener("click", (event) => {
    if (menuEl.hidden) return;
    if (menuEl.contains(event.target)) return;
    if (event.target.closest("[data-slot-index]")) return;
    hideMenu();
  });

  menuEl.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-context-action]");
    if (!btn) return;
    const action = btn.dataset.contextAction;
    const tab = btn.dataset.tab;
    if (action === "undo_last") {
      stateActions.undoHand();
    } else if (action === "undo_slot") {
      stateActions.undoSelectedSlot();
    } else if (action === "tab" && tab) {
      store.uiState = {
        ...store.uiState,
        hand: { ...store.uiState.hand, activeTab: tab }
      };
      stateActions.setPatternAction("single");
    } else if (action) {
      stateActions.setPatternAction(action);
    }
    hideMenu();
    if (shouldOpenPickerForContextButton(btn)) {
      renderPickerTabButtons(store.uiState.hand.activeTab);
      renderTilePickerGrid({
        tilePickerGridEl,
        tiles: tabTiles[store.uiState.hand.activeTab],
        onPick: (tile) => stateActions.pickTile(tile)
      });
      modalActions.openModalByKey("picker");
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
      stateActions
    });
  });

  bindPresetButtons(stateActions.applyPreset);
  const closeMap = ["picker", "context", "result", "info"];
  for (const modalKey of closeMap) {
    bindCloseButtons(`[data-close='${modalKey}']`, () => {
      modalActions.closeModalByKey(modalKey);
    });
  }

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
  wireSlotContextMenu({
    byId,
    store,
    stateActions,
    modalActions,
    tabTiles,
    tilePickerGridEl,
    renderPickerTabButtons,
    renderTilePickerGrid
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

  wireContextSegmentedControls(byId, stateActions);
  bindClick("moreBtn", () => {
    resetContext(byId);
    stateActions.syncHomeState();
  });
}
