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
  printDeployTransportWarning,
  preflightRemoteAccess,
  pushReleaseToRemote,
  resolveOriginRemote,
  resolveDeployRemote,
  runDeployDoctorOrExit,
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
  const rawArgs = process.argv.slice(2);
  const inputMode = rawArgs[0];
  const extraArgs = rawArgs.slice(1);
  const flags = new Set(rawArgs.filter((arg) => arg.startsWith("--")));
  const isDryRun = flags.has("--dry-run");
  if (handlePromptMode(inputMode, flags.has("--run-agent"), rootDir)) {
    return;
  }
  if (inputMode === "doctor") {
    runDeployDoctorOrExit(rootDir);
    return;
  }

  const resolved = await resolveDeployMode(
    inputMode,
    extraArgs,
    flags.has("--confirm")
  );
  assertModeOrExit(resolved.mode);
  const deployRemote = resolveDeployRemote();
  const originRemote = resolveOriginRemote();
  printDeployTransportWarning(originRemote, deployRemote);
  preflightRemoteAccess(deployRemote);
  if (!flags.has("--skip-tests")) {
    runProjectTestsOrExit(rootDir);
  }
  if (!resolved.shouldConfirm && !isDryRun) {
    console.error("Missing required flag: --confirm");
    process.exit(1);
  }

  const packageJsonPath = join(rootDir, "package.json");
  const appVersionPath = join(rootDir, "src/config/appVersion.js");
  const changelogPath = join(rootDir, "CHANGELOG.md");
  const appVersionSource = readFileSync(appVersionPath, "utf8");
  const current = parseAppVersionState(appVersionSource);
  const next = nextVersionState(current, resolved.mode);
  const summary = formatDeploySummary({ mode: resolved.mode, previous: current, next });
  if (isDryRun) {
    console.log(summary);
    console.log("Dry run: no files changed and no remote push performed.");
    return;
  }
  const updatedSource = updateAppVersionSource(appVersionSource, next);
  writeFileSync(appVersionPath, updatedSource, "utf8");
  writeReleaseState(resolved.mode, next, packageJsonPath, changelogPath);
  pushReleaseToRemote({
    sourceDir: rootDir,
    remoteUrl: deployRemote,
    releaseLabel: `v${next.appVersion} (${next.appBuild})`
  });
  console.log(summary);
}

await main();
