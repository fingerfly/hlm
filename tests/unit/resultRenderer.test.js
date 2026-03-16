import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const rendererPath = join(here, "..", "..", "src", "app", "resultRenderer.js");

test("result renderer avoids template innerHTML summary injection path", () => {
  const source = readFileSync(rendererPath, "utf8");
  assert.equal(source.includes("summary.innerHTML"), false);
});
