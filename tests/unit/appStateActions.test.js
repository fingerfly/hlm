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
    addTilesToPicker,
    resolvePatternAction: () => ({ ok: true, reason: null, tiles: ["1W"] }),
    renderPatternActionButtons: () => {},
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
    renderPatternActionButtons: () => {},
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
    addTilesToPicker,
    resolvePatternAction: () => ({ ok: true, reason: null, tiles: ["1W"] }),
    renderPatternActionButtons: () => {},
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
  assert.equal(refs.readyHintEl.textContent, "再选 14 张即可计算");
  assert.equal(refs.openContextBtn.textContent, "可选：编辑条件");

  byIdState.controls.kongType.value = "an";
  actions.syncHomeState();
  assert.equal(refs.openContextBtn.textContent, "已设置条件");
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
    renderPatternActionButtons: () => {},
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
  actions.pickTile("1W");
  assert.equal(pickerToTiles(store.pickerState).length, 3);
  actions.undoHand();
  assert.equal(pickerToTiles(store.pickerState).length, 0);
});

test("undoSelectedSlot rolls back action affecting selected slot", () => {
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
        const t = baseTile === "1W" ? "1W" : "2W";
        return { ok: true, reason: null, tiles: [t, t, t] };
      }
      return { ok: true, reason: null, tiles: [baseTile] };
    },
    renderPatternActionButtons: () => {},
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
  actions.pickTile("1W");
  actions.pickTile("2W");
  assert.equal(pickerToTiles(store.pickerState).length, 6);
  actions.selectSlot(2);
  actions.undoSelectedSlot();
  assert.deepEqual(pickerToTiles(store.pickerState), ["2W", "2W", "2W"]);
});

test("resolveInitialPickerMode uses twoLayer for mobile first load", () => {
  const mode = resolveInitialPickerMode({
    isMobile: true,
    storedMode: "flat"
  });
  assert.equal(mode, "twoLayer");
});

test("resolveInitialPickerMode restores desktop stored mode", () => {
  const mode = resolveInitialPickerMode({
    isMobile: false,
    storedMode: "flat"
  });
  assert.equal(mode, "flat");
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
    renderPatternActionButtons: () => {},
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
