/**
 * Purpose: Validate Ollama client parsing and HTTP error handling.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { createOllamaClient } from "../../src/spike/vlm/ollamaClient.js";

test("createOllamaClient extracts text from message.content", async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({ message: { content: '{"tiles":[],"confidences":[],"uncertainIndices":[]}' } })
  });
  const client = createOllamaClient({ fetchImpl });
  const text = await client.inferFromImage({ imageDataUrl: "data:image/png;base64,a" });
  assert.match(text, /"tiles"/);
});

test("createOllamaClient extracts text from response fallback", async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({ response: '{"tiles":[],"confidences":[],"uncertainIndices":[]}' })
  });
  const client = createOllamaClient({ fetchImpl });
  const text = await client.inferFromImage({ imageDataUrl: "data:image/png;base64,a" });
  assert.match(text, /"confidences"/);
});

test("createOllamaClient reports provider http diagnostics on non-2xx", async () => {
  const fetchImpl = async () => ({
    ok: false,
    status: 404,
    text: async () => '{"error":"model qwen3-vl:4b not found"}'
  });
  const client = createOllamaClient({ fetchImpl });
  await assert.rejects(
    () => client.inferFromImage({ imageDataUrl: "data:image/png;base64,a" }),
    (error) => {
      assert.equal(error.code, "PROVIDER_HTTP_ERROR");
      assert.equal(error.status, 404);
      assert.match(error.providerBodyPreview, /not found/i);
      return true;
    }
  );
});
