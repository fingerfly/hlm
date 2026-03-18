import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  getSandboxDeployRemote,
  prepareDeploySandbox,
  today
} from "../helpers/deploySandbox.js";

function runInSandbox(sandboxRoot, ...args) {
  return spawnSync(process.execPath, [join("scripts", "deploy.js"), ...args], {
    cwd: sandboxRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      TMPDIR: sandboxRoot,
      HLM_DEPLOY_REMOTE: getSandboxDeployRemote(sandboxRoot)
    }
  });
}

function runInSandboxWithEnv(sandboxRoot, env, ...args) {
  return spawnSync(process.execPath, [join("scripts", "deploy.js"), ...args], {
    cwd: sandboxRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      TMPDIR: sandboxRoot,
      ...env
    }
  });
}

function readRemoteMainFile(remotePath, filePath) {
  return spawnSync(
    "git",
    ["--git-dir", remotePath, "show", `main:${filePath}`],
    { encoding: "utf8" }
  );
}

test("deploy CLI supports release command with inline mode", (t) => {
  const sandboxRoot = prepareDeploySandbox();
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));
  const run = runInSandbox(sandboxRoot, "release", "minor", "--confirm");
  assert.equal(run.status, 0);
  assert.match(run.stdout, /版本升级完成/);
  assert.match(run.stdout, /升级模式: minor/);
  const appVersion = readFileSync(
    join(sandboxRoot, "src", "config", "appVersion.js"),
    "utf8"
  );
  assert.match(appVersion, /APP_VERSION = "0.5.0"/);
});

test("deploy CLI supports numeric release shortcut token", (t) => {
  const sandboxRoot = prepareDeploySandbox();
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));
  const run = runInSandbox(sandboxRoot, "release", "3", "--confirm");
  assert.equal(run.status, 0);
  assert.match(run.stdout, /升级模式: minor/);
  const appVersion = readFileSync(
    join(sandboxRoot, "src", "config", "appVersion.js"),
    "utf8"
  );
  assert.match(appVersion, /APP_VERSION = "0.5.0"/);
});

test("deploy CLI requires explicit confirm before mutating files", (t) => {
  const sandboxRoot = prepareDeploySandbox();
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));
  const run = runInSandbox(sandboxRoot, "minor");
  assert.equal(run.status, 1);
  assert.match(run.stderr, /Missing required flag: --confirm/);
  const pkg = JSON.parse(readFileSync(join(sandboxRoot, "package.json"), "utf8"));
  const appVersion = readFileSync(
    join(sandboxRoot, "src", "config", "appVersion.js"),
    "utf8"
  );
  assert.equal(pkg.version, "0.4.0");
  assert.match(appVersion, /APP_VERSION = "0.4.0"/);
});

test("deploy CLI archives changelog when source uses CRLF line endings", (t) => {
  const sandboxRoot = prepareDeploySandbox();
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));
  const changelogPath = join(sandboxRoot, "CHANGELOG.md");
  const crlfText = readFileSync(changelogPath, "utf8").replace(/\n/g, "\r\n");
  writeFileSync(changelogPath, crlfText, "utf8");
  const run = runInSandbox(sandboxRoot, "minor", "--confirm");
  assert.equal(run.status, 0);
  const changelog = readFileSync(changelogPath, "utf8");
  assert.match(changelog, /^## \[Unreleased\]\n/m);
  assert.match(changelog, new RegExp(`^## \\[0\\.5\\.0\\] - ${today}$`, "m"));
});

test("deploy CLI fails remote preflight before mutating files", (t) => {
  const sandboxRoot = prepareDeploySandbox();
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));
  const run = spawnSync(
    process.execPath,
    [join("scripts", "deploy.js"), "minor", "--confirm"],
    {
      cwd: sandboxRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        TMPDIR: sandboxRoot,
        HLM_DEPLOY_REMOTE: join(sandboxRoot, "missing-remote.git")
      }
    }
  );
  assert.equal(run.status, 1);
  assert.match(run.stderr, /Deploy preflight failed/);
  const pkg = JSON.parse(readFileSync(join(sandboxRoot, "package.json"), "utf8"));
  const appVersion = readFileSync(
    join(sandboxRoot, "src", "config", "appVersion.js"),
    "utf8"
  );
  assert.equal(pkg.version, "0.4.0");
  assert.match(appVersion, /APP_VERSION = "0.4.0"/);
});

