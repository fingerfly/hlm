export const APP_VERSION = "0.3.0";
export const APP_BUILD = 1;

export function getDisplayVersion() {
  return `v${APP_VERSION} (build ${APP_BUILD})`;
}
