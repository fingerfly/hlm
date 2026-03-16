import { spawnSync } from "node:child_process";
import { join } from "node:path";

const DEFAULT_EXPECTED_REPO = "owner/repo";
const DEPLOY_DIR_NAME = "hlm-deploy";

/**
 * Purpose: Provide remote/path helpers for deploy runtime.
 * Description:
 * - Resolves platform-aware deploy remote with env override.
 * - Normalizes GitHub remote URLs for same-repo comparison.
 * - Performs preflight remote access checks and deploy-dir resolution.
 */

export function getDefaultDeployRemoteForPlatform(
  platform = process.platform,
  env = process.env,
  runSync = spawnSync,
  cwd = process.cwd()
) {
  const expectedRepo = resolveExpectedDeployRepo(env, runSync, cwd);
  if (platform === "win32") {
    return `https://github.com/${expectedRepo}.git`;
  }
  return `git@github.com:${expectedRepo}.git`;
}

function detectRepoFromOriginRemote(
  runSync = spawnSync,
  cwd = process.cwd()
) {
  const result = runSync(
    "git",
    ["config", "--get", "remote.origin.url"],
    { cwd, encoding: "utf8", shell: process.platform === "win32" }
  );
  if (result.status !== 0) {
    return null;
  }
  const remoteText = String(result.stdout || "").trim();
  return normalizeRemoteRepo(remoteText);
}

export function resolveExpectedDeployRepo(
  env = process.env,
  runSync = spawnSync,
  cwd = process.cwd()
) {
  const override = String(env.HLM_DEPLOY_REPO ?? "").trim().toLowerCase();
  if (override) {
    const text = override.replace(/^github\.com[:/]/i, "");
    const normalized = text.replace(/\/+$/, "").replace(/\.git$/i, "");
    const matched = normalized.match(/^[a-z0-9._-]+\/[a-z0-9._-]+$/i);
    if (matched) {
      return normalized;
    }
  }
  const detected = detectRepoFromOriginRemote(runSync, cwd);
  if (detected) {
    const packageName = String(env.npm_package_name ?? "")
      .trim()
      .toLowerCase();
    if (packageName && detected.includes("/")) {
      const owner = detected.split("/")[0];
      const candidate = `${owner}/${packageName}`;
      return candidate;
    }
    return detected;
  }
  return DEFAULT_EXPECTED_REPO;
}

export function resolveDeployRemote(
  platform = process.platform,
  env = process.env,
  runSync = spawnSync,
  cwd = process.cwd()
) {
  const override = String(env.HLM_DEPLOY_REMOTE ?? "").trim();
  if (override) {
    return override;
  }
  return getDefaultDeployRemoteForPlatform(platform, env, runSync, cwd);
}

export function normalizeRemoteRepo(remoteUrl) {
  const text = String(remoteUrl ?? "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\.git$/i, "");
  const matched = text.match(/github\.com[:/]([^/]+)\/([^/]+)$/i);
  if (!matched) {
    return null;
  }
  return `${matched[1]}/${matched[2]}`.toLowerCase();
}

export function isExpectedDeployRepo(
  remoteUrl,
  expectedRepo = DEFAULT_EXPECTED_REPO
) {
  return (
    normalizeRemoteRepo(remoteUrl) === String(expectedRepo).toLowerCase()
  );
}

export function shouldSyncOriginRemote(actualRemote, desiredRemote) {
  const actual = String(actualRemote ?? "").trim();
  const desired = String(desiredRemote ?? "").trim();
  if (!actual || !desired) {
    return false;
  }
  if (actual === desired) {
    return false;
  }
  return normalizeRemoteRepo(actual) === normalizeRemoteRepo(desired);
}

export function preflightRemoteAccess(
  remoteUrl,
  platform = process.platform,
  runSync = spawnSync
) {
  const result = runSync("git", ["ls-remote", remoteUrl, "HEAD"], {
    encoding: "utf8",
    shell: platform === "win32"
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim();
    throw new Error(
      `Deploy preflight failed: cannot access remote "${remoteUrl}". ` +
      `Tip: set HLM_DEPLOY_REMOTE or HLM_DEPLOY_REPO in this shell. ` +
      `${detail}`
    );
  }
}

export function resolveDeployDir(env = process.env) {
  const tmpRoot = env.TMPDIR || env.TEMP || env.TMP || "/tmp";
  return join(tmpRoot, DEPLOY_DIR_NAME);
}
