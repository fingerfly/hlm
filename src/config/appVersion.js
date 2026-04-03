/**
 * Purpose: Define app version/build constants for UI and deploy.
 * Description:
 * - Stores semantic app version and build number.
 * - Exposes formatted display string for version badge.
 */
export const APP_VERSION = "4.12.0";
export const APP_BUILD = 1;

/**
 * Build display label used in UI version badge.
 *
 * @returns {string}
 */
export function getDisplayVersion() {
  return `v${APP_VERSION} (build ${APP_BUILD})`;
}
