import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { APP_VERSION, APP_BUILD, getDisplayVersion } from "../../src/config/appVersion.js";

test("app version baseline matches package semver with build 1", () => {
  const pkg = JSON.parse(
    readFileSync(new URL("../../package.json", import.meta.url), "utf8")
  );
  assert.equal(APP_VERSION, pkg.version);
  assert.equal(APP_BUILD, 1);
  assert.equal(getDisplayVersion(), `v${pkg.version} (build 1)`);
});
