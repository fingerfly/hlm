import test from "node:test";
import assert from "node:assert/strict";
import {
  createTilePickerState,
  addTileToPicker,
  addTilesToPicker,
  selectPickerSlot,
  deleteSelectedSlot,
  clearTilePicker,
  undoLastTile,
  undoLastAction,
  undoBySlot,
  pickerToTiles
} from "../../src/app/tilePickerState.js";
import {
  createStateActions,
  resolveInitialPickerMode
} from "../../public/appStateActions.js";

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
    clearHandBtn: { hidden: false },
    tilePreviewEl: {},
    tileCountEl: { textContent: "" },
    pickerCountEl: { textContent: "" },
    pickerDeleteBtn: { hidden: false, disabled: false },
    contextSummaryEl: { textContent: "" },
    wizardStepHintEl: { textContent: "" },
    wizardBackBtn: { textContent: "", hidden: false },
    wizardNextBtn: { textContent: "", hidden: false },
    readyHintEl: { textContent: "" },
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
    addTilesToPicker,
    resolvePatternAction: () => ({ ok: true, reason: null, tiles: ["1W"] }),
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    undoLastAction,
    undoBySlot,
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
    addTilesToPicker,
    resolvePatternAction: () => ({ ok: true, reason: null, tiles: ["1W"] }),
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    undoLastAction,
    undoBySlot,
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

test("syncHomeState shows placeholder for contextSummary at step 1", () => {
  const byIdState = createByIdMap();
  const store = {
    uiState: { hand: { tiles: [] }, wizard: { step: 1 } },
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
    addTilesToPicker,
    resolvePatternAction: () => ({ ok: true, reason: null, tiles: ["1W"] }),
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    undoLastAction,
    undoBySlot,
    evaluateCapturedHand: () => ({ scoring: { isWin: false } }),
    renderTilePreview: () => {},
    renderResultModal: () => ({}),
    renderInfoTip: () => {}
  });

  actions.syncHomeState();
  assert.equal(refs.readyHintEl.textContent, "再选 14 张即可进入下一步");
  assert.equal(refs.contextSummaryEl.textContent, "—");
});

test("syncHomeState toggles clearHandBtn visibility by step and tile count", () => {
  const byIdState = createByIdMap();
  const store = {
    uiState: { hand: { tiles: [] }, wizard: { step: 1 } },
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
    addTilesToPicker,
    resolvePatternAction: () => ({ ok: true, reason: null, tiles: ["1W"] }),
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    undoLastAction,
    undoBySlot,
    evaluateCapturedHand: () => ({ scoring: { isWin: false } }),
    renderTilePreview: () => {},
    renderResultModal: () => ({}),
    renderInfoTip: () => {}
  });

  actions.syncHomeState();
  assert.equal(refs.clearHandBtn.hidden, true);

  actions.pickTile("1W");
  actions.syncHomeState();
  assert.equal(refs.clearHandBtn.hidden, false);

  store.uiState.wizard.step = 2;
  actions.syncHomeState();
  assert.equal(refs.clearHandBtn.hidden, true);
});

test("syncHomeState shows actual context summary at step 2", () => {
  const byIdState = createByIdMap();
  const store = {
    uiState: { hand: { tiles: [] }, wizard: { step: 2 } },
    pickerState: createTilePickerState(new Array(14).fill("1W")),
    pickerAction: "single",
    resultVm: null
  };
  const refs = createRefs();
  const actions = createStateActions(store, {
    byId: byIdState.byId,
    refs,
    contextPresets: {},
    addTileToPicker,
    addTilesToPicker,
    resolvePatternAction: () => ({ ok: true, reason: null, tiles: ["1W"] }),
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    undoLastAction,
    undoBySlot,
    evaluateCapturedHand: () => ({ scoring: { isWin: false } }),
    renderTilePreview: () => {},
    renderResultModal: () => ({}),
    renderInfoTip: () => {}
  });

  actions.syncHomeState();
  assert.equal(refs.contextSummaryEl.textContent, "自摸 · 门前清 · 无杠");

  byIdState.controls.kongType.value = "an";
  actions.syncHomeState();
  assert.equal(refs.contextSummaryEl.textContent, "自摸 · 门前清 · 暗杠");
});

