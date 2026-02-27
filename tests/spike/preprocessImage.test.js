/**
 * Purpose: Verify preprocessing config parsing and crop geometry.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { buildBottomCropRect, parsePreprocessConfig } from "../../src/spike/vlm/preprocessImage.js";

test("parsePreprocessConfig returns defaults when disabled", () => {
  const cfg = parsePreprocessConfig({});
  assert.equal(cfg.enabled, false);
  assert.equal(cfg.cropBottomRatio, 0.4);
  assert.equal(cfg.contrast, 0.12);
  assert.equal(cfg.brightness, 0.02);
});

test("parsePreprocessConfig parses enabled flags and numeric overrides", () => {
  const cfg = parsePreprocessConfig({
    VLM_PREPROCESS: "true",
    VLM_PRE_CROP_BOTTOM_RATIO: "0.35",
    VLM_PRE_CONTRAST: "0.2",
    VLM_PRE_BRIGHTNESS: "0.05"
  });
  assert.equal(cfg.enabled, true);
  assert.equal(cfg.cropBottomRatio, 0.35);
  assert.equal(cfg.contrast, 0.2);
  assert.equal(cfg.brightness, 0.05);
});

test("parsePreprocessConfig rejects invalid numeric range", () => {
  assert.throws(
    () => parsePreprocessConfig({ VLM_PRE_CROP_BOTTOM_RATIO: "1.2" }),
    /VLM_PRE_CROP_BOTTOM_RATIO/
  );
});

test("buildBottomCropRect keeps full width and bottom band", () => {
  const rect = buildBottomCropRect(1000, 500, 0.4);
  assert.deepEqual(rect, { x: 0, y: 300, w: 1000, h: 200 });
});
