/**
 * Purpose: Regression guard — every catalog detector callable on minimal ctx.
 * Description:
 *   - Empty tiles + empty standard melds; no throws from detect(ctx).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { FAN_CATALOG } from "../../src/rules/fanCatalog.js";
import { extractHandFeatures } from "../../src/rules/handFeatures.js";

test("FAN_CATALOG detect() does not throw on minimal hand context", () => {
  const input = {
    tiles: [],
    winType: "dianhe",
    handState: "fulu",
    kongType: "none",
    timingEvent: "none",
    advancedAuto: true
  };
  const win = { pattern: "standard", meldGroups: [] };
  const features = extractHandFeatures(input, win);
  const ctx = { input, features, win };
  for (const item of FAN_CATALOG) {
    assert.doesNotThrow(() => {
      item.detect(ctx);
    }, `detect threw for ${item.id}`);
  }
});
