/**
 * Purpose: Apply optional image preprocessing for VLM spike runs.
 * Author: Luke WU
 */
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { Jimp } from "jimp";

function parseBool(value) {
  return ["1", "true", "yes", "on"].includes(String(value || "").toLowerCase().trim());
}

function parseNumberInRange(raw, fallback, min, max, key) {
  if (raw == null || String(raw).trim() === "") return fallback;
  const num = Number.parseFloat(String(raw));
  if (!Number.isFinite(num) || num < min || num > max) {
    throw new Error(`Invalid ${key}. Allowed range: ${min}..${max}`);
  }
  return num;
}

export function parsePreprocessConfig(env) {
  const enabled = parseBool(env.VLM_PREPROCESS);
  const config = {
    enabled,
    cropBottomRatio: parseNumberInRange(env.VLM_PRE_CROP_BOTTOM_RATIO, 0.4, 0.2, 0.8, "VLM_PRE_CROP_BOTTOM_RATIO"),
    contrast: parseNumberInRange(env.VLM_PRE_CONTRAST, 0.12, -1, 1, "VLM_PRE_CONTRAST"),
    brightness: parseNumberInRange(env.VLM_PRE_BRIGHTNESS, 0.02, -1, 1, "VLM_PRE_BRIGHTNESS")
  };
  return config;
}

export function buildBottomCropRect(width, height, bottomRatio) {
  const cropHeight = Math.max(1, Math.min(height, Math.round(height * bottomRatio)));
  return {
    x: 0,
    y: Math.max(0, height - cropHeight),
    w: width,
    h: cropHeight
  };
}

export async function preprocessImageForSpike({ imagePath, config }) {
  if (!config?.enabled) return { path: imagePath, cleanup: null, applied: false };

  const image = await Jimp.read(imagePath);
  const { width, height } = image.bitmap;
  const rect = buildBottomCropRect(width, height, config.cropBottomRatio);
  image.crop(rect).contrast(config.contrast).brightness(config.brightness);

  const tempDir = mkdtempSync(join(tmpdir(), "hlm-pre-"));
  const outPath = join(tempDir, `${basename(imagePath, extname(imagePath))}_pre.jpg`);
  await image.write(outPath);

  return {
    path: outPath,
    applied: true,
    cleanup: () => rmSync(tempDir, { recursive: true, force: true })
  };
}
