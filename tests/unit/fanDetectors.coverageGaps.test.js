/**
 * Purpose: Positive detectFans cases for features under-tested elsewhere.
 * Description:
 *   - SAN_SE_SAN_JIE_GAO, YI_SE_SI_BU_GAO, QUAN_SHUANG_KE (advancedAuto).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { detectFans } from "../../src/rules/fanDetectors.js";

test("detectFans hits SAN_SE_SAN_JIE_GAO on mixed shifted pungs", () => {
  const tiles = [
    "1W", "1W", "1W",
    "2T", "2T", "2T",
    "3B", "3B", "3B",
    "4W", "5W", "6W",
    "7W", "7W"
  ];
  const input = {
    tiles,
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    advancedAuto: true
  };
  const win = {
    pattern: "standard",
    meldGroups: [
      { type: "pung", tiles: ["1W", "1W", "1W"] },
      { type: "pung", tiles: ["2T", "2T", "2T"] },
      { type: "pung", tiles: ["3B", "3B", "3B"] },
      { type: "chow", tiles: ["4W", "5W", "6W"] },
      { type: "pair", tiles: ["7W", "7W"] }
    ]
  };
  const fans = detectFans(input, win);
  assert.equal(fans.some((f) => f.id === "SAN_SE_SAN_JIE_GAO"), true);
});

test("detectFans hits YI_SE_SI_BU_GAO on four shifted chows one suit", () => {
  const tiles = [
    "1W", "2W", "3W",
    "2W", "3W", "4W",
    "3W", "4W", "5W",
    "4W", "5W", "6W",
    "7W", "7W"
  ];
  const input = {
    tiles,
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    advancedAuto: true
  };
  const win = {
    pattern: "standard",
    meldGroups: [
      { type: "chow", tiles: ["1W", "2W", "3W"] },
      { type: "chow", tiles: ["2W", "3W", "4W"] },
      { type: "chow", tiles: ["3W", "4W", "5W"] },
      { type: "chow", tiles: ["4W", "5W", "6W"] },
      { type: "pair", tiles: ["7W", "7W"] }
    ]
  };
  const fans = detectFans(input, win);
  assert.equal(fans.some((f) => f.id === "YI_SE_SI_BU_GAO"), true);
});

test("detectFans hits QUAN_SHUANG_KE on all-even pungs", () => {
  const tiles = [
    "2W", "2W", "2W",
    "4W", "4W", "4W",
    "6T", "6T", "6T",
    "8B", "8B", "8B",
    "2B", "2B"
  ];
  const input = {
    tiles,
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    advancedAuto: true
  };
  const win = {
    pattern: "standard",
    meldGroups: [
      { type: "pung", tiles: ["2W", "2W", "2W"] },
      { type: "pung", tiles: ["4W", "4W", "4W"] },
      { type: "pung", tiles: ["6T", "6T", "6T"] },
      { type: "pung", tiles: ["8B", "8B", "8B"] },
      { type: "pair", tiles: ["2B", "2B"] }
    ]
  };
  const fans = detectFans(input, win);
  assert.equal(fans.some((f) => f.id === "QUAN_SHUANG_KE"), true);
});