test("undoHand rolls back last pattern action (e.g. pung)", () => {
  const byIdState = createByIdMap();
  const store = {
    uiState: { hand: { tiles: [] } },
    pickerState: createTilePickerState([]),
    pickerAction: "pung",
    resultVm: null
  };
  const refs = createRefs();
  const actions = createStateActions(store, {
    byId: byIdState.byId,
    refs,
    contextPresets: {},
    addTileToPicker,
    addTilesToPicker,
    resolvePatternAction: (s, baseTile, actionId) => {
      if (actionId === "pung") {
        return { ok: true, reason: null, tiles: ["1W", "1W", "1W"] };
      }
      return { ok: true, reason: null, tiles: [baseTile] };
    },
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    undoLastAction,
    undoBySlot,
    evaluateCapturedHand: () => ({ scoring: { isWin: false } }),
    renderTilePreview: () => {},
    renderResultModal: () => ({}),
    renderInfoTip: () => {}
  });
  actions.lockPatternAction("pung");
  actions.pickTile("1W");
  assert.equal(pickerToTiles(store.pickerState).length, 3);
  actions.undoHand();
  assert.equal(pickerToTiles(store.pickerState).length, 0);
});

test("resolveInitialPickerMode always returns twoLayer", () => {
  assert.equal(resolveInitialPickerMode(), "twoLayer");
});

test("setPickerMode keeps picker slots and cursor unchanged", () => {
  const byIdState = createByIdMap();
  const store = {
    uiState: { hand: { tiles: [], pickerMode: "twoLayer" } },
    pickerState: {
      ...createTilePickerState(["1W", "2W"]),
      actionHistory: [{ slotIndices: [0], tiles: ["1W"] }]
    },
    pickerAction: "single",
    resultVm: null
  };
  const refs = createRefs();
  const actions = createStateActions(store, {
    byId: byIdState.byId,
    refs,
    contextPresets: {},
    addTileToPicker,
    addTilesToPicker,
    resolvePatternAction: () => ({ ok: true, reason: null, tiles: ["1W"] }),
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    undoLastAction,
    undoBySlot,
    evaluateCapturedHand: () => ({ scoring: { isWin: false } }),
    renderTilePreview: () => {},
    renderResultModal: () => ({}),
    renderInfoTip: () => {}
  });
  const before = {
    slots: [...store.pickerState.slots],
    cursor: store.pickerState.cursor,
    actionHistory: [...store.pickerState.actionHistory]
  };
  actions.setPickerMode("flat");
  assert.equal(store.uiState.hand.pickerMode, "flat");
  assert.deepEqual(store.pickerState.slots, before.slots);
  assert.equal(store.pickerState.cursor, before.cursor);
  assert.deepEqual(store.pickerState.actionHistory, before.actionHistory);
});

test("wizard buttons show dynamic next and back labels", () => {
  const byIdState = createByIdMap();
  const store = {
    uiState: { hand: { tiles: [] } },
    pickerState: createTilePickerState(new Array(14).fill("1W")),
    pickerAction: "single",
    resultVm: null
  };
  const refs = createRefs();
  const actions = createStateActions(store, {
    byId: byIdState.byId,
    refs,
    contextPresets: {},
    addTileToPicker,
    addTilesToPicker,
    resolvePatternAction: () => ({ ok: true, reason: null, tiles: ["1W"] }),
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    undoLastAction,
    undoBySlot,
    evaluateCapturedHand: () => ({ scoring: { isWin: false } }),
    renderTilePreview: () => {},
    renderResultModal: () => ({}),
    renderInfoTip: () => {}
  });
  actions.syncHomeState();
  assert.equal(refs.wizardNextBtn.textContent, "下一步：条件设置");
  actions.goWizardNext();
  assert.equal(refs.wizardBackBtn.textContent, "上一步：手牌输入");
  assert.equal(refs.wizardNextBtn.textContent, "下一步：计算番数");
});

