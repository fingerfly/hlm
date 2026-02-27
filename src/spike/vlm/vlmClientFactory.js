/**
 * Purpose: Build provider-specific VLM clients from runtime settings.
 * Author: Luke WU
 */
import { createDeepSeekClient } from "./deepseekClient.js";
import { createOllamaClient } from "./ollamaClient.js";

export function createVlmClient({
  provider,
  deepseek = {},
  ollama = {},
  fetchImpl = fetch
}) {
  if (provider === "deepseek_text" || provider === "deepseek_vl2") {
    return createDeepSeekClient({
      apiKey: deepseek.apiKey,
      model: deepseek.model,
      provider,
      fetchImpl
    });
  }
  if (provider === "ollama_qwen3vl") {
    return createOllamaClient({
      baseUrl: ollama.baseUrl,
      model: ollama.model,
      provider,
      fetchImpl
    });
  }
  throw new Error(`Unknown VLM provider: ${provider}`);
}
