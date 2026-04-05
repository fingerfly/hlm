import test from "node:test";
import assert from "node:assert/strict";
import {
  modalRootShowsDimmedBackdrop,
  installModalBackdropDismiss,
  installHelpPopoverOutsidePointerDown
} from "../../public/modalBackdropWiring.js";

test("modalRootShowsDimmedBackdrop false for desktop inline picker", () => {
  const el = {
    id: "pickerModal",
    classList: { contains: (c) => c === "desktop-inline-picker" }
  };
  assert.equal(modalRootShowsDimmedBackdrop(el), false);
});

test("modalRootShowsDimmedBackdrop false for desktop inline context", () => {
  const el = {
    id: "contextModal",
    classList: { contains: (c) => c === "desktop-inline-context" }
  };
  assert.equal(modalRootShowsDimmedBackdrop(el), false);
});

test("modalRootShowsDimmedBackdrop true for picker without inline class", () => {
  const el = {
    id: "pickerModal",
    classList: { contains: () => false }
  };
  assert.equal(modalRootShowsDimmedBackdrop(el), true);
});

test("installModalBackdropDismiss closes when root click and is-open", () => {
  const calls = [];
  const state = new Set(["is-open"]);
  const modal = {
    id: "resultModal",
    classList: {
      contains: (n) => state.has(n)
    },
    addEventListener: (ev, fn) => {
      modal._fn = fn;
    }
  };
  installModalBackdropDismiss(
    [{ el: modal, key: "result" }],
    (k) => calls.push(k)
  );
  modal._fn({ target: modal });
  assert.deepEqual(calls, ["result"]);
});

test("installModalBackdropDismiss ignores sheet child clicks", () => {
  const calls = [];
  const sheet = {};
  const modal = {
    id: "pickerModal",
    classList: {
      contains: (n) => n === "is-open"
    },
    addEventListener: (ev, fn) => {
      modal._fn = fn;
    }
  };
  installModalBackdropDismiss(
    [{ el: modal, key: "picker" }],
    (k) => calls.push(k)
  );
  modal._fn({ target: sheet });
  assert.deepEqual(calls, []);
});

test("installModalBackdropDismiss skips when desktop inline picker", () => {
  const calls = [];
  const modal = {
    id: "pickerModal",
    classList: {
      contains: (n) =>
        n === "is-open" || n === "desktop-inline-picker"
    },
    addEventListener: (ev, fn) => {
      modal._fn = fn;
    }
  };
  installModalBackdropDismiss(
    [{ el: modal, key: "picker" }],
    (k) => calls.push(k)
  );
  modal._fn({ target: modal });
  assert.deepEqual(calls, []);
});

test("installHelpPopoverOutsidePointerDown closes when outside", () => {
  const popover = {
    contains: (n) => n === "in"
  };
  const trigger = { contains: () => false };
  let closed = false;
  const doc = {
    _h: null,
    addEventListener: (ev, fn, cap) => {
      doc._h = fn;
    },
    removeEventListener: (ev, fn, cap) => {
      if (doc._h === fn) doc._h = null;
    }
  };
  const teardown = installHelpPopoverOutsidePointerDown({
    isPopoverMode: () => true,
    getPopover: () => popover,
    getTrigger: () => trigger,
    isPopoverOpen: () => true,
    onClose: () => {
      closed = true;
    },
    doc
  });
  doc._h({ target: "outside" });
  assert.equal(closed, true);
  teardown();
  assert.equal(doc._h, null);
});

test("installHelpPopoverOutsidePointerDown ignores inside popover", () => {
  const popover = {
    contains: (n) => true
  };
  let closed = false;
  const doc = {
    _h: null,
    addEventListener: (ev, fn) => {
      doc._h = fn;
    },
    removeEventListener: () => {}
  };
  installHelpPopoverOutsidePointerDown({
    isPopoverMode: () => true,
    getPopover: () => popover,
    getTrigger: () => null,
    isPopoverOpen: () => true,
    onClose: () => {
      closed = true;
    },
    doc
  });
  doc._h({ target: "in" });
  assert.equal(closed, false);
});
