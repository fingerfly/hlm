/**
 * Purpose: Validate DeepSeek client response text extraction behavior.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { createDeepSeekClient } from "../../src/spike/vlm/deepseekClient.js";

test("createDeepSeekClient extracts text from array content", async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({
      choices: [
        {
          message: {
            content: [{ type: "text", text: '{"tiles":[],"confidences":[],"uncertainIndices":[]}' }]
          }
        }
      ]
    })
  });
  const client = createDeepSeekClient({ apiKey: "k", fetchImpl });
  const text = await client.inferFromImage({ imageDataUrl: "data:image/png;base64,a" });
  assert.match(text, /"tiles"/);
});

test("createDeepSeekClient falls back to provider preview on empty content", async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({
      id: "resp1",
      model: "demo-model",
      choices: [{ finish_reason: "stop", message: { role: "assistant", content: [] } }]
    })
  });
  const client = createDeepSeekClient({ apiKey: "k", fetchImpl });
  const text = await client.inferFromImage({ imageDataUrl: "data:image/png;base64,a" });
  assert.match(text, /message_content_type/);
});

test("createDeepSeekClient supports deepseek_vl2 provider mode", async () => {
  let capturedBody = null;
  const fetchImpl = async (_url, options) => {
    capturedBody = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({ choices: [{ message: { content: '{"tiles":[],"confidences":[],"uncertainIndices":[]}' } }] })
    };
  };
  const client = createDeepSeekClient({ apiKey: "k", provider: "deepseek_vl2", fetchImpl });
  await client.inferFromImage({ imageDataUrl: "data:image/png;base64,a" });
  assert.equal(Array.isArray(capturedBody.images), true);
});
