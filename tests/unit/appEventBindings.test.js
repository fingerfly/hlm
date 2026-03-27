import test from "node:test";
import assert from "node:assert/strict";
import {
  createBindClick,
  bindModalCloseButtons
} from "../../public/appEventBindings.js";

test("createBindClick binds click handler when element exists", () => {
  let called = 0;
  const element = {
    addEventListener: (name, fn) => {
      assert.equal(name, "click");
      fn();
    }
  };
  const byId = (id) => (id === "okBtn" ? element : null);
  const bindClick = createBindClick(byId);
  bindClick("okBtn", () => {
    called += 1;
  });
  assert.equal(called, 1);
});

test("bindModalCloseButtons wires picker/context/result/help", () => {
  const selectors = [];
  const closed = [];
  bindModalCloseButtons(
    (selector, onClick) => {
      selectors.push(selector);
      onClick();
    },
    {
      closeModalByKey: (key) => closed.push(key)
    }
  );
  assert.deepEqual(selectors, [
    "[data-close='picker']",
    "[data-close='context']",
    "[data-close='result']",
    "[data-close='help']"
  ]);
  assert.deepEqual(closed, ["picker", "context", "result", "help"]);
});
