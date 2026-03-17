/**
 * Purpose: Wire context controls and slot context menu.
 * Description:
 * - Syncs hidden inputs with segmented controls.
 * - Binds slot click to dynamic action menu.
 * - Routes menu actions to state and picker opening flow.
 */
import {
  applyContextMenuAvailability,
  getContextMenuControlState
} from "./contextMenuView.js";

/**
 * Wire segmented radio controls to hidden inputs.
 *
 * @param {(id: string) => HTMLElement|null} byId - Id resolver.
 * @param {object} stateActions - Bound state action handlers.
 * @returns {void}
 */
export function wireContextSegmentedControls(byId, stateActions) {
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

/**
 * Wire slot context menu actions and dynamic visibility.
 *
 * @param {object} params - DOM and action dependencies.
 * @returns {void}
 */
export function wireSlotContextMenu(params) {
  const {
    byId,
    store,
    stateActions,
    modalActions,
    renderPicker,
    shouldOpenPickerForContextButton
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

  function updateMenuAvailability() {
    const map = stateActions.getContextMenuAvailability();
    applyContextMenuAvailability(menuEl, map);
    const controlState = getContextMenuControlState(store.pickerState);
    const undoLastBtn = menuEl.querySelector(
      "[data-context-action='undo_last']"
    );
    const undoSlotBtn = menuEl.querySelector(
      "[data-context-action='undo_slot']"
    );
    if (undoLastBtn) undoLastBtn.disabled = !controlState.undoLastEnabled;
    if (undoSlotBtn) undoSlotBtn.disabled = !controlState.undoSlotEnabled;
  }

  byId("tilePreview").addEventListener("click", (event) => {
    const target = event.target.closest("[data-slot-index]");
    if (!target) return;
    const index = Number.parseInt(target.dataset.slotIndex || "", 10);
    if (!Number.isInteger(index)) return;
    stateActions.selectSlot(index);
    updateMenuAvailability();
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
      renderPicker();
      modalActions.openModalByKey("picker");
    }
  });
}
