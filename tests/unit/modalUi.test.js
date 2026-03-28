import test from "node:test";
import assert from "node:assert/strict";
import { setModalOpen } from "../../public/modalUi.js";

test("setModalOpen toggles is-open class", () => {
  const el = {
    classList: {
      state: new Set(),
      toggle(name, on) {
        if (on) this.state.add(name);
        else this.state.delete(name);
      }
    }
  };
  setModalOpen(el, true);
  assert.equal(el.classList.state.has("is-open"), true);
  setModalOpen(el, false);
  assert.equal(el.classList.state.has("is-open"), false);
});

test("setModalOpen syncs desktop inline picker host hidden", () => {
  const host = { hidden: true, id: "desktopPickerHost" };
  globalThis.document = {
    getElementById: (id) => (id === "desktopPickerHost" ? host : null)
  };
  const pickerModal = {
    id: "pickerModal",
    classList: {
      contains: (c) => c === "desktop-inline-picker",
      toggle: () => {}
    },
    dataset: { pickerInlineHost: "desktopPickerHost" }
  };
  setModalOpen(pickerModal, true);
  assert.equal(host.hidden, false);
  setModalOpen(pickerModal, false);
  assert.equal(host.hidden, true);
  delete globalThis.document;
});
