/**
 * Purpose: Validate provider-specific request payload builders.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { buildProviderRequest } from "../../src/spike/vlm/requestBuilders.js";

test("buildProviderRequest creates text-mode payload with image_url in messages", () => {
  const req = buildProviderRequest({
    provider: "deepseek_text",
    model: "m",
    imageDataUrl: "data:image/png;base64,abc"
  });
  assert.equal(req.urlPath, "/chat/completions");
  assert.equal(req.body.messages[0].content[1].type, "image_url");
});

test("buildProviderRequest creates vl2-mode payload with images field", () => {
  const req = buildProviderRequest({
    provider: "deepseek_vl2",
    model: "m",
    imageDataUrl: "data:image/png;base64,abc"
  });
  assert.equal(req.urlPath, "/chat/completions");
  assert.equal(Array.isArray(req.body.images), true);
  assert.equal(req.body.images[0].image_url, "data:image/png;base64,abc");
});

test("buildProviderRequest creates ollama payload with base64 image array", () => {
  const req = buildProviderRequest({
    provider: "ollama_qwen3vl",
    model: "qwen3-vl:4b",
    imageDataUrl: "data:image/png;base64,abc123"
  });
  assert.equal(req.urlPath, "/api/chat");
  assert.equal(req.body.model, "qwen3-vl:4b");
  assert.equal(req.body.stream, false);
  assert.equal(req.body.messages[0].images[0], "abc123");
});
