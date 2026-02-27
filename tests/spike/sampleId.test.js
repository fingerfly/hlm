/**
 * Purpose: Verify sample ID normalization for mixed extension filenames.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { isSupportedImageFile, normalizeSampleId } from "../../src/spike/vlm/sampleId.js";

test("normalizeSampleId strips single and chained image extensions", () => {
  assert.equal(normalizeSampleId("sample_01.jpg"), "sample_01");
  assert.equal(normalizeSampleId("sample_01.jpg.heic"), "sample_01");
});

test("isSupportedImageFile checks final extension only", () => {
  assert.equal(isSupportedImageFile("a.jpg"), true);
  assert.equal(isSupportedImageFile("a.jpg.heic"), true);
  assert.equal(isSupportedImageFile("a.txt"), false);
});
