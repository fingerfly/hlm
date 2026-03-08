/**
 * Purpose: Validate local provider readiness before inference.
 * Author: Luke WU
 */
import { spawnSync } from "node:child_process";

export function assertOllamaReady({ provider, runCommand = defaultRunCommand }) {
  if (provider !== "ollama_qwen3vl") return { ok: true, message: "" };
  const run = runCommand();
  if (run.status === 0) return { ok: true, message: "" };
  return {
    ok: false,
    message: "Ollama is not reachable. Check with `ollama ps`, start with `ollama service`, then retry."
  };
}

function defaultRunCommand() {
  return spawnSync("ollama", ["ps"], { encoding: "utf8" });
}
