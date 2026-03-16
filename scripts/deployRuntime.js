import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import {
  getDefaultDeployRemoteForPlatform,
  isExpectedDeployRepo,
  normalizeRemoteRepo,
  preflightRemoteAccess,
  resolveDeployDir,
  resolveExpectedDeployRepo,
  resolveDeployRemote,
  shouldSyncOriginRemote
} from "./deployRemote.js";
import { pushReleaseToRemote } from "./deployPublish.js";

export {
  getDefaultDeployRemoteForPlatform,
  isExpectedDeployRepo,
  normalizeRemoteRepo,
  preflightRemoteAccess,
  pushReleaseToRemote,
  resolveDeployDir,
  resolveExpectedDeployRepo,
  resolveDeployRemote,
  shouldSyncOriginRemote
};

export function runProjectTestsOrExit(rootDir) {
  const result = spawnSync("npm", ["test"], {
    cwd: rootDir,
    stdio: "inherit",
    shell: process.platform === "win32"
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

export function printAgentCommand(template) {
  console.log(`cursor agent --print --mode ask ${JSON.stringify(template)}`);
}

export function runCursorAgentOrExit(rootDir, template) {
  const result = spawnSync(
    "cursor",
    ["agent", "--print", "--mode", "ask", template],
    { cwd: rootDir, stdio: "inherit" }
  );
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

export async function promptReleaseMode(normalizeReleaseToken) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  try {
    const selected = (
      await rl.question("请选择发布类型 1=build 2=patch 3=minor 4=major: ")
    ).trim();
    const normalized = normalizeReleaseToken(selected);
    const confirm = (
      await rl.question(`确认执行 release:${normalized} ? 输入 yes 继续: `)
    ).trim();
    return {
      selectedMode: normalized,
      confirmed: confirm.toLowerCase() === "yes"
    };
  } finally {
    rl.close();
  }
}
