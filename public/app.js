import { evaluateCapturedHand } from "../src/app/evaluateCapturedHand.js";
import { getDisplayVersion } from "../src/config/appVersion.js";
import {
  createTilePickerState,
  addTileToPicker,
  addTilesToPicker,
  selectPickerSlot,
  deleteSelectedSlot,
  clearTilePicker,
  undoLastTile,
  undoLastAction,
  undoBySlot
} from "../src/app/tilePickerState.js";
import { resolvePatternAction } from "../src/app/tilePatternActions.js";
import { createUiFlowState, canCalculate } from "../src/app/uiFlowState.js";
import { TAB_TILES } from "./uiConfig.js";
import {
  renderTilePreview,
  renderPickerTabButtons,
  renderTilePickerGrid
} from "./uiRenderers.js";
import {
  resetContext,
  bindTabButtons
} from "./uiBindings.js";
import { readStoredGestureTipDismissed } from "./pickerModeState.js";
import { bindCloseButtons } from "./modalUi.js";
import { renderResultModal } from "./resultModalView.js";
import { createModalActions } from "./appModalActions.js";
import { createStateActions } from "./appStateActions.js";
import {
  wireAppEvents,
  renderPickerByTab,
  syncWizardModals
} from "./appEventWiring.js";
import { createAppRefs } from "./appRefs.js";
import { createDefaultRoundPlayers } from "../src/app/roundSettlement.js";
import {
  syncDesktopPickerSheet,
  installDesktopPickerLayoutListener
} from "./desktopPickerMount.js";
import { mountHelpContent } from "./helpContentMount.js";
import { installHelpFanHashNavigation } from "./helpFanHash.js";

/**
 * Purpose: Bootstrap HLM web UI and connect app modules.
 * Description:
 * - Initializes store, refs, and action factories.
 * - Wires DOM events to state and modal transitions.
 * - Performs first render and default home-state sync.
 */
const versionLabel = getDisplayVersion();
const byId = (id) => document.getElementById(id);
byId("versionBadge").textContent = `当前版本: ${versionLabel}`;
const splashEl = byId("appSplash");
const splashVersionEl = byId("splashVersion");
if (splashVersionEl) {
  splashVersionEl.textContent = `版本 ${versionLabel}`;
}
const { refs, modalRefs } = createAppRefs(byId);

const store = {
  uiState: createUiFlowState(),
  roundState: {
    initialized: false,
    dealerSeat: "E",
    players: createDefaultRoundPlayers()
  },
  pickerState: createTilePickerState([]),
  pickerAction: "single",
  pickerActionOnce: null,
  pickerActionLock: null,
  pickerGestureTipDismissed: readStoredGestureTipDismissed(),
  resultVm: null
};
const wizardUi = { afterPickerSync: () => {} };
const stateActions = createStateActions(store, {
  byId,
  refs,
  wizardUi,
  addTileToPicker,
  addTilesToPicker,
  resolvePatternAction,
  selectPickerSlot,
  deleteSelectedSlot,
  clearTilePicker,
  undoLastTile,
  undoLastAction,
  undoBySlot,
  evaluateCapturedHand,
  renderTilePreview,
  renderResultModal
});
const modalActions = createModalActions(store, modalRefs, {
  onBeforeClosePicker: () => stateActions.closeTileContextMenu?.(),
  onBeforeOpenModal: () => {
    const pop = byId("helpPopover");
    if (pop) pop.hidden = true;
    const moreBtn = byId("moreBtn");
    if (moreBtn) moreBtn.setAttribute("aria-expanded", "false");
  }
});

syncDesktopPickerSheet(byId);
installDesktopPickerLayoutListener(byId, () => modalActions.updateModalUi());

wizardUi.afterPickerSync = () => {
  if (localStorage.getItem("hlm_disableAutoWizardAdvance") === "1") {
    return;
  }
  const step = store.uiState.wizard?.step || 1;
  if (step !== 1) return;
  if (!canCalculate(store.uiState)) return;
  const result = stateActions.goWizardNext();
  syncWizardModals(result, modalActions);
};

function dismissSplash() {
  if (splashEl) splashEl.classList.add("splash-dismissed");
}
const reduceMotion = globalThis.matchMedia?.(
  "(prefers-reduced-motion: reduce)"
)?.matches;
const splashMs = reduceMotion ? 400 : 900;
globalThis.setTimeout(dismissSplash, splashMs);

