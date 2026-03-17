/**
 * Purpose: Render home state summary from picker/context state.
 * Description:
 * - Updates top hand preview and picker CTA labels.
 * - Updates context summary and calculation readiness hint.
 */
import { pickerToTiles } from "../src/app/tilePickerState.js";

const ACTION_NAMES = Object.freeze({
  single: "单张",
  pair: "对子",
  pung: "刻子",
  chow_front: "顺子前位",
  chow_middle: "顺子中位",
  chow_back: "顺子后位"
});

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
    renderPatternActionButtons,
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
  updatePickerPrimaryCta(refs.openPickerBtn, pickedCount);
  refs.pickerCountEl.textContent = `已选 ${pickedCount}/14`;
  const hasSelection = Number.isInteger(store.pickerState.editingIndex);
  if (refs.pickerDeleteBtn) {
    refs.pickerDeleteBtn.hidden = !hasSelection;
    refs.pickerDeleteBtn.disabled = !hasSelection;
  }
  if (refs.pickerActionHintEl) {
    const actionLabel = ACTION_NAMES[store.pickerAction] || "单张";
    refs.pickerActionHintEl.textContent = `当前快捷动作：${actionLabel}`;
  }
  renderPatternActionButtons(store.pickerAction);
  refs.contextSummaryEl.textContent = getContextSummary(byId);
  if (refs.openContextBtn) {
    const isDefaultContext =
      byId("winType").value === "zimo" &&
      byId("handState").value === "menqian" &&
      byId("kongType").value === "none" &&
      byId("timingEvent").value === "none";
    refs.openContextBtn.textContent = isDefaultContext
      ? "可选：编辑条件"
      : "已设置条件";
  }
  refs.calculateBtn.disabled = !canCalculate(store.uiState);
  refs.readyHintEl.textContent = canCalculate(store.uiState)
    ? "可计算，点按下方按钮"
    : `再选 ${14 - pickedCount} 张即可计算`;
}
