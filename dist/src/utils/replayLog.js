/**
 * Purpose: Build replay log snapshots for audit/debug use.
 * Description:
 * - Captures timestamped request/recognition/scoring tuple.
 * - Keeps returned object serializable for diagnostics.
 */
/**
 * Create replay log payload for one evaluation.
 *
 * @param {{request: object, recognition: object, scoring: object}} payload
 * @returns {{timestamp: string, request: object, recognition: object,
 *   scoring: object}}
 */
export function createReplayLog(payload) {
  return {
    timestamp: new Date().toISOString(),
    request: payload.request,
    recognition: payload.recognition,
    scoring: payload.scoring
  };
}
