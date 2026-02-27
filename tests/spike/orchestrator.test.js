/**
 * Purpose: Verify auto orchestrator validation and step-chain behavior.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { runSequentialSteps, validateRuntimeConfig } from "../../src/spike/vlm/orchestrator.js";

test("validateRuntimeConfig rejects missing api key", () => {
  const res = validateRuntimeConfig({ VLM_PROVIDER: "deepseek_vl2" });
  assert.equal(res.ok, false);
  assert.match(res.message, /DEEPSEEK_API_KEY/);
});

test("validateRuntimeConfig accepts ollama provider without deepseek api key", () => {
  const res = validateRuntimeConfig({ VLM_PROVIDER: "ollama_qwen3vl" });
  assert.equal(res.ok, true);
});

test("runSequentialSteps executes all on success", () => {
  const calls = [];
  const steps = [["a"], ["b"], ["c"]];
  const out = runSequentialSteps(steps, (step) => {
    calls.push(step[0]);
    return { ok: true, message: "" };
  });
  assert.equal(out.ok, true);
  assert.deepEqual(calls, ["a", "b", "c"]);
});

test("runSequentialSteps stops on first failure", () => {
  const calls = [];
  const steps = [["a"], ["b"], ["c"]];
  const out = runSequentialSteps(steps, (step) => {
    calls.push(step[0]);
    return step[0] === "b" ? { ok: false, message: "boom" } : { ok: true, message: "" };
  });
  assert.equal(out.ok, false);
  assert.deepEqual(out.failedStep, ["b"]);
  assert.deepEqual(calls, ["a", "b"]);
});
