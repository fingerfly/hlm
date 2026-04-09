/**
 * Purpose: Unit tests for Escape key closing modals in app bootstrap.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { installEscapeClosesModals } from "../../public/escapeKeyModalWiring.js";

test("installEscapeClosesModals closes picker and prevents default", () => {
  const calls = [];
  const store = { uiState: { modal: { picker: true, context: false } } };
  const byId = () => ({
    classList: { contains: () => false }
  });
  const modalActions = {
    closeModalByKey: (k) => calls.push(k)
  };
  const doc = {
    addEventListener: (evt, fn) => {
      if (evt === "keydown") {
        fn({ key: "Escape", preventDefault: () => calls.push("pd") });
      }
    }
  };
  installEscapeClosesModals(doc, { byId, store, modalActions });
  assert.deepEqual(calls, ["pd", "picker"]);
});

test("installEscapeClosesModals skips context when desktop inline", () => {
  const calls = [];
  const store = { uiState: { modal: { picker: false, context: true } } };
  const byId = () => ({
    classList: { contains: (c) => c === "desktop-inline-context" }
  });
  const modalActions = {
    closeModalByKey: (k) => calls.push(k)
  };
  const doc = {
    addEventListener: (evt, fn) => {
      if (evt === "keydown") {
        fn({ key: "Escape", preventDefault: () => calls.push("pd") });
      }
    }
  };
  installEscapeClosesModals(doc, { byId, store, modalActions });
  assert.deepEqual(calls, []);
});
