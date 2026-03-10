export const APP_VERSION = "1.2.0";
export const APP_BUILD = 1;

export function getDisplayVersion() {
  return `v${APP_VERSION} (build ${APP_BUILD})`;
}
