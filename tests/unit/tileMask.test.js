/**
 * Purpose: Verify 14-bit uncertainty mask conversions and validation.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { indicesToMask, maskToIndices } from "../../src/tiles/tileCodes.js";

test("indicesToMask and maskToIndices roundtrip", () => {
  const indices = [0, 3, 9, 13];
  const mask = indicesToMask(indices);
  assert.equal(mask, (1 << 0) | (1 << 3) | (1 << 9) | (1 << 13));
  assert.deepEqual(maskToIndices(mask), indices);
});

test("indicesToMask rejects out-of-range index", () => {
  assert.throws(
    () => indicesToMask([14]),
    (error) => error?.code === "INVALID_UNCERTAIN_INDEX"
  );
});

test("maskToIndices rejects reserved high bits", () => {
  assert.throws(
    () => maskToIndices(1 << 15),
    (error) => error?.code === "INVALID_UNCERTAIN_MASK"
  );
});
