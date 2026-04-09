import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { findOversizedFunctionBodies } from "./lib/jsFunctionBodyScan.js";

/**
 * Purpose: Enforce local file-size and width guardrails.
 * Description:
 * - Locates changed JS files under src/public/scripts.
 * - Flags long lines and oversized function bodies.
 * - Exits non-zero when any guardrail is violated.
 */
const JS_EXT = ".js";
const MAX_FUNCTION_LINES = 60;
const MAX_LINE_WIDTH = 78;
const ROOT = fileURLToPath(new URL("../", import.meta.url));

/**
 * Recursively collect JavaScript files from one directory.
 *
 * @param {string} dir - Root directory for recursion.
 * @param {string[]} [acc=[]] - Mutable result accumulator.
 * @returns {string[]}
 */
function collectJsFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".git") continue;
      collectJsFiles(full, acc);
      continue;
    }
    if (full.endsWith(JS_EXT)) acc.push(full);
  }
  return acc;
}

/**
 * Collect changed JS files scoped to hlm source areas.
 *
 * @returns {string[]}
 */
function collectChangedJsFiles() {
  const out = spawnSync("git", ["diff", "--name-only", "HEAD", "--", "."], {
    cwd: ROOT,
    encoding: "utf8"
  });
  if (out.error) {
    throw new Error(
      `git diff failed for complexity scan: ${out.error.message}`
    );
  }
  if (out.status !== 0) {
    const detail = String(out.stderr || out.stdout || "").trim();
    throw new Error(
      `git diff failed for complexity scan: ${detail}`
    );
  }
  return String(out.stdout || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.endsWith(JS_EXT))
    .map((line) => {
      if (line.startsWith("/")) return line;
      const marker = `${path.sep}hlm${path.sep}`;
      const normalized = line.replaceAll("/", path.sep);
      const idx = normalized.lastIndexOf(marker);
      if (idx >= 0) {
        const rel = normalized.slice(idx + marker.length);
        return path.join(ROOT, rel);
      }
      return path.join(ROOT, normalized);
    })
    .filter((full) => full.includes(`${path.sep}src${path.sep}`)
      || full.includes(`${path.sep}public${path.sep}`)
      || full.includes(`${path.sep}scripts${path.sep}`))
    .filter((full) => existsSync(full));
}

/**
 * Check one file for width and function-size guardrails.
 *
 * @param {string} filePath - Absolute file path.
 * @returns {string[]}
 */
function checkFile(filePath) {
  const text = readFileSync(filePath, "utf8");
  const lines = text.split("\n");
  const issues = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.length > MAX_LINE_WIDTH) {
      issues.push(`${filePath}:${i + 1} line exceeds ${MAX_LINE_WIDTH}`);
    }
  }
  for (const hit of findOversizedFunctionBodies(text, MAX_FUNCTION_LINES)) {
    const msg = `${filePath}:${hit.startLine} function exceeds`;
    issues.push(`${msg} ${MAX_FUNCTION_LINES} lines`);
  }
  return issues;
}

/**
 * Run complexity guardrail scan and set process exit code.
 *
 * @returns {void}
 */
function run() {
  const changed = collectChangedJsFiles();
  const files = changed.length > 0
    ? changed
    : [
      path.join(ROOT, "src"),
      path.join(ROOT, "public"),
      path.join(ROOT, "scripts")
    ].flatMap((root) => collectJsFiles(root));
  const allIssues = files.flatMap((f) => checkFile(f));
  if (allIssues.length > 0) {
    process.stderr.write(`${allIssues.join("\n")}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write("complexity check passed\n");
}

const isMain = Boolean(
  process.argv[1]
  && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
);

if (isMain) {
  run();
}
