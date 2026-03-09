import test from "node:test";
import assert from "node:assert/strict";
import { buildClientRuntimeOptions } from "../../src/spike/vlm/clientRuntime.js";

test("buildClientRuntimeOptions reads ollama timeout/retries from env", () => {
  const out = buildClientRuntimeOptions({
    OLLAMA_TIMEOUT_MS: "12000",
    OLLAMA_RETRIES: "0"
  });
  assert.equal(out.ollama.timeoutMs, 12000);
  assert.equal(out.ollama.retries, 0);
});

test("buildClientRuntimeOptions reads deepseek timeout/retries from env", () => {
  const out = buildClientRuntimeOptions({
    DEEPSEEK_TIMEOUT_MS: "9000",
    DEEPSEEK_RETRIES: "2"
  });
  assert.equal(out.deepseek.timeoutMs, 9000);
  assert.equal(out.deepseek.retries, 2);
});

test("buildClientRuntimeOptions leaves unset fields undefined", () => {
  const out = buildClientRuntimeOptions({});
  assert.equal(out.ollama.timeoutMs, undefined);
  assert.equal(out.ollama.retries, undefined);
  assert.equal(out.deepseek.timeoutMs, undefined);
  assert.equal(out.deepseek.retries, undefined);
});

test("buildClientRuntimeOptions throws on invalid env values", () => {
  assert.throws(
    () => buildClientRuntimeOptions({ OLLAMA_TIMEOUT_MS: "abc" }),
    /Invalid OLLAMA_TIMEOUT_MS/
  );
  assert.throws(
    () => buildClientRuntimeOptions({ DEEPSEEK_RETRIES: "-1" }),
    /Invalid DEEPSEEK_RETRIES/
  );
});
