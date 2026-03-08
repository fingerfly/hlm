/**
 * Purpose: Verify Ollama readiness checks and remediation messaging.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { assertOllamaReady } from "../../src/spike/vlm/providerHealth.js";

test("assertOllamaReady passes for non-ollama provider", () => {
  const out = assertOllamaReady({ provider: "deepseek_text", runCommand: () => ({ status: 1 }) });
  assert.equal(out.ok, true);
});

test("assertOllamaReady passes when ollama ps succeeds", () => {
  const out = assertOllamaReady({ provider: "ollama_qwen3vl", runCommand: () => ({ status: 0 }) });
  assert.equal(out.ok, true);
});

test("assertOllamaReady returns actionable message when ollama is unavailable", () => {
  const out = assertOllamaReady({ provider: "ollama_qwen3vl", runCommand: () => ({ status: 1 }) });
  assert.equal(out.ok, false);
  assert.match(out.message, /ollama service/i);
});

test("assertOllamaReady includes ollama ps hint when unavailable", () => {
  const out = assertOllamaReady({ provider: "ollama_qwen3vl", runCommand: () => ({ status: 1 }) });
  assert.equal(out.ok, false);
  assert.match(out.message, /ollama ps/i);
});
