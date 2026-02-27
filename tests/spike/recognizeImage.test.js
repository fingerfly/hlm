/**
 * Purpose: Validate DeepSeek spike recognition flow and error mapping.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { recognizeWithDeepSeek } from "../../src/spike/vlm/recognizeImage.js";

const jsonText = JSON.stringify({
  tiles: ["1W", "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "R"],
  confidences: new Array(14).fill(0.95),
  uncertainIndices: []
});

test("recognizeWithDeepSeek requires explicit consent", async () => {
  const result = await recognizeWithDeepSeek({
    imageDataUrl: "data:image/png;base64,abc",
    consentGranted: false,
    requestId: "r1",
    client: { inferFromImage: async () => jsonText }
  });
  assert.equal(result.ok, false);
  assert.equal(result.code, "CONSENT_REQUIRED");
});

test("recognizeWithDeepSeek returns structured tiles on valid output", async () => {
  const result = await recognizeWithDeepSeek({
    imageDataUrl: "data:image/png;base64,abc",
    consentGranted: true,
    requestId: "r2",
    client: { inferFromImage: async () => jsonText }
  });
  assert.equal(result.ok, true);
  assert.equal(result.data.tiles.length, 14);
});

test("recognizeWithDeepSeek maps thrown timeout to TIMEOUT code", async () => {
  const result = await recognizeWithDeepSeek({
    imageDataUrl: "data:image/png;base64,abc",
    consentGranted: true,
    requestId: "r3",
    client: {
      inferFromImage: async () => {
        const err = new Error("timeout");
        err.code = "TIMEOUT";
        throw err;
      }
    }
  });
  assert.equal(result.ok, false);
  assert.equal(result.code, "TIMEOUT");
});

test("recognizeWithDeepSeek returns rawTextPreview for invalid JSON output", async () => {
  const result = await recognizeWithDeepSeek({
    imageDataUrl: "data:image/png;base64,abc",
    consentGranted: true,
    requestId: "r4",
    client: { inferFromImage: async () => "I cannot parse this image." }
  });
  assert.equal(result.ok, false);
  assert.equal(result.code, "INVALID_VLM_OUTPUT");
  assert.match(result.rawTextPreview, /cannot parse/i);
});

test("recognizeWithDeepSeek exposes provider HTTP diagnostics", async () => {
  const err = Object.assign(new Error("provider http 401"), {
    code: "PROVIDER_HTTP_ERROR",
    status: 401,
    providerBodyPreview: '{"error":"invalid api key"}'
  });
  const result = await recognizeWithDeepSeek({
    imageDataUrl: "data:image/png;base64,abc",
    consentGranted: true,
    requestId: "r5",
    client: { inferFromImage: async () => { throw err; } }
  });
  assert.equal(result.ok, false);
  assert.equal(result.code, "PROVIDER_HTTP_ERROR");
  assert.equal(result.providerHttpStatus, 401);
  assert.match(result.providerBodyPreview, /invalid api key/i);
});

test("recognizeWithDeepSeek retries once when tiles length is not 14", async () => {
  const invalidLen = JSON.stringify({
    tiles: ["1W", "2W", "3W"],
    confidences: [0.9, 0.9, 0.9],
    uncertainIndices: []
  });
  let calls = 0;
  const result = await recognizeWithDeepSeek({
    imageDataUrl: "data:image/png;base64,abc",
    consentGranted: true,
    requestId: "r6",
    client: {
      inferFromImage: async () => {
        calls += 1;
        return calls === 1 ? invalidLen : jsonText;
      }
    }
  });
  assert.equal(calls, 2);
  assert.equal(result.ok, true);
  assert.equal(result.data.tiles.length, 14);
});

test("recognizeWithDeepSeek voting aggregates majority tiles and uncertainty", async () => {
  const mk = (tileAt0, uncertain = []) =>
    JSON.stringify({
      tiles: [tileAt0, "1W", "1W", "2W", "3W", "4W", "5W", "6W", "7W", "2T", "3T", "4T", "9B", "R"],
      confidences: new Array(14).fill(0.9),
      uncertainIndices: uncertain
    });

  const responses = [mk("1W"), mk("2W"), mk("2W")];
  let calls = 0;
  const result = await recognizeWithDeepSeek({
    imageDataUrl: "data:image/png;base64,abc",
    consentGranted: true,
    requestId: "r7",
    votePasses: 3,
    client: {
      inferFromImage: async () => responses[calls++]
    }
  });
  assert.equal(result.ok, true);
  assert.equal(result.data.tiles[0], "2W");
  assert.deepEqual(result.data.uncertainIndices, [0]);
  assert.equal(calls, 3);
});
