/**
 * Purpose: Convert image files to data URLs for VLM requests.
 * Author: Luke WU
 */
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, basename, join } from "node:path";
import { execFileSync } from "node:child_process";

export function toDataUrl(imagePath) {
  const map = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
  const mime = map[extname(imagePath).toLowerCase()];
  if (!mime) throw Object.assign(new Error("unsupported image"), { code: "UNSUPPORTED_IMAGE" });
  const raw = readFileSync(imagePath).toString("base64");
  return `data:${mime};base64,${raw}`;
}

export function convertHeicToJpegIfNeeded(imagePath) {
  const ext = extname(imagePath).toLowerCase();
  if (ext !== ".heic" && ext !== ".heif") return { path: imagePath, cleanup: null };
  const tempDir = mkdtempSync(join(tmpdir(), "hlm-spike-"));
  const outPath = join(tempDir, `${basename(imagePath, ext)}.jpg`);
  try {
    execFileSync("sips", ["-s", "format", "jpeg", imagePath, "--out", outPath], { stdio: "ignore" });
  } catch {
    rmSync(tempDir, { recursive: true, force: true });
    throw Object.assign(new Error("failed to convert HEIC to JPEG"), { code: "UNSUPPORTED_IMAGE" });
  }
  return { path: outPath, cleanup: () => rmSync(tempDir, { recursive: true, force: true }) };
}
