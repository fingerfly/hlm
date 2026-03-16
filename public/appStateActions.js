import { setResultPayload, canCalculate } from "../src/app/uiFlowState.js";
import { syncContextRadios } from "./uiBindings.js";
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
    addTileToPicker,
    addTilesToPicker,
    resolvePatternAction,
    renderPatternActionButtons,
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    undoLastAction,
    undoBySlot,
    evaluateCapturedHand,
    renderTilePreview,
    renderResultModal,
    renderInfoTip
  } = deps;
  const ACTION_NAMES = Object.freeze({
    single: "单张",
    pair: "对子",
    pung: "刻子",
    chow_front: "顺子前位",
    chow_middle: "顺子中位",
    chow_back: "顺子后位"
  });

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
      pickerState: store.pickerState,
      editingIndex: store.pickerState.editingIndex
    });
    const pickedCount = store.uiState.hand.tiles.length;
    if (refs.openPickerBtn) {
      if (pickedCount === 0) {
        refs.openPickerBtn.textContent = "开始选牌";
      } else if (pickedCount < 14) {
        refs.openPickerBtn.textContent = "继续选牌";
      } else {
        refs.openPickerBtn.textContent = "手牌已满，可修改";
      }
    }
    refs.pickerCountEl.textContent = `已选 ${pickedCount}/14`;
    const hasSelection = Number.isInteger(store.pickerState.editingIndex);
    if (refs.pickerDeleteBtn) {
      refs.pickerDeleteBtn.hidden = !hasSelection;
      refs.pickerDeleteBtn.disabled = !hasSelection;
    }
    if (refs.pickerActionHintEl) {
      refs.pickerActionHintEl.textContent =
        `当前快捷动作：${ACTION_NAMES[store.pickerAction] || "单张"}`;
    }
    renderPatternActionButtons(store.pickerAction);
    const contextSummary = getContextSummary();
    refs.contextSummaryEl.textContent = contextSummary;
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
    if (canCalculate(store.uiState)) {
      refs.readyHintEl.textContent = "可计算，点按下方按钮";
    } else {
      refs.readyHintEl.textContent = `再选 ${14 - pickedCount} 张即可计算`;
    }
  }

  function applyPreset(name) {
    const preset = contextPresets[name];
    if (!preset) return;
    byId("winType").value = preset.winType;
    byId("handState").value = preset.handState;
    syncContextRadios(byId);
    syncHomeState();
  }

  function clearHand() {
    store.pickerState = clearTilePicker(store.pickerState);
    syncHomeState();
  }

  function setPatternAction(actionId) {
    store.pickerAction = actionId;
    syncHomeState();
  }

  function pickTile(baseTile) {
    const result = resolvePatternAction(
      store.pickerState,
      baseTile,
      store.pickerAction
    );
    if (!result.ok) {
      if (refs.pickerActionHintEl) {
        refs.pickerActionHintEl.textContent =
          `快捷动作不可用：${result.reason}`;
      }
      return false;
    }
    store.pickerState = addTilesToPicker(store.pickerState, result.tiles);
    syncHomeState();
    return true;
  }

  function selectSlot(index) {
    store.pickerState = selectPickerSlot(store.pickerState, index);
    syncHomeState();
  }

  function deleteSelected() {
    store.pickerState = deleteSelectedSlot(store.pickerState);
    syncHomeState();
  }

  function undoHand() {
    store.pickerState = undoLastAction(store.pickerState);
    syncHomeState();
  }

  function undoSelectedSlot() {
    const idx = store.pickerState.editingIndex;
    if (!Number.isInteger(idx)) return;
    store.pickerState = undoBySlot(store.pickerState, idx);
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
    setPatternAction,
    pickTile,
    selectSlot,
    deleteSelected,
    clearHand,
    undoHand,
    undoSelectedSlot,
    calculate,
    openInfo
  };
}
