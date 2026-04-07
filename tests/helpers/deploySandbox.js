import {
  execFileSync
} from "node:child_process";
import {
  copyFileSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const rootDir = join(__dirname, "..", "..");
export const deployScriptPath = join(rootDir, "scripts", "deploy.js");
export const today = new Date().toISOString().slice(0, 10);

export function getSandboxDeployRemote(sandboxRoot) {
  return join(sandboxRoot, "remote.git");
}

/**
 * Process.env for sandbox deploy.js spawns; clears inherited HLM_DEPLOY_DIR.
 */
export function getSandboxChildEnv(sandboxRoot, extra = {}) {
  return {
    ...process.env,
    TMPDIR: sandboxRoot,
    HLM_DEPLOY_REMOTE: getSandboxDeployRemote(sandboxRoot),
    HLM_DEPLOY_DIR: "",
    ...extra
  };
}

export function prepareDeploySandbox() {
  const sandboxRoot = mkdtempSync(join(tmpdir(), "hlm-deploy-test-"));
  [
    join(sandboxRoot, "scripts"),
    join(sandboxRoot, "src", "config"),
    join(sandboxRoot, "tests", "unit")
  ].forEach((dirPath) => mkdirSync(dirPath, { recursive: true }));
  [
    ["scripts/deploy.js", "scripts/deploy.js"],
    ["scripts/deployHandlers.js", "scripts/deployHandlers.js"],
    ["scripts/deployPublish.js", "scripts/deployPublish.js"],
    ["scripts/deployRemote.js", "scripts/deployRemote.js"],
    ["scripts/deployRuntime.js", "scripts/deployRuntime.js"],
    ["src/config/deployPrompts.js", "src/config/deployPrompts.js"],
    ["src/config/deployWorkflow.js", "src/config/deployWorkflow.js"],
    ["src/config/versioning.js", "src/config/versioning.js"]
  ].forEach(([from, to]) =>
    copyFileSync(join(rootDir, from), join(sandboxRoot, to))
  );
  writeFileSync(
    join(sandboxRoot, "src", "config", "appVersion.js"),
    'export const APP_VERSION = "0.4.0";\nexport const APP_BUILD = 7;\n',
    "utf8"
  );
  writeFileSync(
    join(sandboxRoot, "package.json"),
    `${JSON.stringify(
      {
        name: "tmp-hlm",
        version: "0.4.0",
        type: "module",
        scripts: { test: "node --test tests/unit/**/*.test.js" }
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    join(sandboxRoot, "tests", "unit", "smoke.test.js"),
    [
      'import test from "node:test";',
      'import assert from "node:assert/strict";',
      "",
      'test("sandbox smoke", () => {',
      "  assert.equal(1, 1);",
      "});",
      ""
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    join(sandboxRoot, "CHANGELOG.md"),
    [
      "# Changelog",
      "",
      "## [Unreleased] - 2026-03-09",
      "",
      "### Changed",
      "- Temporary unreleased entry for deploy test.",
      "",
      "## [0.4.0] - 2026-03-09",
      "",
      "### Added",
      "- Previous release baseline."
    ].join("\n"),
    "utf8"
  );
  execFileSync("git", ["init", "--bare", getSandboxDeployRemote(sandboxRoot)], {
    stdio: "pipe"
  });
  return sandboxRoot;
}
