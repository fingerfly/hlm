/**
 * Purpose: Unit tests for desktop inline context sheet mount.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mountDesktopContextInline } from "../../public/desktopContextInlineMount.js";

test("mountDesktopContextInline moves sheet on desktop breakpoint", () => {
  const prev = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: true });
  const sheet = { parentNode: null };
  const host = {
    _child: null,
    contains: (el) => host._child === el,
    appendChild: null,
    dataset: {}
  };
  const contextModal = {
    _child: sheet,
    querySelector: (sel) => (sel === ".context-sheet" ? sheet : null),
    contains: (el) => contextModal._child === el,
    classList: { add: () => {} }
  };
  host.appendChild = (el) => {
    if (el.parentNode === contextModal) contextModal._child = null;
    host._child = el;
    el.parentNode = host;
  };
  sheet.parentNode = contextModal;
  let addedClass = null;
  contextModal.classList.add = (c) => {
    addedClass = c;
  };
  const byId = (id) => {
    if (id === "desktopContextHost") return host;
    if (id === "contextModal") return contextModal;
    return null;
  };
  mountDesktopContextInline(byId);
  assert.equal(sheet.parentNode, host);
  assert.equal(addedClass, "desktop-inline-context");
  assert.equal(host.dataset.mode, "inline");
  globalThis.matchMedia = prev;
});

test("mountDesktopContextInline no-ops below desktop breakpoint", () => {
  const prev = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: false });
  const sheet = { parentNode: null };
  const host = { appendChild: () => assert.fail("should not append") };
  const contextModal = {
    querySelector: () => sheet,
    classList: { add: () => assert.fail("should not add class") }
  };
  const byId = (id) => {
    if (id === "desktopContextHost") return host;
    if (id === "contextModal") return contextModal;
    return null;
  };
  mountDesktopContextInline(byId);
  globalThis.matchMedia = prev;
});
