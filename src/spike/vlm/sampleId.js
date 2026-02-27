/**
 * Purpose: Normalize and identify spike sample IDs from image filenames.
 * Author: Luke WU
 */
import { basename, extname } from "node:path";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"]);

export function isSupportedImageFile(name) {
  return IMAGE_EXTS.has(extname(name).toLowerCase());
}

export function normalizeSampleId(name) {
  let id = basename(name);
  while (IMAGE_EXTS.has(extname(id).toLowerCase())) id = basename(id, extname(id));
  return id;
}
