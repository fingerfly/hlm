import test from "node:test";
import assert from "node:assert/strict";
import { createUiFlowState } from "../../src/app/uiFlowState.js";
import { createModalActions } from "../../public/appModalActions.js";

function createModalEl() {
  return {
    classList: {
      state: new Set(),
      toggle(name, on) {
        if (on) this.state.add(name);
        else this.state.delete(name);
      }
    }
  };
}

test("openModalByKey keeps only one modal open at a time", () => {
  const store = { uiState: createUiFlowState() };
  const modalRefs = {
    picker: createModalEl(),
    context: createModalEl(),
    result: createModalEl(),
    help: createModalEl()
  };
  const actions = createModalActions(store, modalRefs);
  actions.openModalByKey("picker");
  assert.equal(store.uiState.modal.picker, true);
  assert.equal(store.uiState.modal.context, false);
  assert.equal(store.uiState.modal.result, false);
  assert.equal(store.uiState.modal.help, false);

  actions.openModalByKey("help");
  assert.equal(store.uiState.modal.picker, false);
  assert.equal(store.uiState.modal.context, false);
  assert.equal(store.uiState.modal.result, false);
  assert.equal(store.uiState.modal.help, true);
});

test("openModalByKey invokes onBeforeOpenModal before state change", () => {
  const store = { uiState: createUiFlowState() };
  const modalRefs = {
    picker: createModalEl(),
    context: createModalEl(),
    result: createModalEl(),
    help: createModalEl()
  };
  const order = [];
  const actions = createModalActions(store, modalRefs, {
    onBeforeOpenModal: () => order.push("before")
  });
  actions.openModalByKey("picker");
  assert.deepEqual(order, ["before"]);
  assert.equal(store.uiState.modal.picker, true);
});
