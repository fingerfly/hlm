import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync
} from "node:fs";
import { join, sep } from "node:path";
import {
  isExpectedDeployRepo,
  normalizeRemoteRepo,
  resolveDeployDir,
  shouldSyncOriginRemote
} from "./deployRemote.js";

const DEFAULT_DEPLOY_GIT_NAME = "hlm-release";
const DEFAULT_DEPLOY_GIT_EMAIL =
  "10357401+fingerfly@users.noreply.github.com";
const EXCLUDE = new Set([
  ".git",
  "node_modules",
  "playwright-report",
  "test-results"
]);

function shouldExclude(name, parentPath = "") {
  if (EXCLUDE.has(name)) {
    return true;
  }
  if (name.startsWith(".env")) {
    return true;
  }
  if (/\.(pem|key)$/i.test(name)) {
    return true;
  }
  return (
    parentPath.includes(`tests${sep}fixtures`) && /\.jpg$/i.test(name)
  );
}

function syncTree(sourceDir, targetDir) {
  const entries = readdirSync(sourceDir, { withFileTypes: true });
  mkdirSync(targetDir, { recursive: true });
  const copied = new Set();
  for (const entry of entries) {
    if (shouldExclude(entry.name, sourceDir)) {
      continue;
    }
    copied.add(entry.name);
    const sourcePath = join(sourceDir, entry.name);
    const targetPath = join(targetDir, entry.name);
    if (entry.isDirectory()) {
      syncTree(sourcePath, targetPath);
      continue;
    }
    copyFileSync(sourcePath, targetPath);
  }
  const existing = readdirSync(targetDir, { withFileTypes: true });
  for (const entry of existing) {
    if (shouldExclude(entry.name, targetDir)) {
      continue;
    }
    if (copied.has(entry.name)) {
      continue;
    }
    rmSync(join(targetDir, entry.name), { recursive: true, force: true });
  }
}

function runGitOrThrow(args, options = {}) {
  const result = spawnSync("git", args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: options.env
  });
  if (result.status === 0) {
    return String(result.stdout || "").trim();
  }
  const detail = String(result.stderr || result.stdout || "").trim();
  throw new Error(`git ${args.join(" ")} failed: ${detail}`);
}

function resolveDeployIdentity(env = process.env) {
  return {
    name: env.HLM_DEPLOY_GIT_NAME || DEFAULT_DEPLOY_GIT_NAME,
    email: env.HLM_DEPLOY_GIT_EMAIL || DEFAULT_DEPLOY_GIT_EMAIL
  };
}

function ensureDeployCheckout(deployDir, remoteUrl, platform, env) {
  let shouldClone = true;
  if (existsSync(join(deployDir, ".git"))) {
    try {
      const actualRemote = runGitOrThrow(
        ["remote", "get-url", "origin"],
        { cwd: deployDir, platform, env }
      );
      if (isExpectedDeployRepo(actualRemote)) {
        shouldClone = false;
        if (shouldSyncOriginRemote(actualRemote, remoteUrl)) {
          runGitOrThrow(["remote", "set-url", "origin", remoteUrl], {
            cwd: deployDir,
            platform,
            env
          });
        }
        runGitOrThrow(["pull", "--ff-only", "origin", "main"], {
          cwd: deployDir,
          platform,
          env
        });
      }
    } catch {
      shouldClone = true;
    }
  }
  if (shouldClone) {
    rmSync(deployDir, { recursive: true, force: true });
    runGitOrThrow(["clone", remoteUrl, deployDir], { platform, env });
  }
  runGitOrThrow(["checkout", "-B", "main"], {
    cwd: deployDir,
    platform,
    env
  });
}

function commitAndPushDeploy(deployDir, releaseLabel, platform, env) {
  const identity = resolveDeployIdentity(env);
  const author = `${identity.name} <${identity.email}>`;
  runGitOrThrow(
    ["commit", "--author", author, "-m", `Release ${releaseLabel}`],
    {
      cwd: deployDir,
      platform,
      env: {
        ...env,
        GIT_COMMITTER_NAME: identity.name,
        GIT_COMMITTER_EMAIL: identity.email
      }
    }
  );
  const actualRemote = runGitOrThrow(["remote", "get-url", "origin"], {
    cwd: deployDir,
    platform,
    env
  });
  const normalizedRemote = normalizeRemoteRepo(actualRemote);
  if (normalizedRemote && !isExpectedDeployRepo(actualRemote)) {
    throw new Error(
      `Safety check failed: deploy repo remote is ` +
      `"${actualRemote}", expected "fingerfly/hlm".`
    );
  }
  runGitOrThrow(["push", "origin", "HEAD:main"], {
    cwd: deployDir,
    platform,
    env
  });
}

export function pushReleaseToRemote(options) {
  const sourceDir = options.sourceDir;
  const remoteUrl = options.remoteUrl;
  const releaseLabel = options.releaseLabel;
  const platform = options.platform || process.platform;
  const env = options.env || process.env;
  const deployDir = resolveDeployDir(env);
  ensureDeployCheckout(deployDir, remoteUrl, platform, env);
  syncTree(sourceDir, deployDir);
  runGitOrThrow(["add", "-A"], { cwd: deployDir, platform, env });
  const diff = runGitOrThrow(["diff", "--cached", "--stat"], {
    cwd: deployDir,
    platform,
    env
  });
  if (!diff) {
    console.log("No changes to deploy. Everything is up to date.");
    return false;
  }
  commitAndPushDeploy(deployDir, releaseLabel, platform, env);
  return true;
}
