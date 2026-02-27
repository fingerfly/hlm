/**
 * Purpose: Build provider-specific request payloads for DeepSeek spike.
 * Author: Luke WU
 */
import { buildSpikePrompt } from "./prompt.js";

const PROVIDERS = new Set(["deepseek_text", "deepseek_vl2", "ollama_qwen3vl"]);

/**
 * Validate provider key.
 * @param {string} provider
 */
export function assertProvider(provider) {
  if (!PROVIDERS.has(provider)) {
    throw new Error("VLM_PROVIDER must be deepseek_text, deepseek_vl2, or ollama_qwen3vl");
  }
}

/**
 * Build request body and endpoint path for selected provider mode.
 * @param {{provider:string,model:string,imageDataUrl:string}} input
 * @returns {{urlPath:string, body:object}}
 */
export function buildProviderRequest(input) {
  assertProvider(input.provider);
  if (input.provider === "deepseek_vl2") return buildDeepSeekVl2Request(input);
  if (input.provider === "ollama_qwen3vl") return buildOllamaRequest(input);
  return buildDeepSeekTextRequest(input);
}

function buildDeepSeekTextRequest(input) {
  return {
    urlPath: "/chat/completions",
    body: {
      model: input.model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: buildSpikePrompt() },
            { type: "image_url", image_url: { url: input.imageDataUrl } }
          ]
        }
      ]
    }
  };
}

function buildDeepSeekVl2Request(input) {
  return {
    urlPath: "/chat/completions",
    body: {
      model: input.model,
      messages: [{ role: "user", content: buildSpikePrompt() }],
      images: [{ image_url: input.imageDataUrl }]
    }
  };
}

function buildOllamaRequest(input) {
  return {
    urlPath: "/api/chat",
    body: {
      model: input.model,
      messages: [{ role: "user", content: buildSpikePrompt(), images: [extractBase64Payload(input.imageDataUrl)] }],
      stream: false
    }
  };
}

function extractBase64Payload(dataUrl) {
  const text = String(dataUrl || "");
  const marker = ";base64,";
  const idx = text.indexOf(marker);
  return idx >= 0 ? text.slice(idx + marker.length) : text;
}
