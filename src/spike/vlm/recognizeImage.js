/**
 * Purpose: Orchestrate consent-gated DeepSeek recognition for spike.
 * Author: Luke WU
 */
import { SPIKE_ERROR_CODES } from "./errorCodes.js";
import { parseJsonPayload, validateSpikeOutput } from "./schema.js";

function shouldRetryInvalidOutput(problems) {
  return Array.isArray(problems) && problems.includes("tiles must be length 14");
}

function normalizeCode(error) {
  if (error?.code === "PROVIDER_HTTP_ERROR") return SPIKE_ERROR_CODES.PROVIDER_HTTP_ERROR;
  if (error?.code === "TIMEOUT") return SPIKE_ERROR_CODES.TIMEOUT;
  if (error?.code === "UNSUPPORTED_IMAGE") return SPIKE_ERROR_CODES.UNSUPPORTED_IMAGE;
  return SPIKE_ERROR_CODES.NETWORK_ERROR;
}

async function recognizeSingleAttempt(input) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const rawText = await input.client.inferFromImage({ imageDataUrl: input.imageDataUrl, requestId: input.requestId });
    const parsed = parseJsonPayload(rawText);
    if (!parsed.ok) {
      return {
        ok: false,
        code: parsed.code,
        requestId: input.requestId,
        problems: parsed.problems,
        rawTextPreview: String(rawText || "").slice(0, 240)
      };
    }

    const checked = validateSpikeOutput(parsed.data);
    if (checked.ok) return { ok: true, requestId: input.requestId, data: parsed.data };
    if (!(attempt === 0 && shouldRetryInvalidOutput(checked.problems))) {
      return { ok: false, code: checked.code, requestId: input.requestId, problems: checked.problems };
    }
  }
  return { ok: false, code: SPIKE_ERROR_CODES.INVALID_VLM_OUTPUT, requestId: input.requestId, problems: ["tiles must be length 14"] };
}

function aggregateVotes(successes, requestId) {
  if (successes.length === 1) return { ok: true, requestId, data: successes[0].data };
  const total = successes.length;
  const tiles = [];
  const confidences = [];
  const uncertain = new Set();
  for (let i = 0; i < 14; i += 1) {
    const counts = new Map();
    const confSum = new Map();
    let hasUncertainFlag = false;
    for (const result of successes) {
      const tile = result.data.tiles[i];
      const conf = Number(result.data.confidences[i] || 0);
      counts.set(tile, (counts.get(tile) || 0) + 1);
      confSum.set(tile, (confSum.get(tile) || 0) + conf);
      if (Array.isArray(result.data.uncertainIndices) && result.data.uncertainIndices.includes(i)) hasUncertainFlag = true;
    }
    let bestTile = "";
    let bestCount = -1;
    let bestConf = -1;
    for (const [tile, count] of counts.entries()) {
      const csum = confSum.get(tile) || 0;
      if (count > bestCount || (count === bestCount && csum > bestConf)) {
        bestTile = tile;
        bestCount = count;
        bestConf = csum;
      }
    }
    tiles.push(bestTile);
    confidences.push(Number((bestConf / bestCount).toFixed(4)));
    if (hasUncertainFlag || bestCount < total) uncertain.add(i);
  }
  return { ok: true, requestId, data: { tiles, confidences, uncertainIndices: [...uncertain].sort((a, b) => a - b) } };
}

/**
 * Run DeepSeek recognition under spike policy constraints.
 * @param {{imageDataUrl:string,consentGranted:boolean,requestId:string,client:{inferFromImage:Function}}} input
 * @returns {Promise<{ok:boolean,code?:string,data?:object,requestId:string,problems?:string[]}>}
 */
export async function recognizeWithDeepSeek(input) {
  if (!input.consentGranted) {
    return { ok: false, code: SPIKE_ERROR_CODES.CONSENT_REQUIRED, requestId: input.requestId };
  }
  if (!String(input.imageDataUrl || "").startsWith("data:image/")) {
    return { ok: false, code: SPIKE_ERROR_CODES.UNSUPPORTED_IMAGE, requestId: input.requestId };
  }

  try {
    const votePasses = Number.isInteger(input.votePasses) && input.votePasses > 1 ? Math.min(input.votePasses, 5) : 1;
    if (votePasses === 1) return await recognizeSingleAttempt(input);
    const successes = [];
    let firstFailure = null;
    for (let i = 0; i < votePasses; i += 1) {
      const one = await recognizeSingleAttempt(input);
      if (one.ok) successes.push(one);
      else if (!firstFailure) firstFailure = one;
    }
    if (successes.length > 0) return aggregateVotes(successes, input.requestId);
    return firstFailure || { ok: false, code: SPIKE_ERROR_CODES.INVALID_VLM_OUTPUT, requestId: input.requestId, problems: ["vote failed"] };
  } catch (error) {
    const code = normalizeCode(error);
    if (code === SPIKE_ERROR_CODES.PROVIDER_HTTP_ERROR) {
      return {
        ok: false,
        code,
        requestId: input.requestId,
        providerHttpStatus: error?.status || null,
        providerBodyPreview: error?.providerBodyPreview || ""
      };
    }
    return { ok: false, code, requestId: input.requestId };
  }
}
