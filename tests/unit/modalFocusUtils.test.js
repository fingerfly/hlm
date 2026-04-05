import test from "node:test";
import assert from "node:assert/strict";
import { focusFirstInModalSheet } from "../../public/modalFocusUtils.js";

test("focusFirstInModalSheet focuses first button in picker sheet", () => {
  const calls = [];
  const btn = {
    focus: () => calls.push("focus-btn")
  };
  const sheet = {
    querySelector: (sel) => {
      assert.match(sel, /button/);
      return btn;
    }
  };
  const modalRefs = {
    picker: { querySelector: (sel) => (sel === ".sheet" ? sheet : null) }
  };
  focusFirstInModalSheet("picker", () => null, modalRefs);
  assert.deepEqual(calls, ["focus-btn"]);
});

test("focusFirstInModalSheet no-op for help key", () => {
  focusFirstInModalSheet("help", () => null, {});
});
