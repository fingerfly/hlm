import test from "node:test";
import assert from "node:assert/strict";
import { sep } from "node:path";
import {
  detectRemoteTransport,
  getDeployTransportMismatchWarning,
  getDefaultDeployRemoteForPlatform,
  isExpectedDeployRepo,
  normalizeRemoteRepo,
  preflightRemoteAccess,
  resolveExpectedDeployRepo,
  resolveDeployDir,
  resolveDeployRemote,
  shouldSyncOriginRemote
} from "../../scripts/deployRuntime.js";

test("resolveDeployRemote prefers HLM_DEPLOY_REMOTE override", () => {
  const env = { HLM_DEPLOY_REMOTE: "https://github.com/my-org/my-app.git" };
  assert.equal(
    resolveDeployRemote("darwin", env),
    "https://github.com/my-org/my-app.git"
  );
});

test("resolveDeployRemote uses OS-aware defaults", () => {
  const fakeSpawn = () => ({ status: 1, stdout: "", stderr: "" });
  assert.equal(
    getDefaultDeployRemoteForPlatform("win32", {}, fakeSpawn),
    "https://github.com/owner/repo.git"
  );
  assert.equal(
    getDefaultDeployRemoteForPlatform("darwin", {}, fakeSpawn),
    "git@github.com:owner/repo.git"
  );
});

test("resolveDeployRemote supports HLM_DEPLOY_REPO custom default", () => {
  const fakeSpawn = () => ({ status: 1, stdout: "", stderr: "" });
  const env = { HLM_DEPLOY_REPO: "my-org/my-app" };
  assert.equal(
    resolveDeployRemote("win32", env, fakeSpawn),
    "https://github.com/my-org/my-app.git"
  );
  assert.equal(
    resolveDeployRemote("darwin", env, fakeSpawn),
    "git@github.com:my-org/my-app.git"
  );
});

test("resolveExpectedDeployRepo normalizes env override and fallback", () => {
  const fakeSpawn = () => ({ status: 1, stdout: "", stderr: "" });
  assert.equal(resolveExpectedDeployRepo({}, fakeSpawn), "owner/repo");
  assert.equal(
    resolveExpectedDeployRepo({
      HLM_DEPLOY_REPO: "My-Org/My-App"
    }),
    "my-org/my-app"
  );
});

test("resolveExpectedDeployRepo auto-detects repository from origin remote", () => {
  const fakeSpawn = () => ({
    status: 0,
    stdout: "git@github.com:example-owner/hlm.git\n",
    stderr: ""
  });
  assert.equal(resolveExpectedDeployRepo({}, fakeSpawn), "example-owner/hlm");
});

test("resolveExpectedDeployRepo falls back when origin detection fails", () => {
  const fakeSpawn = () => ({
    status: 1,
    stdout: "",
    stderr: "not a git repository"
  });
  assert.equal(resolveExpectedDeployRepo({}, fakeSpawn), "owner/repo");
});

test("resolveDeployRemote uses detected origin repo defaults", () => {
  const fakeSpawn = () => ({
    status: 0,
    stdout: "https://github.com/my-org/my-app.git\n",
    stderr: ""
  });
  assert.equal(
    resolveDeployRemote("win32", {}, fakeSpawn),
    "https://github.com/my-org/my-app.git"
  );
  assert.equal(
    resolveDeployRemote("darwin", {}, fakeSpawn),
    "https://github.com/my-org/my-app.git"
  );
});

test("resolveDeployRemote keeps SSH transport when origin uses SSH", () => {
  const fakeSpawn = () => ({
    status: 0,
    stdout: "git@github.com:my-org/my-app.git\n",
    stderr: ""
  });
  assert.equal(
    resolveDeployRemote("win32", {}, fakeSpawn),
    "git@github.com:my-org/my-app.git"
  );
  assert.equal(
    resolveDeployRemote("darwin", {}, fakeSpawn),
    "git@github.com:my-org/my-app.git"
  );
});

test("resolveExpectedDeployRepo prefers npm package name under same owner", () => {
  const fakeSpawn = () => ({
    status: 0,
    stdout: "git@github.com:example-owner/monorepo.git\n",
    stderr: ""
  });
  assert.equal(
    resolveExpectedDeployRepo({ npm_package_name: "hlm" }, fakeSpawn),
    "example-owner/hlm"
  );
});

test("isExpectedDeployRepo accepts canonical ssh and https remotes", () => {
  assert.equal(
    isExpectedDeployRepo("git@github.com:my-org/my-app.git", "my-org/my-app"),
    true
  );
  assert.equal(
    isExpectedDeployRepo(
      "https://github.com/my-org/my-app.git",
      "my-org/my-app"
    ),
    true
  );
  assert.equal(
    isExpectedDeployRepo(
      "https://github.com/my-org/other.git",
      "my-org/my-app"
    ),
    false
  );
});

