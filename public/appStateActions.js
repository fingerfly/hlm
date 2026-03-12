import { setResultPayload, canCalculate } from "../src/app/uiFlowState.js";
import { pickerToTiles } from "../src/app/tilePickerState.js";

/**
 * Purpose: Provide stateful UI actions for hand workflow.
 * Description:
 * - Syncs picker and context state to home-screen widgets.
 * - Executes clear, undo, preset, and calculate actions.
 * - Builds scoring request payload from current UI controls.
 */
/**
 * Create state action handlers used by event wiring.
 *
 * @param {{uiState: object, pickerState: object,
 *   resultVm: object|null}} store
 * @param {object} deps - Rendering and domain dependencies.
 * @returns {{syncHomeState: Function, applyPreset: Function,
 *   clearHand: Function, undoHand: Function, calculate: Function,
 *   openInfo: Function}}
 */
export function createStateActions(store, deps) {
  const {
    byId,
    refs,
    contextPresets,
    clearTilePicker,
    undoLastTile,
    evaluateCapturedHand,
    renderTilePreview,
    renderResultModal,
    renderInfoTip
  } = deps;

  function getContextSummary() {
    const winTypeText = byId("winType").value === "zimo" ? "自摸" : "点和";
    const handStateText = byId("handState").value === "menqian"
      ? "门前清"
      : "副露";
    const kongMap = { none: "无杠", an: "暗杠", ming: "明杠", bu: "补杠" };
    const kongText = kongMap[byId("kongType").value];
    return `${winTypeText} · ${handStateText} · ${kongText}`;
  }

  function syncHomeState() {
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
      pickerState: store.pickerState
    });
    const pickedCount = store.uiState.hand.tiles.length;
    refs.pickerCountEl.textContent = `已选 ${pickedCount}/14`;
    refs.contextSummaryEl.textContent = getContextSummary();
    refs.calculateBtn.disabled = !canCalculate(store.uiState);
    refs.readyHintEl.textContent = canCalculate(store.uiState)
      ? "可计算"
      : "请先选满 14 张牌";
  }

  function applyPreset(name) {
    const preset = contextPresets[name];
    if (!preset) return;
    byId("winType").value = preset.winType;
    byId("handState").value = preset.handState;
    syncHomeState();
  }

  function clearHand() {
    store.pickerState = clearTilePicker(store.pickerState);
    syncHomeState();
  }

  function undoHand() {
    store.pickerState = undoLastTile(store.pickerState);
    syncHomeState();
  }

  function buildRequestFromState() {
    return {
      tiles: [...store.uiState.hand.tiles],
      context: {
        winType: byId("winType").value,
        handState: byId("handState").value,
        kongType: byId("kongType").value,
        timingEvent: byId("timingEvent").value
      }
    };
  }

  function calculate() {
    if (!canCalculate(store.uiState)) return false;
    const result = evaluateCapturedHand(buildRequestFromState());
    store.uiState = setResultPayload(store.uiState, result);
    store.resultVm = renderResultModal(result, refs.resultRefs);
    return true;
  }

  function openInfo() {
    if (!store.resultVm) return false;
    renderInfoTip(store.resultVm, refs.infoRefs);
    return true;
  }

  return {
    syncHomeState,
    applyPreset,
    clearHand,
    undoHand,
    calculate,
    openInfo
  };
}
