/**
 * Purpose: Validate runtime config and run sequential spike pipeline steps.
 * Author: Luke WU
 */
import { assertValidVlmProvider, validateRequiredConfig } from "./runtimeConfig.js";

export function validateRuntimeConfig(env) {
  const provider = String(env?.VLM_PROVIDER || "deepseek_text").trim();
  const requiredKeys = provider === "ollama_qwen3vl" ? [] : ["DEEPSEEK_API_KEY"];
  const out = validateRequiredConfig(env, {
    requiredKeys,
    validators: [
      {
        check: (it) => assertValidVlmProvider(it.VLM_PROVIDER),
        message: "Invalid VLM_PROVIDER. Allowed: deepseek_text | deepseek_vl2 | ollama_qwen3vl"
      }
    ]
  });
  if (!out.ok) {
    const message = out.problems[0] === "Missing DEEPSEEK_API_KEY"
      ? "Missing DEEPSEEK_API_KEY. Run: export DEEPSEEK_API_KEY=\"your_key\""
      : out.message;
    return { ok: false, message };
  }
  return { ok: true, message: "" };
}

export function runSequentialSteps(steps, runStep) {
  for (const step of steps) {
    const result = runStep(step);
    if (!result.ok) return { ok: false, failedStep: step, message: result.message || "step failed" };
  }
  return { ok: true, failedStep: null, message: "" };
}
