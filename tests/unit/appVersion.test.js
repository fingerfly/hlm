import test from "node:test";
import assert from "node:assert/strict";
import { APP_VERSION, APP_BUILD, getDisplayVersion } from "../../src/config/appVersion.js";

test("app version baseline is initialized to 2.0.0 build 1", () => {
  assert.equal(APP_VERSION, "2.0.0");
  assert.equal(APP_BUILD, 1);
  assert.equal(getDisplayVersion(), "v2.0.0 (build 1)");
});
