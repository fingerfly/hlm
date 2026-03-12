import test from "node:test";
import assert from "node:assert/strict";
import {
  createUiFlowState,
  openModal,
  closeModal,
  setResultPayload,
  canCalculate
} from "../../src/app/uiFlowState.js";

test("ui flow opens and closes modal states", () => {
  let state = createUiFlowState();
  assert.equal(state.modal.picker, false);
  state = openModal(state, "picker");
  assert.equal(state.modal.picker, true);
  state = closeModal(state, "picker");
  assert.equal(state.modal.picker, false);
});

test("ui flow keeps result and opens result modal", () => {
  let state = createUiFlowState();
  const payload = { scoring: { totalFan: 3, isWin: true } };
  state = setResultPayload(state, payload);
  assert.equal(state.modal.result, true);
  assert.equal(state.result.scoring.totalFan, 3);
});

test("canCalculate requires 14 tiles and valid context", () => {
  const state = createUiFlowState();
  assert.equal(canCalculate(state), false);
  const full = {
    ...state,
    hand: { ...state.hand, tiles: new Array(14).fill("1W") }
  };
  assert.equal(canCalculate(full), true);
});
