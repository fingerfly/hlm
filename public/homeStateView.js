/**
 * Purpose: Render home state summary from picker/context state.
 * Description:
 * - Updates top hand preview and picker CTA labels.
 * - Updates context summary and calculation readiness hint.
 * - Three wizard steps: setup, tiles, context (in-shell setup).
 */
import { pickerToTiles } from "../src/app/tilePickerState.js";

function getContextSummary(byId) {
  const winTypeText = byId("winType").value === "zimo" ? "自摸" : "点和";
  const handStateText = byId("handState").value === "menqian"
    ? "门前清"
    : "副露";
  const flowers = Number.parseInt(
    byId("flowerCount")?.value ?? "0",
    10
  ) || 0;
  const an = Number.parseInt(byId("kongAnCount")?.value ?? "0", 10) || 0;
  const ming = Number.parseInt(byId("kongMingCount")?.value ?? "0", 10) || 0;
  const kongText = an + ming === 0 ? "无杠" : `暗${an}·明${ming}`;
  const flowerSuffix = flowers > 0 ? ` · 花${flowers}` : "";
  return `${winTypeText} · ${handStateText} · ${kongText}${flowerSuffix}`;
}

function updatePickerPrimaryCta(openPickerBtn, pickedCount) {
  if (!openPickerBtn) return;
  if (pickedCount === 0) {
    openPickerBtn.textContent = "开始选牌";
    return;
  }
  if (pickedCount < 14) {
    openPickerBtn.textContent = "继续选牌";
    return;
  }
  openPickerBtn.textContent = "手牌已满，可修改";
}

function wizardStepHint(step) {
  if (step === 1) return "步骤 1/3：设定玩家";
  if (step === 2) return "步骤 2/3：选择 14 张手牌";
  return "步骤 3/3：确认和牌条件";
}

function wizardNextLabel(step) {
  if (step === 1) return "下一步：选择手牌";
  if (step === 2) return "下一步：条件设置";
  return "下一步：计算番数";
}

function wizardBackLabel(step) {
  if (step === 2) return "上一步：设定玩家";
  if (step === 3) return "上一步：手牌输入";
  return "上一步";
}

/**
 * Set aria-current on the desktop wizard step strip (≥1024px CSS).
 *
 * @param {number} step - Wizard step 1..3.
 * @param {HTMLElement|null} stripRoot - #wizardStepStrip or null.
 * @returns {void}
 */
export function syncWizardStepStripAria(step, stripRoot) {
  if (!stripRoot) return;
  const items = stripRoot.querySelectorAll("[data-wizard-step]");
  for (const el of items) {
    const n = Number.parseInt(el.getAttribute("data-wizard-step"), 10);
    if (n === step) {
      el.setAttribute("aria-current", "step");
    } else {
      el.removeAttribute("aria-current");
    }
  }
}

/**
 * Toggle wizard-step sections, nav labels, and desktop rail classes.
 *
 * @param {number} wizardStep - Current step 1..3.
 * @param {(id: string) => HTMLElement|null} byId - DOM lookup.
 * @param {object} refs - App refs subset.
 * @param {number} pickedCount - Selected tile count.
 * @returns {void}
 */
function applyWizardStepDom(wizardStep, byId, refs, pickedCount) {
  const gateEl = byId("roundSetupGate");
  if (gateEl) {
    gateEl.hidden = wizardStep !== 1;
  }
  const handSec = byId("handCardSection");
  if (handSec) {
    handSec.hidden = wizardStep === 1;
  }
  const resetCtx = byId("resetContextBtn");
  if (resetCtx) {
    resetCtx.hidden = wizardStep === 1;
  }
  if (refs.contextSummaryEl) {
    refs.contextSummaryEl.textContent =
      wizardStep >= 3 ? getContextSummary(byId) : "—";
  }
  if (refs.wizardStepHintEl) {
    refs.wizardStepHintEl.textContent = wizardStepHint(wizardStep);
  }
  if (refs.wizardBackBtn) {
    refs.wizardBackBtn.hidden = wizardStep === 1;
    refs.wizardBackBtn.textContent = wizardBackLabel(wizardStep);
  }
  if (refs.wizardNextBtn) {
    refs.wizardNextBtn.textContent = wizardNextLabel(wizardStep);
  }
  syncWizardStepStripAria(wizardStep, refs.wizardStepStripEl);
  if (refs.desktopSidePanelEl) {
    const desktop =
      globalThis.matchMedia?.("(min-width: 1024px)")?.matches === true;
    const hideContextRail = wizardStep === 1 || wizardStep === 2;
    refs.desktopSidePanelEl.classList.toggle(
      "desktop-step-1",
      desktop && hideContextRail
    );
    refs.desktopSidePanelEl.classList.toggle(
      "desktop-step-2",
      desktop && wizardStep === 3
    );
  }
  if (refs.openPickerBtn) refs.openPickerBtn.hidden = wizardStep !== 2;
  if (refs.clearHandBtn) {
    refs.clearHandBtn.hidden = wizardStep !== 2 || pickedCount === 0;
  }
}

/**
 * @param {number} wizardStep
 * @param {number} pickedCount
 * @param {boolean} canScore
 * @param {HTMLElement} readyHintEl
 * @returns {void}
 */
function applyWizardReadyHint(
  wizardStep,
  pickedCount,
  canScore,
  readyHintEl
) {
  if (wizardStep === 1) {
    readyHintEl.textContent =
      "确认四家名称、分数与庄家后进入下一步";
    return;
  }
  if (wizardStep === 2) {
    readyHintEl.textContent = canScore
      ? "手牌已满，可进入下一步"
      : `再选 ${14 - pickedCount} 张即可进入下一步`;
    return;
  }
  readyHintEl.textContent = "确认和牌条件后进入计算";
}

/**
 * Render home widgets from current app state.
 *
 * @param {object} input - Render dependencies and mutable store.
 * @returns {void}
 */
export function syncHomeStateView(input) {
  const {
    store,
    byId,
    refs,
    renderTilePreview,
    canCalculate
  } = input;
  store.uiState = {
    ...store.uiState,
    hand: {
      ...store.uiState.hand,
      tiles: pickerToTiles(store.pickerState)
    }
  };
  renderTilePreview({
    tilePreviewEl: refs.tilePreviewEl,
    tileCountEl: refs.tileCountEl,
    pickerState: store.pickerState,
    editingIndex: store.pickerState.editingIndex
  });
  const pickedCount = store.uiState.hand.tiles.length;
  const wizardStep = store.uiState.wizard?.step || 1;
  const canScore = canCalculate(store.uiState);
  updatePickerPrimaryCta(refs.openPickerBtn, pickedCount);
  refs.pickerCountEl.textContent = `已选 ${pickedCount}/14`;
  const hasSelection = Number.isInteger(store.pickerState.editingIndex);
  if (refs.pickerDeleteBtn) {
    refs.pickerDeleteBtn.hidden = !hasSelection;
    refs.pickerDeleteBtn.disabled = !hasSelection;
  }
  applyWizardStepDom(wizardStep, byId, refs, pickedCount);
  applyWizardReadyHint(wizardStep, pickedCount, canScore, refs.readyHintEl);
}
