import test from "node:test";
import assert from "node:assert/strict";
import { APP_VERSION, APP_BUILD, getDisplayVersion } from "../../src/config/appVersion.js";

test("app version baseline is initialized to 2.0.2 build 1", () => {
  assert.equal(APP_VERSION, "2.0.2");
  assert.equal(APP_BUILD, 1);
  assert.equal(getDisplayVersion(), "v2.0.2 (build 1)");
});
