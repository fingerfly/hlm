import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

/**
 * Purpose: Build runtime-only dist artifact for Pages.
 * Description:
 * - Copies root index and runtime folders into dist.
 * - Excludes non-runtime files by construction.
 * - Keeps a deterministic output path for CI deploy.
 */
export function buildDist(rootDir = process.cwd(), outDir = join(rootDir, "dist")) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const runtimePaths = ["index.html", "public", "src"];
  for (const relativePath of runtimePaths) {
    const sourcePath = join(rootDir, relativePath);
    if (!existsSync(sourcePath)) {
      throw new Error(`Missing runtime path: ${relativePath}`);
    }
    cpSync(sourcePath, join(outDir, relativePath), { recursive: true });
  }
  return outDir;
}

if (process.argv[1] && process.argv[1].endsWith("buildDist.js")) {
  const outDir = buildDist();
  console.log(`Built runtime artifact: ${outDir}`);
}
