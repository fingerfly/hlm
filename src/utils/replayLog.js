export function createReplayLog(payload) {
  return {
    timestamp: new Date().toISOString(),
    request: payload.request,
    recognition: payload.recognition,
    scoring: payload.scoring
  };
}