function mountDesktopContextInline() {
  const isDesktop = globalThis.matchMedia?.("(min-width: 1024px)")?.matches;
  if (!isDesktop) return;
  const host = byId("desktopContextHost");
  const contextModal = byId("contextModal");
  const contextSheet = contextModal?.querySelector(".context-sheet");
  if (!host || !contextModal || !contextSheet) return;
  if (!host.contains(contextSheet)) host.appendChild(contextSheet);
  contextModal.classList.add("desktop-inline-context");
  host.dataset.mode = "inline";
}
mountDesktopContextInline();

function collectRoundPlayers() {
  return [
    {
      seat: "E",
      name: byId("playerNameE")?.value || "东家",
      score: Number.parseInt(byId("playerScoreE")?.value || "0", 10) || 0
    },
    {
      seat: "S",
      name: byId("playerNameS")?.value || "南家",
      score: Number.parseInt(byId("playerScoreS")?.value || "0", 10) || 0
    },
    {
      seat: "W",
      name: byId("playerNameW")?.value || "西家",
      score: Number.parseInt(byId("playerScoreW")?.value || "0", 10) || 0
    },
    {
      seat: "N",
      name: byId("playerNameN")?.value || "北家",
      score: Number.parseInt(byId("playerScoreN")?.value || "0", 10) || 0
    }
  ];
}

function setRoundGateVisible(visible) {
  const gate = byId("roundSetupGate");
  const shell = document.querySelector("main.container.app-shell");
  if (gate) {
    gate.hidden = !visible;
    gate.style.display = visible ? "" : "none";
  }
  if (shell) {
    shell.hidden = visible;
    shell.style.display = visible ? "none" : "";
  }
}

function hideRoundGateWithTransition() {
  const gate = byId("roundSetupGate");
  const reduceMotion = globalThis.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  )?.matches;
  if (!gate || reduceMotion) {
    setRoundGateVisible(false);
    return;
  }
  gate.classList.add("is-exiting");
  globalThis.setTimeout(() => {
    gate.classList.remove("is-exiting");
    setRoundGateVisible(false);
  }, 220);
}

function syncDiscarderVisibility() {
  const winType = byId("winType")?.value;
  const discarder = byId("discarderSeat");
  if (!discarder) return;
  const wrap = discarder.closest(".context-desktop-field");
  const hint = byId("roleValidationError");
  const shouldShow = winType === "dianhe";
  if (wrap) wrap.hidden = !shouldShow;
  discarder.disabled = !shouldShow;
  discarder.required = shouldShow;
  if (!shouldShow) {
    discarder.value = "";
    if (hint) {
      hint.textContent = "";
      hint.hidden = true;
    }
  }
}

/** Marks the seat panel matching dealerSeat with .is-dealer (visual only). */
function syncRoundSetupDealerHighlight() {
  const dealer = byId("dealerSeat")?.value || "E";
  document.querySelectorAll(".round-setup-seat[data-seat]").forEach((el) => {
    el.classList.toggle("is-dealer", el.dataset.seat === dealer);
  });
}

setRoundGateVisible(true);
const startRoundBtn = byId("startRoundBtn");
if (startRoundBtn) {
  startRoundBtn.addEventListener("click", () => {
    store.roundState = {
      initialized: true,
      dealerSeat: byId("dealerSeat")?.value || "E",
      players: collectRoundPlayers()
    };
    hideRoundGateWithTransition();
    dismissSplash();
  });
}
const dealerSeatEl = byId("dealerSeat");
if (dealerSeatEl) {
  dealerSeatEl.addEventListener("change", syncRoundSetupDealerHighlight);
  syncRoundSetupDealerHighlight();
}

const { openHelp } = wireAppEvents({
  byId,
  bindTabButtons,
  bindCloseButtons,
  modalActions,
  stateActions,
  store,
  tabTiles: TAB_TILES,
  tilePickerGridEl: refs.tilePickerGridEl,
  renderPickerTabButtons,
  renderTilePickerGrid,
  resetContext
});
mountHelpContent(byId);
installHelpFanHashNavigation({ byId, openHelp });
renderPickerByTab({
  store,
  tabTiles: TAB_TILES,
  tilePickerGridEl: refs.tilePickerGridEl,
  renderPickerTabButtons,
  renderTilePickerGrid,
  stateActions
});
stateActions.syncHomeState();
modalActions.updateModalUi();
syncDiscarderVisibility();
const winTypeEl = byId("winType");
if (winTypeEl) {
  winTypeEl.addEventListener("change", syncDiscarderVisibility);
}
