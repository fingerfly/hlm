/**
 * Purpose: Parse runtime timeout/retry knobs for provider clients.
 * Author: Luke WU
 */
function parseNonNegativeInt(env, key) {
  const raw = env[key];
  if (raw == null || String(raw).trim() === "") return undefined;
  const n = Number.parseInt(String(raw), 10);
  if (!Number.isInteger(n) || n < 0) {
    throw new Error(`Invalid ${key}. Expected non-negative integer.`);
  }
  return n;
}

export function buildClientRuntimeOptions(env = process.env) {
  return {
    ollama: {
      timeoutMs: parseNonNegativeInt(env, "OLLAMA_TIMEOUT_MS"),
      retries: parseNonNegativeInt(env, "OLLAMA_RETRIES")
    },
    deepseek: {
      timeoutMs: parseNonNegativeInt(env, "DEEPSEEK_TIMEOUT_MS"),
      retries: parseNonNegativeInt(env, "DEEPSEEK_RETRIES")
    }
  };
}
