import test from "node:test";
import assert from "node:assert/strict";
import {
  assertDeployMode,
  bumpSemver,
  formatDeploySummary,
  nextVersionState
} from "../../src/config/versioning.js";

test("bumpSemver handles patch/minor/major", () => {
  assert.equal(bumpSemver("0.1.0", "patch"), "0.1.1");
  assert.equal(bumpSemver("0.1.0", "minor"), "0.2.0");
  assert.equal(bumpSemver("0.1.0", "major"), "1.0.0");
});

test("nextVersionState increments build for build mode only", () => {
  const next = nextVersionState({ appVersion: "0.1.0", appBuild: 1 }, "build");
  assert.deepEqual(next, { appVersion: "0.1.0", appBuild: 2 });
});

test("nextVersionState bumps semver and resets build for release modes", () => {
  assert.deepEqual(nextVersionState({ appVersion: "0.1.0", appBuild: 8 }, "patch"), {
    appVersion: "0.1.1",
    appBuild: 1
  });
  assert.deepEqual(nextVersionState({ appVersion: "0.1.0", appBuild: 8 }, "minor"), {
    appVersion: "0.2.0",
    appBuild: 1
  });
  assert.deepEqual(nextVersionState({ appVersion: "0.1.0", appBuild: 8 }, "major"), {
    appVersion: "1.0.0",
    appBuild: 1
  });
});

test("assertDeployMode rejects unsupported mode", () => {
  assert.throws(
    () => assertDeployMode("foo"),
    /Mode must be one of: major \| minor \| patch \| build/
  );
});

test("bumpSemver throws for malformed version text", () => {
  assert.throws(() => bumpSemver("0.1", "patch"), /Invalid semver version/);
  assert.throws(() => bumpSemver("a.b.c", "minor"), /Invalid semver version/);
});

test("formatDeploySummary returns concise Chinese summary text", () => {
  const text = formatDeploySummary({
    mode: "minor",
    previous: { appVersion: "0.4.0", appBuild: 3 },
    next: { appVersion: "0.5.0", appBuild: 1 }
  });
  assert.match(text, /版本升级完成/);
  assert.match(text, /升级模式: minor/);
  assert.match(text, /应用版本: 0.4.0 -> 0.5.0/);
  assert.match(text, /构建号: 3 -> 1/);
});
