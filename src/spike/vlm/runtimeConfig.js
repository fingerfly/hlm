/**
 * Purpose: Load runtime env values from local .env files.
 * Author: Luke WU
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ALLOWED_VLM_PROVIDERS = new Set(["deepseek_text", "deepseek_vl2", "ollama_qwen3vl"]);

function stripOuterQuotes(value) {
  const text = String(value || "").trim();
  if ((text.startsWith("\"") && text.endsWith("\"")) || (text.startsWith("'") && text.endsWith("'"))) {
    return text.slice(1, -1);
  }
  return text;
}

export function parseEnvText(text) {
  const out = {};
  for (const rawLine of String(text || "").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const normalized = line.startsWith("export ") ? line.slice(7).trim() : line;
    const idx = normalized.indexOf("=");
    if (idx < 1) continue;
    const key = normalized.slice(0, idx).trim();
    const value = stripOuterQuotes(normalized.slice(idx + 1));
    if (!key) continue;
    out[key] = value;
  }
  return out;
}

export function loadRuntimeEnv({ cwd = process.cwd(), env = process.env } = {}) {
  const fileOrder = [".env", ".env.local"];
  const merged = {};
  for (const name of fileOrder) {
    const path = join(cwd, name);
    if (!existsSync(path)) continue;
    Object.assign(merged, parseEnvText(readFileSync(path, "utf8")));
  }
  for (const [key, value] of Object.entries(merged)) {
    if (env[key] == null || env[key] === "") env[key] = value;
  }
}

export function validateRequiredConfig(env, { requiredKeys = [], validators = [] } = {}) {
  const problems = [];
  for (const key of requiredKeys) {
    if (!String(env?.[key] || "").trim()) {
      problems.push(`Missing ${key}`);
    }
  }
  for (const rule of validators) {
    if (typeof rule?.check !== "function") continue;
    if (!rule.check(env)) problems.push(rule.message || "Invalid runtime config");
  }
  return {
    ok: problems.length === 0,
    message: problems.join(". "),
    problems
  };
}

export function assertValidVlmProvider(provider) {
  return !provider || ALLOWED_VLM_PROVIDERS.has(provider);
}
