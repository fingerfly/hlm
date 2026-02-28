/**
 * Purpose: Validate provider-to-client selection for VLM spike runtime.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { createVlmClient } from "../../src/spike/vlm/vlmClientFactory.js";

test("createVlmClient returns Ollama client for ollama provider", () => {
  const client = createVlmClient({
    provider: "ollama_qwen3vl",
    ollama: { baseUrl: "http://localhost:11434", model: "qwen3-vl:4b" },
    deepseek: { apiKey: "x", model: "deepseek-chat" },
    fetchImpl: async () => ({ ok: true, json: async () => ({ message: { content: "{}" } }) })
  });
  assert.equal(typeof client.inferFromImage, "function");
});

test("createVlmClient throws for unknown provider", () => {
  assert.throws(() => createVlmClient({ provider: "bad" }), /Unknown VLM provider/);
});

test("createVlmClient passes ollama timeout config to client", async () => {
  const fetchImpl = (_url, options) =>
    new Promise((_, reject) => {
      options.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })));
    });
  const client = createVlmClient({
    provider: "ollama_qwen3vl",
    ollama: { baseUrl: "http://localhost:11434", model: "qwen3-vl:4b", timeoutMs: 5, retries: 0 },
    fetchImpl
  });
  await assert.rejects(
    () => client.inferFromImage({ imageDataUrl: "data:image/png;base64,a" }),
    (error) => {
      assert.equal(error.code, "TIMEOUT");
      return true;
    }
  );
});
