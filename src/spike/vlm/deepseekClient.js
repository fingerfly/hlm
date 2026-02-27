/**
 * Purpose: Provide a minimal DeepSeek VLM client for spike experiments.
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

function extractTextContent(json) {
  const message = json?.choices?.[0]?.message;
  const content = message?.content;
  if (typeof content === "string" && content.trim()) return content;
  if (Array.isArray(content)) {
    const text = content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("\n")
      .trim();
    if (text) return text;
  }
  if (typeof message?.reasoning_content === "string" && message.reasoning_content.trim()) {
    return message.reasoning_content;
  }
  if (typeof json?.output_text === "string" && json.output_text.trim()) return json.output_text;
  return "";
}

function providerPreview(json, provider) {
  return JSON.stringify({
    id: json?.id,
    provider_mode: provider,
    model: json?.model,
    finish_reason: json?.choices?.[0]?.finish_reason,
    message_role: json?.choices?.[0]?.message?.role,
    message_content_type: Array.isArray(json?.choices?.[0]?.message?.content)
      ? "array"
      : typeof json?.choices?.[0]?.message?.content,
    error: json?.error
  });
}

function buildHttpProviderError(status, bodyText) {
  return Object.assign(new Error(`provider http ${status}`), {
    code: "PROVIDER_HTTP_ERROR",
    status,
    providerBodyPreview: String(bodyText || "").slice(0, 300)
  });
}

export function createDeepSeekClient({
  apiKey,
  baseUrl = "https://api.deepseek.com",
  provider = "deepseek_text",
  model = "deepseek-chat",
  timeoutMs = 15000,
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
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            signal,
            body: JSON.stringify(req.body)
          });
          if (!response.ok) {
            let bodyText = "";
            try {
              bodyText = await response.text();
            } catch {
              bodyText = "";
            }
            throw buildHttpProviderError(response.status, bodyText);
          }
          const json = await response.json();
          const text = extractTextContent(json);
          return text || providerPreview(json, provider);
        } catch (error) {
          if (attempt === retries) throw normalizeNetworkError(error);
        } finally {
          done();
        }
      }
      return "";
    }
  };
}
