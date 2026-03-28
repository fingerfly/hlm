/**
 * Purpose: Unit tests for desktop mirror sync from hidden context fields.
 * Description:
 * - Uses plain objects with .value (no DOM) for byId mocks.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { syncContextDesktopMirrors } from "../../public/contextWiring.js";

test("syncContextDesktopMirrors maps hiddens to select and number inputs", () => {
  const els = {
    timingEvent: { value: "haidi" },
    timingEventSelect: { value: "none" },
    flowerCount: { value: "5" },
    flowerCountInput: { value: "0" },
    kongAnCount: { value: "2" },
    kongMingCount: { value: "1" },
    kongAnCountInput: { value: "0" },
    kongMingCountInput: { value: "0" }
  };
  const byId = (id) => els[id] ?? null;
  syncContextDesktopMirrors(byId);
  assert.equal(els.timingEventSelect.value, "haidi");
  assert.equal(els.flowerCountInput.value, "5");
  assert.equal(els.kongAnCountInput.value, "2");
  assert.equal(els.kongMingCountInput.value, "1");
});

test("syncContextDesktopMirrors clamps flower display and fixes kong sum", () => {
  const els = {
    timingEvent: { value: "none" },
    timingEventSelect: { value: "none" },
    flowerCount: { value: "99" },
    flowerCountLabel: { textContent: "" },
    flowerCountInput: { value: "0" },
    kongAnCount: { value: "3" },
    kongMingCount: { value: "3" },
    kongMingLabel: { textContent: "" },
    kongAnCountInput: { value: "0" },
    kongMingCountInput: { value: "0" }
  };
  const byId = (id) => els[id] ?? null;
  syncContextDesktopMirrors(byId);
  assert.equal(els.flowerCount.value, "8");
  assert.equal(els.flowerCountLabel.textContent, "8");
  assert.equal(els.flowerCountInput.value, "8");
  assert.equal(els.kongMingCount.value, "1");
  assert.equal(els.kongMingLabel.textContent, "1");
  assert.equal(els.kongAnCountInput.value, "3");
  assert.equal(els.kongMingCountInput.value, "1");
});
