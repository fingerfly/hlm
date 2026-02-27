/**
 * Purpose: Provide a minimal Ollama VLM client for local spike experiments.
 * Author: Luke WU
 */
import { buildProviderRequest } from "./requestBuilders.js";

function withTimeoutSignal(timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, done: () => clearTimeout(timer) };
}

function normalizeNetworkError(error) {
  if (error?.name === "AbortError") return Object.assign(new Error("request timeout"), { code: "TIMEOUT" });
  if (error?.code === "PROVIDER_HTTP_ERROR") return error;
  return Object.assign(new Error("network error"), { code: "NETWORK_ERROR" });
}

function buildHttpProviderError(status, bodyText) {
  return Object.assign(new Error(`provider http ${status}`), {
    code: "PROVIDER_HTTP_ERROR",
    status,
    providerBodyPreview: String(bodyText || "").slice(0, 300)
  });
}

function extractTextContent(json) {
  const candidates = [json?.message?.content, json?.response, json?.content, json?.text];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

export function createOllamaClient({
  baseUrl = "http://localhost:11434",
  provider = "ollama_qwen3vl",
  model = "qwen3-vl:4b",
  timeoutMs = 30000,
  retries = 1,
  fetchImpl = fetch
}) {
  return {
    async inferFromImage({ imageDataUrl }) {
      for (let attempt = 0; attempt <= retries; attempt += 1) {
        const { signal, done } = withTimeoutSignal(timeoutMs);
        try {
          const req = buildProviderRequest({ provider, model, imageDataUrl });
          const response = await fetchImpl(`${baseUrl}${req.urlPath}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal,
            body: JSON.stringify(req.body)
          });
          if (!response.ok) throw buildHttpProviderError(response.status, await response.text());
          const text = extractTextContent(await response.json());
          return text || "{}";
        } catch (error) {
          if (attempt === retries) throw normalizeNetworkError(error);
        } finally {
          done();
        }
      }
      return "{}";
    }
  };
}