test("deploy CLI can skip tests with --skip-tests", (t) => {
  const sandboxRoot = prepareDeploySandbox();
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));
  const pkgPath = join(sandboxRoot, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.scripts.test = "node -e \"process.exit(1)\"";
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  const run = runInSandbox(sandboxRoot, "minor", "--confirm", "--skip-tests");
  assert.equal(run.status, 0);
  const nextPkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  assert.equal(nextPkg.version, "0.5.0");
});

test("deploy CLI doctor mode reports diagnostics without file mutation", (t) => {
  const sandboxRoot = prepareDeploySandbox();
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));
  execFileSync("git", ["init"], { cwd: sandboxRoot, stdio: "pipe" });
  execFileSync(
    "git",
    ["remote", "add", "origin", "https://github.com/my-org/my-app.git"],
    { cwd: sandboxRoot, stdio: "pipe" }
  );
  const pkgBefore = readFileSync(join(sandboxRoot, "package.json"), "utf8");
  const appBefore = readFileSync(
    join(sandboxRoot, "src", "config", "appVersion.js"),
    "utf8"
  );
  const run = runInSandbox(sandboxRoot, "doctor");
  assert.equal(run.status, 0);
  assert.match(run.stdout, /Deploy doctor/i);
  assert.match(run.stdout, /Resolved deploy remote/i);
  assert.match(run.stdout, /Preflight: OK/i);
  const pkgAfter = readFileSync(join(sandboxRoot, "package.json"), "utf8");
  const appAfter = readFileSync(
    join(sandboxRoot, "src", "config", "appVersion.js"),
    "utf8"
  );
  assert.equal(pkgAfter, pkgBefore);
  assert.equal(appAfter, appBefore);
});

test("deploy CLI doctor warns on origin/deploy transport mismatch", (t) => {
  const sandboxRoot = prepareDeploySandbox();
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));
  execFileSync("git", ["init"], { cwd: sandboxRoot, stdio: "pipe" });
  execFileSync(
    "git",
    ["remote", "add", "origin", "https://github.com/my-org/my-app.git"],
    { cwd: sandboxRoot, stdio: "pipe" }
  );
  const run = runInSandboxWithEnv(
    sandboxRoot,
    { HLM_DEPLOY_REMOTE: "git@github.com:my-org/my-app.git" },
    "doctor"
  );
  assert.equal(run.status, 1);
  assert.match(run.stderr, /transport mismatch/i);
});

test("deploy CLI supports --dry-run with no writes and no push", (t) => {
  const sandboxRoot = prepareDeploySandbox();
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));
  const pkgPath = join(sandboxRoot, "package.json");
  const appVersionPath = join(sandboxRoot, "src", "config", "appVersion.js");
  const changelogPath = join(sandboxRoot, "CHANGELOG.md");
  const pkgBefore = readFileSync(pkgPath, "utf8");
  const appBefore = readFileSync(appVersionPath, "utf8");
  const changelogBefore = readFileSync(changelogPath, "utf8");
  const run = runInSandbox(sandboxRoot, "minor", "--dry-run");
  assert.equal(run.status, 0);
  assert.match(run.stdout, /Dry run/i);
  assert.match(run.stdout, /版本升级完成/);
  const pkgAfter = readFileSync(pkgPath, "utf8");
  const appAfter = readFileSync(appVersionPath, "utf8");
  const changelogAfter = readFileSync(changelogPath, "utf8");
  assert.equal(pkgAfter, pkgBefore);
  assert.equal(appAfter, appBefore);
  assert.equal(changelogAfter, changelogBefore);
  const remotePkg = readRemoteMainFile(
    getSandboxDeployRemote(sandboxRoot),
    "package.json"
  );
  assert.notEqual(remotePkg.status, 0);
});
