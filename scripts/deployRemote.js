import { spawnSync } from "node:child_process";
import { join } from "node:path";

const DEFAULT_REMOTE = "git@github.com:fingerfly/hlm.git";
const WINDOWS_DEFAULT_REMOTE = "https://github.com/fingerfly/hlm.git";
const EXPECTED_REPO = "fingerfly/hlm";
const DEPLOY_DIR_NAME = "hlm-deploy";

/**
 * Purpose: Provide remote/path helpers for deploy runtime.
 * Description:
 * - Resolves platform-aware deploy remote with env override.
 * - Normalizes GitHub remote URLs for same-repo comparison.
 * - Performs preflight remote access checks and deploy-dir resolution.
 */

export function getDefaultDeployRemoteForPlatform(
  platform = process.platform
) {
  if (platform === "win32") {
    return WINDOWS_DEFAULT_REMOTE;
  }
  return DEFAULT_REMOTE;
}

export function resolveDeployRemote(
  platform = process.platform,
  env = process.env
) {
  const override = String(env.HLM_DEPLOY_REMOTE ?? "").trim();
  if (override) {
    return override;
  }
  return getDefaultDeployRemoteForPlatform(platform);
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

export function isExpectedDeployRepo(remoteUrl) {
  return normalizeRemoteRepo(remoteUrl) === EXPECTED_REPO;
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
      `Tip: set HLM_DEPLOY_REMOTE to SSH or HTTPS remote for this shell. ` +
      `${detail}`
    );
  }
}

export function resolveDeployDir(env = process.env) {
  const tmpRoot = env.TMPDIR || env.TEMP || env.TMP || "/tmp";
  return join(tmpRoot, DEPLOY_DIR_NAME);
}
