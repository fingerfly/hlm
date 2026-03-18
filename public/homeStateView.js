/**
 * Purpose: Render home state summary from picker/context state.
 * Description:
 * - Updates top hand preview and picker CTA labels.
 * - Updates context summary and calculation readiness hint.
 */
import { pickerToTiles } from "../src/app/tilePickerState.js";

function getContextSummary(byId) {
  const winTypeText = byId("winType").value === "zimo" ? "自摸" : "点和";
  const handStateText = byId("handState").value === "menqian"
    ? "门前清"
    : "副露";
  const kongMap = { none: "无杠", an: "暗杠", ming: "明杠", bu: "补杠" };
  const kongText = kongMap[byId("kongType").value];
  return `${winTypeText} · ${handStateText} · ${kongText}`;
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
  if (step === 1) return "步骤 1/2：选择 14 张手牌";
  return "步骤 2/2：确认和牌条件";
}

function wizardNextLabel(step) {
  if (step === 1) return "下一步：条件设置";
  return "下一步：计算番数";
}

function wizardBackLabel(step) {
  if (step === 2) return "上一步：手牌输入";
  return "上一步";
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
  if (refs.contextSummaryEl) {
    refs.contextSummaryEl.textContent =
      wizardStep === 1 ? "—" : getContextSummary(byId);
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
  if (refs.openPickerBtn) refs.openPickerBtn.hidden = wizardStep !== 1;
  if (refs.clearHandBtn) {
    refs.clearHandBtn.hidden = wizardStep !== 1 || pickedCount === 0;
  }
  if (wizardStep === 1) {
    refs.readyHintEl.textContent = canScore
      ? "手牌已满，可进入下一步"
      : `再选 ${14 - pickedCount} 张即可进入下一步`;
    return;
  }
  refs.readyHintEl.textContent = "确认和牌条件后进入计算";
}
