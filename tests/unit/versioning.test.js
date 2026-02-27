import test from "node:test";
import assert from "node:assert/strict";
import { bumpSemver, nextVersionState } from "../../src/config/versioning.js";

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
