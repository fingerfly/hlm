/**
 * Purpose: Unit tests for app splash lifecycle wiring.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { installAppSplashLifecycle } from "../../public/appSplash.js";

test("installAppSplashLifecycle sets version on badge and splash", () => {
  const badge = { textContent: "" };
  const splashVersion = { textContent: "" };
  const splashEl = { classList: { add: () => {} } };
  const byId = (id) => {
    if (id === "versionBadge") return badge;
    if (id === "splashVersion") return splashVersion;
    if (id === "appSplash") return splashEl;
    if (id === "splashSkipBtn") return null;
    return null;
  };
  installAppSplashLifecycle({
    byId,
    versionLabel: "9.9.9",
    matchMedia: () => ({ matches: true }),
    setTimeout: () => 0,
    clearTimeout: () => {}
  });
  assert.equal(badge.textContent, "当前版本: 9.9.9");
  assert.equal(splashVersion.textContent, "版本 9.9.9");
});

test("installAppSplashLifecycle dismiss adds splash-dismissed class", () => {
  const added = [];
  const splashEl = {
    classList: {
      add: (c) => {
        added.push(c);
      }
    }
  };
  let dismissFn = null;
  const byId = (id) => {
    if (id === "appSplash") return splashEl;
    if (id === "versionBadge") return { textContent: "" };
    if (id === "splashVersion") return { textContent: "" };
    if (id === "splashSkipBtn") {
      return {
        addEventListener: (_evt, fn) => {
          dismissFn = fn;
        }
      };
    }
    return null;
  };
  installAppSplashLifecycle({
    byId,
    versionLabel: "1.0.0",
    matchMedia: () => ({ matches: false }),
    setTimeout: (cb) => {
      cb();
      return 99;
    },
    clearTimeout: () => {}
  });
  assert.ok(added.includes("splash-dismissed"));
  dismissFn();
  assert.ok(added.filter((c) => c === "splash-dismissed").length >= 1);
});
