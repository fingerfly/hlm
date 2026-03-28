import test from "node:test";
import assert from "node:assert/strict";
import {
  syncDesktopPickerSheet,
  isDesktopWorkspaceLayout
} from "../../public/desktopPickerMount.js";

test("isDesktopWorkspaceLayout follows matchMedia", () => {
  const prev = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: true });
  assert.equal(isDesktopWorkspaceLayout(), true);
  globalThis.matchMedia = () => ({ matches: false });
  assert.equal(isDesktopWorkspaceLayout(), false);
  globalThis.matchMedia = prev;
});

test("syncDesktopPickerSheet moves sheet into host on desktop", () => {
  const prev = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: true });
  const sheet = { parentNode: null };
  const host = {
    _child: null,
    contains: (el) => host._child === el,
    appendChild: null,
    dataset: {}
  };
  const pickerModal = {
    _child: sheet,
    querySelector: () => sheet,
    contains: (el) => pickerModal._child === el,
    classList: { add: () => {} },
    dataset: {}
  };
  host.appendChild = (el) => {
    if (el.parentNode === pickerModal) pickerModal._child = null;
    host._child = el;
    el.parentNode = host;
  };
  pickerModal.appendChild = (el) => {
    if (el.parentNode === host) host._child = null;
    pickerModal._child = el;
    el.parentNode = pickerModal;
  };
  sheet.parentNode = pickerModal;
  const byId = (id) => {
    if (id === "desktopPickerHost") return host;
    if (id === "pickerModal") return pickerModal;
    return null;
  };
  syncDesktopPickerSheet(byId);
  assert.equal(sheet.parentNode, host);
  assert.equal(pickerModal.dataset.pickerInlineHost, "desktopPickerHost");
  globalThis.matchMedia = prev;
});

test("syncDesktopPickerSheet restores sheet to modal below breakpoint", () => {
  const prev = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: false });
  const sheet = { parentNode: null };
  const host = {
    _child: sheet,
    contains: (el) => host._child === el,
    appendChild: () => {},
    dataset: { mode: "inline" }
  };
  const pickerModal = {
    _child: null,
    querySelector: () => sheet,
    contains: (el) => pickerModal._child === el,
    classList: { remove: () => {} },
    dataset: { pickerInlineHost: "x" }
  };
  pickerModal.appendChild = (el) => {
    if (el.parentNode === host) host._child = null;
    pickerModal._child = el;
    el.parentNode = pickerModal;
  };
  sheet.parentNode = host;
  const byId = (id) => {
    if (id === "desktopPickerHost") return host;
    if (id === "pickerModal") return pickerModal;
    return null;
  };
  let removedInline = false;
  pickerModal.classList.remove = (c) => {
    if (c === "desktop-inline-picker") removedInline = true;
  };
  syncDesktopPickerSheet(byId);
  assert.equal(sheet.parentNode, pickerModal);
  assert.equal(removedInline, true);
  assert.equal("pickerInlineHost" in pickerModal.dataset, false);
  globalThis.matchMedia = prev;
});
