/**
 * Purpose: Verify spike schema parsing and validation behavior.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { parseJsonPayload, validateSpikeOutput } from "../../src/spike/vlm/schema.js";

test("parseJsonPayload parses strict JSON text", () => {
  const parsed = parseJsonPayload('{"tiles":[],"confidences":[],"uncertainIndices":[]}');
  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.data.tiles, []);
});

test("parseJsonPayload extracts JSON from markdown code fence", () => {
  const wrapped = 'Here is result:\n```json\n{"tiles":[],"confidences":[],"uncertainIndices":[]}\n```';
  const parsed = parseJsonPayload(wrapped);
  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.data.uncertainIndices, []);
});

test("validateSpikeOutput accepts legal 14 tiles payload", () => {
  const payload = {
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "R"],
    confidences: [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
    uncertainIndices: [13]
  };
  const result = validateSpikeOutput(payload);
  assert.equal(result.ok, true);
});

test("validateSpikeOutput rejects invalid tile code", () => {
  const payload = {
    tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "10W"],
    confidences: new Array(14).fill(0.9),
    uncertainIndices: []
  };
  const result = validateSpikeOutput(payload);
  assert.equal(result.ok, false);
  assert.equal(result.code, "INVALID_VLM_OUTPUT");
});

test("validateSpikeOutput accepts flower tile codes", () => {
  const payload = {
    tiles: ["1W", "2W", "3W", "4W", "5W", "6W", "7W", "8W", "9W", "E", "S", "Ch", "La", "Wh"],
    confidences: new Array(14).fill(0.9),
    uncertainIndices: [11, 12]
  };
  const result = validateSpikeOutput(payload);
  assert.equal(result.ok, true);
});

test("validateSpikeOutput normalizes legacy flower aliases to canonical codes", () => {
  const payload = {
    tiles: ["1W", "2W", "3W", "4W", "5W", "6W", "7W", "8W", "9W", "E", "S", "F1", "J2", "Wh"],
    confidences: new Array(14).fill(0.9),
    uncertainIndices: [11, 12]
  };
  const result = validateSpikeOutput(payload);
  assert.equal(result.ok, true);
  assert.deepEqual(payload.tiles.slice(11, 13), ["Ch", "La"]);
});
