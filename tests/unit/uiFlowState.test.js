import test from "node:test";
import assert from "node:assert/strict";
import {
  createUiFlowState,
  openModal,
  closeModal,
  setResultPayload,
  canCalculate,
  setWizardStep,
  nextWizardStep,
  prevWizardStep
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

test("wizard step starts at tile input and clamps", () => {
  const state = createUiFlowState();
  assert.equal(state.wizard.step, 1);
  assert.equal(setWizardStep(state, 2).wizard.step, 2);
  assert.equal(setWizardStep(state, 8).wizard.step, 3);
  assert.equal(setWizardStep(state, -2).wizard.step, 1);
});

test("wizard next and prev step stay in bounds", () => {
  let state = createUiFlowState();
  state = nextWizardStep(state);
  assert.equal(state.wizard.step, 2);
  state = nextWizardStep(state);
  assert.equal(state.wizard.step, 3);
  state = nextWizardStep(state);
  assert.equal(state.wizard.step, 3);
  state = prevWizardStep(state);
  assert.equal(state.wizard.step, 2);
  state = prevWizardStep(state);
  assert.equal(state.wizard.step, 1);
  state = prevWizardStep(state);
  assert.equal(state.wizard.step, 1);
});
