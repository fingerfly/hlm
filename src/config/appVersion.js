/**
 * Purpose: Define app version/build constants for UI and deploy.
 * Description:
 * - Stores semantic app version and build number.
 * - Exposes formatted display string for version badge.
 */
export const APP_VERSION = "4.9.1";
export const APP_BUILD = 4;

/**
 * Build display label used in UI version badge.
 *
 * @returns {string}
 */
export function getDisplayVersion() {
  return `v${APP_VERSION} (build ${APP_BUILD})`;
}
