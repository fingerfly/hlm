import test from "node:test";
import assert from "node:assert/strict";
import {
  archiveUnreleasedToRelease,
  normalizeReleaseToken,
  selectReleaseModeArg
} from "../../src/config/deployWorkflow.js";

test("normalizeReleaseToken maps numeric and text modes", () => {
  assert.equal(normalizeReleaseToken("1"), "build");
  assert.equal(normalizeReleaseToken("2"), "patch");
  assert.equal(normalizeReleaseToken("3"), "minor");
  assert.equal(normalizeReleaseToken("4"), "major");
  assert.equal(normalizeReleaseToken(" minor "), "minor");
  assert.equal(normalizeReleaseToken("unknown"), "unknown");
});

test("selectReleaseModeArg returns first valid release mode", () => {
  const args = ["--confirm", "3", "major", "--run-agent"];
  assert.equal(selectReleaseModeArg(args), "minor");
});

test("archiveUnreleasedToRelease moves body to release heading", () => {
  const source = [
    "# Changelog",
    "",
    "## [Unreleased] - 2026-03-09",
    "",
    "### Changed",
    "- Temporary unreleased entry for deploy test.",
    "",
    "## [0.4.0] - 2026-03-09",
    "",
    "### Added",
    "- Previous release baseline."
  ].join("\r\n");
  const updated = archiveUnreleasedToRelease(source, "0.5.0", "2026-03-10");
  assert.match(updated, /^## \[Unreleased\]\n/m);
  assert.match(updated, /^## \[0\.5\.0\] - 2026-03-10$/m);
  assert.match(updated, /Temporary unreleased entry for deploy test\./);
});
