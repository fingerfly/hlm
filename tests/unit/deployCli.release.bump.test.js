import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
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

function readRemoteMainFile(remotePath, filePath) {
  return spawnSync(
    "git",
    ["--git-dir", remotePath, "show", `main:${filePath}`],
    { encoding: "utf8" }
  );
}

test("deploy CLI updates semver/build and prints Chinese summary", (t) => {
  const sandboxRoot = prepareDeploySandbox();
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));
  const run = runInSandbox(sandboxRoot, "minor", "--confirm");
  assert.equal(run.status, 0);
  assert.match(run.stdout, /版本升级完成/);
  assert.match(run.stdout, /升级模式: minor/);
  assert.match(run.stdout, /应用版本: 0.4.0 -> 0.5.0/);
  assert.match(run.stdout, /构建号: 7 -> 1/);
  const appVersion = readFileSync(
    join(sandboxRoot, "src", "config", "appVersion.js"),
    "utf8"
  );
  const pkg = JSON.parse(readFileSync(join(sandboxRoot, "package.json"), "utf8"));
  const changelog = readFileSync(join(sandboxRoot, "CHANGELOG.md"), "utf8");
  assert.match(appVersion, /APP_VERSION = "0.5.0"/);
  assert.match(appVersion, /APP_BUILD = 1/);
  assert.equal(pkg.version, "0.5.0");
  assert.match(changelog, /^## \[Unreleased\]\n/m);
  assert.match(changelog, new RegExp(`^## \\[0\\.5\\.0\\] - ${today}$`, "m"));
  assert.match(changelog, /Temporary unreleased entry for deploy test\./);
  const remotePkg = readRemoteMainFile(
    getSandboxDeployRemote(sandboxRoot),
    "package.json"
  );
  assert.equal(remotePkg.status, 0);
  const remotePkgData = JSON.parse(remotePkg.stdout);
  assert.equal(remotePkgData.version, "0.5.0");
});

test("deploy CLI build mode only increments build number", (t) => {
  const sandboxRoot = prepareDeploySandbox();
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));
  const run = runInSandbox(sandboxRoot, "build", "--confirm");
  assert.equal(run.status, 0);
  assert.match(run.stdout, /版本升级完成/);
  assert.match(run.stdout, /升级模式: build/);
  assert.match(run.stdout, /应用版本: 0.4.0 -> 0.4.0/);
  assert.match(run.stdout, /构建号: 7 -> 8/);
  const appVersion = readFileSync(
    join(sandboxRoot, "src", "config", "appVersion.js"),
    "utf8"
  );
  const pkg = JSON.parse(readFileSync(join(sandboxRoot, "package.json"), "utf8"));
  const changelog = readFileSync(join(sandboxRoot, "CHANGELOG.md"), "utf8");
  assert.match(appVersion, /APP_VERSION = "0.4.0"/);
  assert.match(appVersion, /APP_BUILD = 8/);
  assert.equal(pkg.version, "0.4.0");
  assert.match(changelog, /^## \[Unreleased\] - 2026-03-09$/m);
  assert.doesNotMatch(
    changelog,
    new RegExp(`^## \\[0\\.4\\.0\\] - ${today}$`, "m")
  );
});

test("deploy CLI patch mode bumps patch and resets build", (t) => {
  const sandboxRoot = prepareDeploySandbox();
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));
  const run = runInSandbox(sandboxRoot, "patch", "--confirm");
  assert.equal(run.status, 0);
  assert.match(run.stdout, /升级模式: patch/);
  assert.match(run.stdout, /应用版本: 0.4.0 -> 0.4.1/);
  assert.match(run.stdout, /构建号: 7 -> 1/);
  const appVersion = readFileSync(
    join(sandboxRoot, "src", "config", "appVersion.js"),
    "utf8"
  );
  const pkg = JSON.parse(readFileSync(join(sandboxRoot, "package.json"), "utf8"));
  const changelog = readFileSync(join(sandboxRoot, "CHANGELOG.md"), "utf8");
  assert.match(appVersion, /APP_VERSION = "0.4.1"/);
  assert.match(appVersion, /APP_BUILD = 1/);
  assert.equal(pkg.version, "0.4.1");
  assert.match(changelog, /^## \[Unreleased\]\n/m);
  assert.match(changelog, new RegExp(`^## \\[0\\.4\\.1\\] - ${today}$`, "m"));
});

test("deploy CLI major mode bumps major and resets build", (t) => {
  const sandboxRoot = prepareDeploySandbox();
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));
  const run = runInSandbox(sandboxRoot, "major", "--confirm");
  assert.equal(run.status, 0);
  assert.match(run.stdout, /升级模式: major/);
  assert.match(run.stdout, /应用版本: 0.4.0 -> 1.0.0/);
  assert.match(run.stdout, /构建号: 7 -> 1/);
  const appVersion = readFileSync(
    join(sandboxRoot, "src", "config", "appVersion.js"),
    "utf8"
  );
  const pkg = JSON.parse(readFileSync(join(sandboxRoot, "package.json"), "utf8"));
  const changelog = readFileSync(join(sandboxRoot, "CHANGELOG.md"), "utf8");
  assert.match(appVersion, /APP_VERSION = "1.0.0"/);
  assert.match(appVersion, /APP_BUILD = 1/);
  assert.equal(pkg.version, "1.0.0");
  assert.match(changelog, /^## \[Unreleased\]\n/m);
  assert.match(changelog, new RegExp(`^## \\[1\\.0\\.0\\] - ${today}$`, "m"));
});
