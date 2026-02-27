/**
 * Purpose: Run a standalone VLM spike from local image path.
 * Author: Luke WU
 */
import { randomUUID } from "node:crypto";
import { toDataUrl, convertHeicToJpegIfNeeded } from "../src/spike/vlm/imageInput.js";
import { parsePreprocessConfig, preprocessImageForSpike } from "../src/spike/vlm/preprocessImage.js";
import { assertOllamaReady } from "../src/spike/vlm/providerHealth.js";
import { recognizeWithDeepSeek } from "../src/spike/vlm/recognizeImage.js";
import { loadRuntimeEnv } from "../src/spike/vlm/runtimeConfig.js";
import { validateRuntimeConfig } from "../src/spike/vlm/orchestrator.js";
import { createVlmClient } from "../src/spike/vlm/vlmClientFactory.js";

async function main() {
  loadRuntimeEnv();
  const imagePath = process.argv[2];
  if (!imagePath) {
    console.error("Usage: npm run spike:vlm -- /absolute/path/to/image.jpg");
    process.exit(1);
  }
  const provider = process.env.VLM_PROVIDER || "deepseek_text";
  const config = validateRuntimeConfig({ ...process.env, VLM_PROVIDER: provider });
  if (!config.ok) {
    console.error(config.message);
    process.exit(1);
  }
  const health = assertOllamaReady({ provider });
  if (!health.ok) {
    console.error(health.message);
    process.exit(1);
  }
  const votePassesRaw = process.env.VLM_VOTE_PASSES || "1";
  const votePasses = Number.parseInt(votePassesRaw, 10);
  if (!Number.isInteger(votePasses) || votePasses < 1 || votePasses > 5) {
    console.error("Invalid VLM_VOTE_PASSES. Allowed integer range: 1..5");
    process.exit(1);
  }
  const preprocessConfig = parsePreprocessConfig(process.env);
  const client = createVlmClient({
    provider,
    deepseek: { apiKey: process.env.DEEPSEEK_API_KEY, model: process.env.DEEPSEEK_MODEL || "deepseek-chat" },
    ollama: { baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434", model: process.env.OLLAMA_MODEL || "qwen3-vl:4b" }
  });
  const converted = convertHeicToJpegIfNeeded(imagePath);
  let preprocessed = { path: converted.path, cleanup: null };
  let result;
  try {
    preprocessed = await preprocessImageForSpike({ imagePath: converted.path, config: preprocessConfig });
    result = await recognizeWithDeepSeek({
      imageDataUrl: toDataUrl(preprocessed.path),
      consentGranted: true,
      requestId: randomUUID(),
      client,
      votePasses
    });
  } finally {
    if (preprocessed.cleanup) preprocessed.cleanup();
    if (converted.cleanup) converted.cleanup();
  }
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok && result.rawTextPreview) {
    console.error(`raw_text_preview: ${result.rawTextPreview}`);
  }
  if (!result.ok && result.providerHttpStatus === 404 && /not found/i.test(result.providerBodyPreview || "")) {
    console.error("Model not found. Run: ollama pull qwen3-vl:4b");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
