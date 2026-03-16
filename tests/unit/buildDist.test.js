import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildDist } from "../../scripts/buildDist.js";

function makeSandbox() {
  const root = mkdtempSync(join(tmpdir(), "hlm-build-dist-"));
  mkdirSync(join(root, "public"), { recursive: true });
  mkdirSync(join(root, "src", "app"), { recursive: true });
  mkdirSync(join(root, "tests", "unit"), { recursive: true });
  mkdirSync(join(root, "scripts"), { recursive: true });
  writeFileSync(join(root, "index.html"), "<!doctype html>", "utf8");
  writeFileSync(join(root, "public", "index.html"), "<main></main>", "utf8");
  writeFileSync(join(root, "src", "app", "main.js"), "export const x = 1;", "utf8");
  writeFileSync(join(root, "tests", "unit", "x.test.js"), "ignored", "utf8");
  writeFileSync(join(root, "README.md"), "# ignored", "utf8");
  return root;
}

test("buildDist exports runtime-only tree", () => {
  const rootDir = makeSandbox();
  const outDir = buildDist(rootDir);
  assert.equal(readFileSync(join(outDir, "index.html"), "utf8"), "<!doctype html>");
  assert.equal(
    readFileSync(join(outDir, "public", "index.html"), "utf8"),
    "<main></main>"
  );
  assert.equal(
    readFileSync(join(outDir, "src", "app", "main.js"), "utf8"),
    "export const x = 1;"
  );
  assert.throws(() => readFileSync(join(outDir, "README.md"), "utf8"));
  assert.throws(() => readFileSync(join(outDir, "tests", "unit", "x.test.js"), "utf8"));
});
