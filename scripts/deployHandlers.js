import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { assertDeployMode } from "../src/config/versioning.js";
import {
  DEPLOY_USAGE,
  RELEASE_PROMPT_TEMPLATE,
  UPDATE_PROMPT_TEMPLATE
} from "../src/config/deployPrompts.js";
import {
  appendPromptUpdateEntry,
  archiveUnreleasedToRelease,
  getTodayIsoDate,
  normalizeReleaseToken,
  parseAppVersionState,
  selectReleaseModeArg
} from "../src/config/deployWorkflow.js";
import {
  printAgentCommand,
  promptReleaseMode,
  runCursorAgentOrExit
} from "./deployRuntime.js";

export function handlePromptMode(mode, shouldRunAgent, rootDir) {
  if (!mode || !mode.startsWith("prompt-")) {
    return false;
  }
  writePromptChangelog(mode, rootDir);
  if (mode === "prompt-update") {
    console.log(UPDATE_PROMPT_TEMPLATE);
    return true;
  }
  if (mode === "prompt-release") {
    console.log(RELEASE_PROMPT_TEMPLATE);
    return true;
  }
  if (mode === "prompt-all") {
    console.log([
      "=== prompt-update ===",
      UPDATE_PROMPT_TEMPLATE,
      "",
      "=== prompt-release ===",
      RELEASE_PROMPT_TEMPLATE
    ].join("\n"));
    return true;
  }
  if (mode === "prompt-update-agent") {
    shouldRunAgent
      ? runCursorAgentOrExit(rootDir, UPDATE_PROMPT_TEMPLATE)
      : printAgentCommand(UPDATE_PROMPT_TEMPLATE);
    return true;
  }
  if (mode === "prompt-release-agent") {
    shouldRunAgent
      ? runCursorAgentOrExit(rootDir, RELEASE_PROMPT_TEMPLATE)
      : printAgentCommand(RELEASE_PROMPT_TEMPLATE);
    return true;
  }
  return false;
}

function writePromptChangelog(mode, rootDir) {
  const changelogPath = join(rootDir, "CHANGELOG.md");
  if (mode === "prompt-update" || mode === "prompt-update-agent") {
    const source = readFileSync(changelogPath, "utf8");
    const updated = appendPromptUpdateEntry(source, getTodayIsoDate());
    writeFileSync(changelogPath, updated, "utf8");
    return;
  }
  const appVersionPath = join(rootDir, "src/config/appVersion.js");
  if (mode === "prompt-release" || mode === "prompt-release-agent") {
    const appVersionSource = readFileSync(appVersionPath, "utf8");
    const current = parseAppVersionState(appVersionSource);
    const source = readFileSync(changelogPath, "utf8");
    const updated = archiveUnreleasedToRelease(
      source,
      current.appVersion,
      getTodayIsoDate()
    );
    writeFileSync(changelogPath, updated, "utf8");
    return;
  }
  if (mode === "prompt-all") {
    const source = readFileSync(changelogPath, "utf8");
    const updated = appendPromptUpdateEntry(source, getTodayIsoDate());
    const appVersionSource = readFileSync(appVersionPath, "utf8");
    const current = parseAppVersionState(appVersionSource);
    const released = archiveUnreleasedToRelease(
      updated,
      current.appVersion,
      getTodayIsoDate()
    );
    writeFileSync(changelogPath, released, "utf8");
  }
}

export async function resolveDeployMode(mode, extraArgs, shouldConfirm) {
  if (mode !== "release") {
    return { mode, shouldConfirm };
  }
  const modeArg = selectReleaseModeArg(extraArgs);
  if (modeArg) {
    return { mode: modeArg, shouldConfirm };
  }
  const interactive = await promptReleaseMode(normalizeReleaseToken);
  return {
    mode: interactive.selectedMode,
    shouldConfirm: interactive.confirmed || shouldConfirm
  };
}

export function assertModeOrExit(mode) {
  try {
    assertDeployMode(mode);
  } catch (error) {
    console.error(`${DEPLOY_USAGE}\n${error.message}`);
    process.exit(1);
  }
}

export function writeReleaseState(mode, next, packageJsonPath, changelogPath) {
  if (mode === "build") {
    return;
  }
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  pkg.version = next.appVersion;
  writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  const changelog = readFileSync(changelogPath, "utf8");
  const updated = archiveUnreleasedToRelease(
    changelog,
    next.appVersion,
    getTodayIsoDate()
  );
  writeFileSync(changelogPath, updated, "utf8");
}
