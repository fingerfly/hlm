import test from "node:test";
import assert from "node:assert/strict";
import { APP_VERSION, APP_BUILD, getDisplayVersion } from "../../src/config/appVersion.js";

test("app version baseline is initialized to 1.1.1 build 1", () => {
  assert.equal(APP_VERSION, "1.1.1");
  assert.equal(APP_BUILD, 1);
  assert.equal(getDisplayVersion(), "v1.1.1 (build 1)");
});