test("normalizeRemoteRepo handles URL variants and trailing separators", () => {
  assert.equal(
    normalizeRemoteRepo("ssh://git@github.com/my-org/my-app.git"),
    "my-org/my-app"
  );
  assert.equal(
    normalizeRemoteRepo("https://github.com/my-org/my-app.git/"),
    "my-org/my-app"
  );
  assert.equal(
    normalizeRemoteRepo("https://github.com/my-org/my-app/"),
    "my-org/my-app"
  );
});

test("preflightRemoteAccess throws clear error on failed ls-remote", () => {
  const fakeSpawn = () => ({ status: 128, stderr: "Permission denied" });
  assert.throws(
    () =>
      preflightRemoteAccess(
        "git@github.com:my-org/my-app.git",
        "darwin",
        fakeSpawn
      ),
    /Deploy preflight failed/
  );
});

test("resolveDeployDir honors HLM_DEPLOY_DIR override", () => {
  const normalized = (path) => path.split(sep).join("/");
  assert.equal(
    normalized(
      resolveDeployDir({
        HLM_DEPLOY_DIR: "/custom/persistent/hlm-deploy",
        TMPDIR: "/ignored/tmp"
      })
    ),
    "/custom/persistent/hlm-deploy"
  );
});

test("resolveDeployDir follows TMPDIR -> TEMP -> TMP -> /tmp order", () => {
  const normalized = (path) => path.split(sep).join("/");
  assert.equal(
    normalized(resolveDeployDir({ TMPDIR: "/custom/tmp" })),
    "/custom/tmp/hlm-deploy"
  );
  assert.equal(
    normalized(resolveDeployDir({ TEMP: "/custom/temp" })),
    "/custom/temp/hlm-deploy"
  );
  assert.equal(
    normalized(resolveDeployDir({ TMP: "/custom/t" })),
    "/custom/t/hlm-deploy"
  );
  assert.equal(normalized(resolveDeployDir({})), "/tmp/hlm-deploy");
});

test("shouldSyncOriginRemote syncs HTTPS/SSH for same repo", () => {
  assert.equal(
    shouldSyncOriginRemote(
      "https://github.com/my-org/my-app.git",
      "git@github.com:my-org/my-app.git"
    ),
    true
  );
  assert.equal(
    shouldSyncOriginRemote(
      "git@github.com:my-org/my-app.git",
      "git@github.com:my-org/my-app.git"
    ),
    false
  );
  assert.equal(
    shouldSyncOriginRemote(
      "https://github.com/my-org/other.git",
      "git@github.com:my-org/my-app.git"
    ),
    false
  );
});

test("detectRemoteTransport resolves HTTPS and SSH remotes", () => {
  assert.equal(
    detectRemoteTransport("https://github.com/my-org/my-app.git"),
    "https"
  );
  assert.equal(
    detectRemoteTransport("git@github.com:my-org/my-app.git"),
    "ssh"
  );
  assert.equal(detectRemoteTransport("C:/tmp/remote.git"), null);
});

test("getDeployTransportMismatchWarning reports protocol mismatch", () => {
  const warning = getDeployTransportMismatchWarning(
    "https://github.com/my-org/my-app.git",
    "git@github.com:my-org/my-app.git"
  );
  assert.match(warning || "", /transport mismatch/i);
  assert.match(warning || "", /origin uses https/i);
  assert.equal(
    getDeployTransportMismatchWarning(
      "https://github.com/my-org/my-app.git",
      "https://github.com/my-org/my-app.git"
    ),
    null
  );
});

test("preflightRemoteAccess includes SSH hint on auth failure", () => {
  const fakeSpawn = () => ({
    status: 128,
    stderr: "Permission denied (publickey)"
  });
  assert.throws(
    () =>
      preflightRemoteAccess(
        "git@github.com:my-org/my-app.git",
        "darwin",
        fakeSpawn
      ),
    /HLM_DEPLOY_REMOTE=https:\/\/github\.com\/<owner>\/<repo>\.git/
  );
});

test("preflightRemoteAccess includes HTTPS token hint on auth failure", () => {
  const fakeSpawn = () => ({
    status: 128,
    stderr: "Repository not found"
  });
  assert.throws(
    () =>
      preflightRemoteAccess(
        "https://github.com/my-org/my-app.git",
        "darwin",
        fakeSpawn
      ),
    /Personal Access Token|PAT/i
  );
});
