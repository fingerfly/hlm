import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const indexPath = resolve(import.meta.dirname, "../../public/index.html");

test("index.html loads modular stylesheets", () => {
  const html = readFileSync(indexPath, "utf8");
  assert.match(html, /href="\.\/styles-base\.css"/);
  assert.match(html, /href="\.\/styles-components\.css"/);
  assert.match(html, /href="\.\/styles-modals\.css"/);
  assert.match(html, /href="\.\/styles-responsive\.css"/);
});
