/**
 * Purpose: Unit tests for brace-aware JS function body line counting.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { findOversizedFunctionBodies } from "../../scripts/lib/jsFunctionBodyScan.js";

const MAX = 4;

test("flags named function when body spans too many lines", () => {
  const body = Array.from({ length: MAX + 1 }, (_, i) => `  x(${i});`).join(
    "\n"
  );
  const src = `function foo() {\n${body}\n}`;
  const hits = findOversizedFunctionBodies(src, MAX);
  assert.equal(hits.length, 1);
  assert.ok(hits[0].startLine >= 1);
  assert.ok(hits[0].lineCount > MAX);
});

test("ignores braces inside single-quoted string", () => {
  const lines = ["function a() {", "  const s = '{';", "  return s;", "}"];
  const src = lines.join("\n");
  const hits = findOversizedFunctionBodies(src, MAX);
  assert.equal(hits.length, 0);
});

test("ignores braces inside block comment", () => {
  const src = [
    "function b() {",
    "  /* } { */",
    "  return 1;",
    "}"
  ].join("\n");
  const hits = findOversizedFunctionBodies(src, MAX);
  assert.equal(hits.length, 0);
});

test("counts arrow block body with nested block correctly", () => {
  const inner = Array.from({ length: MAX + 2 }, () => "  y();").join("\n");
  const src = `const k = () => {\nif (true) {\n${inner}\n}\n}`;
  const hits = findOversizedFunctionBodies(src, MAX);
  assert.equal(hits.length, 1);
  assert.ok(hits[0].lineCount > MAX);
});

test("template literal with brace-like chars does not end function early", () => {
  const cap = 12;
  const src = [
    "function c() {",
    "  const t = `hello ${",
    "    1 + 1",
    "  } there`;",
    "  return t;",
    "}"
  ].join("\n");
  const hits = findOversizedFunctionBodies(src, cap);
  assert.equal(hits.length, 0);
});

test("class method body is measured", () => {
  const body = Array.from({ length: MAX + 1 }, () => "    z();").join("\n");
  const src = `class X {\n  m() {\n${body}\n  }\n}`;
  const hits = findOversizedFunctionBodies(src, MAX);
  assert.equal(hits.length, 1);
});

test("if block brace is control block, not a separate function hit", () => {
  const highCap = 80;
  const inner = Array.from({ length: 10 }, () => "    a();").join("\n");
  const src = `function d() {\n  if (true) {\n${inner}\n  }\n}`;
  const hits = findOversizedFunctionBodies(src, highCap);
  assert.equal(hits.length, 0);
});

test("multiline function signature before body still finds brace", () => {
  const body = Array.from({ length: MAX + 1 }, () => "  r();").join("\n");
  const src = `function e(\n  a,\n  b\n) {\n${body}\n}`;
  const hits = findOversizedFunctionBodies(src, MAX);
  assert.equal(hits.length, 1);
});
