/**
 * Purpose: Unit tests for wizard step-3 calculate failure hint helper.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { applyStep3CalculateFailureHint } from "../../public/wizardCalculateHint.js";

test("applyStep3CalculateFailureHint respects visible role error", () => {
  const hint = { textContent: "" };
  const byId = (id) => {
    if (id === "roleValidationError") {
      return { hidden: false, textContent: "role problem" };
    }
    if (id === "readyHint") return hint;
    return null;
  };
  const store = { uiState: { hand: { tiles: Array(14).fill("1W") } } };
  applyStep3CalculateFailureHint(store, byId);
  assert.equal(hint.textContent, "");
});

test("applyStep3CalculateFailureHint asks for 14 tiles when short", () => {
  const hint = { textContent: "" };
  const byId = (id) => {
    if (id === "roleValidationError") {
      return { hidden: true, textContent: "" };
    }
    if (id === "readyHint") return hint;
    return null;
  };
  const store = { uiState: { hand: { tiles: ["1W"] } } };
  applyStep3CalculateFailureHint(store, byId);
  assert.match(hint.textContent, /14/);
});

test("applyStep3CalculateFailureHint shows calculate guidance when 14 tiles", () => {
  const hint = { textContent: "" };
  const byId = (id) => {
    if (id === "roleValidationError") {
      return { hidden: true, textContent: "" };
    }
    if (id === "readyHint") return hint;
    return null;
  };
  const store = { uiState: { hand: { tiles: Array(14).fill("1W") } } };
  applyStep3CalculateFailureHint(store, byId);
  assert.match(hint.textContent, /无法计算/);
});
