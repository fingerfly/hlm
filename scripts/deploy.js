import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  formatDeploySummary,
  nextVersionState
} from "../src/config/versioning.js";
import {
  parseAppVersionState,
  updateAppVersionSource
} from "../src/config/deployWorkflow.js";
import {
  runProjectTestsOrExit
} from "./deployRuntime.js";
import {
  assertModeOrExit,
  handlePromptMode,
  resolveDeployMode,
  writeReleaseState
} from "./deployHandlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

async function main() {
  const inputMode = process.argv[2];
  const extraArgs = process.argv.slice(3);
  const flags = new Set(extraArgs.filter((arg) => arg.startsWith("--")));
  if (handlePromptMode(inputMode, flags.has("--run-agent"), rootDir)) {
    return;
  }

  const resolved = await resolveDeployMode(
    inputMode,
    extraArgs,
    flags.has("--confirm")
  );
  assertModeOrExit(resolved.mode);
  runProjectTestsOrExit(rootDir);
  if (!resolved.shouldConfirm) {
    console.error("Missing required flag: --confirm");
    process.exit(1);
  }

  const packageJsonPath = join(rootDir, "package.json");
  const appVersionPath = join(rootDir, "src/config/appVersion.js");
  const changelogPath = join(rootDir, "CHANGELOG.md");
  const appVersionSource = readFileSync(appVersionPath, "utf8");
  const current = parseAppVersionState(appVersionSource);
  const next = nextVersionState(current, resolved.mode);
  const updatedSource = updateAppVersionSource(appVersionSource, next);
  writeFileSync(appVersionPath, updatedSource, "utf8");
  writeReleaseState(resolved.mode, next, packageJsonPath, changelogPath);
  console.log(
    formatDeploySummary({ mode: resolved.mode, previous: current, next })
  );
}

await main();