test("tap action applies once then falls back to single", () => {
  const byIdState = createByIdMap();
  const store = {
    uiState: { hand: { tiles: [] } },
    pickerState: createTilePickerState([]),
    pickerAction: "single",
    pickerActionOnce: null,
    pickerActionLock: null,
    resultVm: null
  };
  const refs = createRefs();
  const actions = createStateActions(store, {
    byId: byIdState.byId,
    refs,
    contextPresets: {},
    addTileToPicker,
    addTilesToPicker,
    resolvePatternAction: (s, baseTile, actionId) => {
      if (actionId === "pair") return { ok: true, reason: null, tiles: [baseTile, baseTile] };
      return { ok: true, reason: null, tiles: [baseTile] };
    },
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    undoLastAction,
    undoBySlot,
    evaluateCapturedHand: () => ({ scoring: { isWin: false } }),
    renderTilePreview: () => {},
    renderResultModal: () => ({}),
    renderInfoTip: () => {}
  });
  actions.tapPatternAction("pair");
  actions.pickTile("1W");
  assert.equal(pickerToTiles(store.pickerState).length, 2);
  assert.equal(store.pickerAction, "single");
  actions.pickTile("2W");
  assert.equal(pickerToTiles(store.pickerState).length, 3);
});

test("locked action keeps applying across picks", () => {
  const byIdState = createByIdMap();
  const store = {
    uiState: { hand: { tiles: [] } },
    pickerState: createTilePickerState([]),
    pickerAction: "single",
    pickerActionOnce: null,
    pickerActionLock: null,
    resultVm: null
  };
  const refs = createRefs();
  const actions = createStateActions(store, {
    byId: byIdState.byId,
    refs,
    contextPresets: {},
    addTileToPicker,
    addTilesToPicker,
    resolvePatternAction: (s, baseTile, actionId) => {
      if (actionId === "pair") return { ok: true, reason: null, tiles: [baseTile, baseTile] };
      return { ok: true, reason: null, tiles: [baseTile] };
    },
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    undoLastAction,
    undoBySlot,
    evaluateCapturedHand: () => ({ scoring: { isWin: false } }),
    renderTilePreview: () => {},
    renderResultModal: () => ({}),
    renderInfoTip: () => {}
  });
  actions.lockPatternAction("pair");
  actions.pickTile("1W");
  actions.pickTile("2W");
  assert.equal(pickerToTiles(store.pickerState).length, 4);
  assert.equal(store.pickerActionLock, "pair");
});

test("dismissPickerGestureTip sets store flag and persists", () => {
  const byIdState = createByIdMap();
  const store = {
    uiState: { hand: { tiles: [] } },
    pickerState: createTilePickerState([]),
    pickerAction: "single",
    pickerActionOnce: null,
    pickerActionLock: null,
    pickerGestureTipDismissed: false,
    resultVm: null
  };
  const refs = createRefs();
  const actions = createStateActions(store, {
    byId: byIdState.byId,
    refs,
    contextPresets: {},
    addTileToPicker,
    addTilesToPicker,
    resolvePatternAction: () => ({ ok: true, reason: null, tiles: ["1W"] }),
    selectPickerSlot,
    deleteSelectedSlot,
    clearTilePicker,
    undoLastTile,
    undoLastAction,
    undoBySlot,
    evaluateCapturedHand: () => ({ scoring: { isWin: false } }),
    renderTilePreview: () => {},
    renderResultModal: () => ({}),
    renderInfoTip: () => {}
  });
  assert.equal(store.pickerGestureTipDismissed, false);
  actions.dismissPickerGestureTip();
  assert.equal(store.pickerGestureTipDismissed, true);
});
