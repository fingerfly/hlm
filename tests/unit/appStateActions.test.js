import test from "node:test";
import assert from "node:assert/strict";
import {
  createTilePickerState,
  addTileToPicker,
  selectPickerSlot,
  deleteSelectedSlot,
  clearTilePicker,
  undoLastTile
} from "../../src/app/tilePickerState.js";
import { createStateActions } from "../../public/appStateActions.js";

function createByIdMap() {
  const controls = {
    winType: { value: "zimo" },
    handState: { value: "menqian" },
    kongType: { value: "none" },
    timingEvent: { value: "none" }
  };
  return {
    byId: (id) => controls[id],
    controls
  };
}

function createRefs() {
  return {
    openPickerBtn: { textContent: "" },
    openContextBtn: { textContent: "" },
    tilePreviewEl: {},
    tileCountEl: { textContent: "" },
    pickerCountEl: { textContent: "" },
    pickerActionHintEl: { textContent: "" },
    pickerDeleteBtn: { hidden: false, disabled: false },
    contextSummaryEl: { textContent: "" },
    readyHintEl: { textContent: "" },
    calculateBtn: { disabled: true },
    resultRefs: {},
    infoRefs: {}
  };
}

test("syncHomeState toggles delete button visibility by editing state", () => {
  const byIdState = createByIdMap();
  const store = {
    uiState: { hand: { tiles: [] } },
    pickerState: createTilePickerState(["1W", "2W"]),
    pickerAction: "single",
    resultVm: null
  };
  const refs = createRefs();
  const actions = createStateActions(store, {
    byId: byIdState.byId,
    refs,
    contextPresets: {},
    addTileToPicker,
    resolvePatternAction: () => ({ ok: true, reason: null, tiles: ["1W"] }),
    renderPatternActionButtons: () => {},
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    evaluateCapturedHand: () => ({ scoring: { isWin: false } }),
    renderTilePreview: () => {},
    renderResultModal: () => ({}),
    renderInfoTip: () => {}
  });

  actions.syncHomeState();
  assert.equal(refs.pickerDeleteBtn.hidden, true);
  assert.equal(refs.pickerDeleteBtn.disabled, true);
  assert.equal(refs.openPickerBtn.textContent, "继续选牌");

  actions.selectSlot(0);
  assert.equal(refs.pickerDeleteBtn.hidden, false);
  assert.equal(refs.pickerDeleteBtn.disabled, false);
});

test("syncHomeState updates primary picker CTA by tile count", () => {
  const byIdState = createByIdMap();
  const store = {
    uiState: { hand: { tiles: [] } },
    pickerState: createTilePickerState([]),
    pickerAction: "single",
    resultVm: null
  };
  const refs = createRefs();
  const actions = createStateActions(store, {
    byId: byIdState.byId,
    refs,
    contextPresets: {},
    addTileToPicker,
    resolvePatternAction: () => ({ ok: true, reason: null, tiles: ["1W"] }),
    renderPatternActionButtons: () => {},
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    evaluateCapturedHand: () => ({ scoring: { isWin: false } }),
    renderTilePreview: () => {},
    renderResultModal: () => ({}),
    renderInfoTip: () => {}
  });

  actions.syncHomeState();
  assert.equal(refs.openPickerBtn.textContent, "开始选牌");

  actions.pickTile("1W");
  assert.equal(refs.openPickerBtn.textContent, "继续选牌");

  for (let i = 0; i < 13; i += 1) {
    actions.pickTile("1W");
  }
  assert.equal(refs.openPickerBtn.textContent, "手牌已满，可修改");
});

test("syncHomeState shows remaining tile count and optional context cue", () => {
  const byIdState = createByIdMap();
  const store = {
    uiState: { hand: { tiles: [] } },
    pickerState: createTilePickerState([]),
    pickerAction: "single",
    resultVm: null
  };
  const refs = createRefs();
  const actions = createStateActions(store, {
    byId: byIdState.byId,
    refs,
    contextPresets: {},
    addTileToPicker,
    resolvePatternAction: () => ({ ok: true, reason: null, tiles: ["1W"] }),
    renderPatternActionButtons: () => {},
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    evaluateCapturedHand: () => ({ scoring: { isWin: false } }),
    renderTilePreview: () => {},
    renderResultModal: () => ({}),
    renderInfoTip: () => {}
  });

  actions.syncHomeState();
  assert.equal(refs.readyHintEl.textContent, "再选 14 张即可计算");
  assert.equal(refs.openContextBtn.textContent, "可选：编辑条件");

  byIdState.controls.kongType.value = "an";
  actions.syncHomeState();
  assert.equal(refs.openContextBtn.textContent, "已设置条件");
});
