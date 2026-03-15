import test from "node:test";
import assert from "node:assert/strict";
import {
  getDefaultDeployRemoteForPlatform,
  isExpectedDeployRepo,
  normalizeRemoteRepo,
  preflightRemoteAccess,
  resolveDeployDir,
  resolveDeployRemote,
  shouldSyncOriginRemote
} from "../../scripts/deployRuntime.js";

test("resolveDeployRemote prefers HLM_DEPLOY_REMOTE override", () => {
  const env = { HLM_DEPLOY_REMOTE: "https://github.com/fingerfly/hlm.git" };
  assert.equal(
    resolveDeployRemote("darwin", env),
    "https://github.com/fingerfly/hlm.git"
  );
});

test("resolveDeployRemote uses OS-aware defaults", () => {
  assert.equal(
    getDefaultDeployRemoteForPlatform("win32"),
    "https://github.com/fingerfly/hlm.git"
  );
  assert.equal(
    getDefaultDeployRemoteForPlatform("darwin"),
    "git@github.com:fingerfly/hlm.git"
  );
  assert.equal(
    resolveDeployRemote("linux", {}),
    "git@github.com:fingerfly/hlm.git"
  );
});

test("isExpectedDeployRepo accepts canonical ssh and https remotes", () => {
  assert.equal(isExpectedDeployRepo("git@github.com:fingerfly/hlm.git"), true);
  assert.equal(
    isExpectedDeployRepo("https://github.com/fingerfly/hlm.git"),
    true
  );
  assert.equal(
    isExpectedDeployRepo("https://github.com/fingerfly/00_Mundo.git"),
    false
  );
});

test("normalizeRemoteRepo handles URL variants and trailing separators", () => {
  assert.equal(
    normalizeRemoteRepo("ssh://git@github.com/fingerfly/hlm.git"),
    "fingerfly/hlm"
  );
  assert.equal(
    normalizeRemoteRepo("https://github.com/fingerfly/hlm.git/"),
    "fingerfly/hlm"
  );
  assert.equal(
    normalizeRemoteRepo("https://github.com/fingerfly/hlm/"),
    "fingerfly/hlm"
  );
});

test("preflightRemoteAccess throws clear error on failed ls-remote", () => {
  const fakeSpawn = () => ({ status: 128, stderr: "Permission denied" });
  assert.throws(
    () => preflightRemoteAccess("git@github.com:fingerfly/hlm.git", "darwin", fakeSpawn),
    /Deploy preflight failed/
  );
});

test("resolveDeployDir follows TMPDIR -> TEMP -> TMP -> /tmp order", () => {
  assert.equal(
    resolveDeployDir({ TMPDIR: "/custom/tmp" }),
    "/custom/tmp/hlm-deploy"
  );
  assert.equal(
    resolveDeployDir({ TEMP: "/custom/temp" }),
    "/custom/temp/hlm-deploy"
  );
  assert.equal(resolveDeployDir({ TMP: "/custom/t" }), "/custom/t/hlm-deploy");
  assert.equal(resolveDeployDir({}), "/tmp/hlm-deploy");
});

test("shouldSyncOriginRemote syncs HTTPS/SSH for same repo", () => {
  assert.equal(
    shouldSyncOriginRemote(
      "https://github.com/fingerfly/hlm.git",
      "git@github.com:fingerfly/hlm.git"
    ),
    true
  );
  assert.equal(
    shouldSyncOriginRemote(
      "git@github.com:fingerfly/hlm.git",
      "git@github.com:fingerfly/hlm.git"
    ),
    false
  );
  assert.equal(
    shouldSyncOriginRemote(
      "https://github.com/fingerfly/other.git",
      "git@github.com:fingerfly/hlm.git"
    ),
    false
  );
});
