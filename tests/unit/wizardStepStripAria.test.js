/**
 * Purpose: Unit tests for desktop wizard step strip ARIA sync.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { syncWizardStepStripAria } from "../../public/homeStateView.js";

function makeStrip() {
  const stepItems = [1, 2, 3].map((n) => {
    const attrs = new Map([["data-wizard-step", String(n)]]);
    return {
      getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
      setAttribute: (k, v) => {
        attrs.set(k, v);
      },
      removeAttribute: (k) => {
        attrs.delete(k);
      },
      hasAriaCurrent: () => attrs.has("aria-current"),
      getAriaCurrent: () => attrs.get("aria-current")
    };
  });
  return {
    querySelectorAll: (sel) => {
      if (sel !== "[data-wizard-step]") return [];
      return stepItems;
    }
  };
}

test("syncWizardStepStripAria sets aria-current on active step only", () => {
  const root = makeStrip();
  syncWizardStepStripAria(2, root);
  const items = [...root.querySelectorAll("[data-wizard-step]")];
  assert.equal(items[0].hasAriaCurrent(), false);
  assert.equal(items[1].getAriaCurrent(), "step");
  assert.equal(items[2].hasAriaCurrent(), false);
});

test("syncWizardStepStripAria no-ops when strip root is null", () => {
  assert.doesNotThrow(() => syncWizardStepStripAria(1, null));
});
