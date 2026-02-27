/**
 * Purpose: Verify loading runtime env from local config files.
 * Author: Luke WU
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  assertValidVlmProvider,
  loadRuntimeEnv,
  parseEnvText,
  validateRequiredConfig
} from "../../src/spike/vlm/runtimeConfig.js";

test("parseEnvText handles quotes and comments", () => {
  const parsed = parseEnvText(`
DEEPSEEK_API_KEY=abc123
VLM_PROVIDER="deepseek_vl2"
export DEEPSEEK_MODEL='deepseek-chat'
# comment
`);
  assert.equal(parsed.DEEPSEEK_API_KEY, "abc123");
  assert.equal(parsed.VLM_PROVIDER, "deepseek_vl2");
  assert.equal(parsed.DEEPSEEK_MODEL, "deepseek-chat");
});

test("loadRuntimeEnv applies .env values to missing keys", () => {
  const dir = mkdtempSync(join(tmpdir(), "hlm-runtime-env-"));
  try {
    writeFileSync(join(dir, ".env"), "DEEPSEEK_API_KEY=from_file\nVLM_PROVIDER=deepseek_vl2\n", "utf8");
    const env = {};
    loadRuntimeEnv({ cwd: dir, env });
    assert.equal(env.DEEPSEEK_API_KEY, "from_file");
    assert.equal(env.VLM_PROVIDER, "deepseek_vl2");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("loadRuntimeEnv keeps shell env and allows .env.local override", () => {
  const dir = mkdtempSync(join(tmpdir(), "hlm-runtime-env-"));
  try {
    writeFileSync(join(dir, ".env"), "VLM_PROVIDER=deepseek_text\nDEEPSEEK_MODEL=deepseek-chat\n", "utf8");
    writeFileSync(join(dir, ".env.local"), "VLM_PROVIDER=deepseek_vl2\n", "utf8");
    const env = { DEEPSEEK_MODEL: "from_shell" };
    loadRuntimeEnv({ cwd: dir, env });
    assert.equal(env.VLM_PROVIDER, "deepseek_vl2");
    assert.equal(env.DEEPSEEK_MODEL, "from_shell");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("validateRequiredConfig returns missing key messages", () => {
  const out = validateRequiredConfig({}, {
    requiredKeys: ["DEEPSEEK_API_KEY", "VLM_PROVIDER"]
  });
  assert.equal(out.ok, false);
  assert.match(out.message, /Missing DEEPSEEK_API_KEY/);
  assert.match(out.message, /Missing VLM_PROVIDER/);
});

test("validateRequiredConfig supports custom validator checks", () => {
  const out = validateRequiredConfig(
    { DEEPSEEK_API_KEY: "k", VLM_PROVIDER: "bad_provider" },
    {
      requiredKeys: ["DEEPSEEK_API_KEY"],
      validators: [
        {
          check: (env) => !env.VLM_PROVIDER || ["deepseek_text", "deepseek_vl2", "ollama_qwen3vl"].includes(env.VLM_PROVIDER),
          message: "Invalid VLM_PROVIDER. Allowed: deepseek_text | deepseek_vl2 | ollama_qwen3vl"
        }
      ]
    }
  );
  assert.equal(out.ok, false);
  assert.match(out.message, /Invalid VLM_PROVIDER/);
});

test("assertValidVlmProvider accepts known values and empty", () => {
  assert.equal(assertValidVlmProvider("deepseek_text"), true);
  assert.equal(assertValidVlmProvider("deepseek_vl2"), true);
  assert.equal(assertValidVlmProvider("ollama_qwen3vl"), true);
  assert.equal(assertValidVlmProvider(""), true);
  assert.equal(assertValidVlmProvider(undefined), true);
  assert.equal(assertValidVlmProvider("bad"), false);
});
