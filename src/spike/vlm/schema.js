/**
 * Purpose: Parse and validate VLM spike JSON payload.
 * Author: Luke WU
 */
import { SPIKE_ERROR_CODES } from "./errorCodes.js";
import { isValidTileCode, normalizeTileCode } from "./tileCodes.js";

/**
 * Parse JSON payload text from model response.
 * @param {string} text - Model response expected to be JSON.
 * @returns {{ok:boolean,data?:object,code?:string,problems?:string[]}}
 */
export function parseJsonPayload(text) {
  const source = String(text || "").trim();
  const direct = tryParse(source);
  if (direct.ok) return direct;

  const fenced = extractFencedJson(source);
  if (fenced) {
    const parsedFenced = tryParse(fenced);
    if (parsedFenced.ok) return parsedFenced;
  }

  const objectLike = extractFirstObjectLike(source);
  if (objectLike) {
    const parsedObjectLike = tryParse(objectLike);
    if (parsedObjectLike.ok) return parsedObjectLike;
  }

  return {
    ok: false,
    code: SPIKE_ERROR_CODES.INVALID_VLM_OUTPUT,
    problems: ["response is not valid JSON"]
  };
}

function tryParse(text) {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false };
  }
}

function extractFencedJson(text) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return match?.[1] || null;
}

function extractFirstObjectLike(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

/**
 * Validate normalized spike output contract.
 * @param {{tiles:string[],confidences:number[],uncertainIndices:number[]}} payload
 * @returns {{ok:boolean,code?:string,problems?:string[]}}
 */
export function validateSpikeOutput(payload) {
  const problems = [];
  const normalizedTiles = [];
  if (!Array.isArray(payload.tiles) || payload.tiles.length !== 14) problems.push("tiles must be length 14");
  if (!Array.isArray(payload.confidences) || payload.confidences.length !== 14) {
    problems.push("confidences must be length 14");
  }
  if (!Array.isArray(payload.uncertainIndices)) problems.push("uncertainIndices must be an array");

  for (const tile of payload.tiles || []) {
    const normalized = normalizeTileCode(tile);
    normalizedTiles.push(normalized);
    if (!isValidTileCode(normalized)) problems.push(`invalid tile: ${tile}`);
  }
  for (const c of payload.confidences || []) if (typeof c !== "number" || c < 0 || c > 1) problems.push("confidence out of range");
  for (const i of payload.uncertainIndices || []) if (!Number.isInteger(i) || i < 0 || i > 13) problems.push("uncertain index out of range");

  if (problems.length > 0) return { ok: false, code: SPIKE_ERROR_CODES.INVALID_VLM_OUTPUT, problems };
  payload.tiles = normalizedTiles;
  return { ok: true };
}
