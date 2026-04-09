/**
 * Purpose: Splash screen version labels and auto-dismiss lifecycle.
 * Description:
 * - Writes version copy to badge and splash sublabel.
 * - Schedules dismiss with reduced-motion aware delay.
 * - Wires optional skip control; clears timer on dismiss.
 */

/**
 * Install splash UI updates, timer, and skip handler.
 *
 * @param {object} opts
 * @param {(id: string) => HTMLElement|null} opts.byId
 * @param {string} opts.versionLabel
 * @param {(q: string) => { matches?: boolean }} [opts.matchMedia]
 * @param {typeof setTimeout} [opts.setTimeout]
 * @param {typeof clearTimeout} [opts.clearTimeout]
 * @returns {void}
 */
export function installAppSplashLifecycle({
  byId,
  versionLabel,
  matchMedia = (q) => globalThis.matchMedia?.(q),
  setTimeout: setT = globalThis.setTimeout.bind(globalThis),
  clearTimeout: clearT = globalThis.clearTimeout.bind(globalThis)
}) {
  const badge = byId("versionBadge");
  if (badge) badge.textContent = `当前版本: ${versionLabel}`;
  const splashVersionEl = byId("splashVersion");
  if (splashVersionEl) splashVersionEl.textContent = `版本 ${versionLabel}`;
  const splashEl = byId("appSplash");
  let splashTimerId = null;
  function dismissSplash() {
    if (splashTimerId !== null) {
      clearT(splashTimerId);
      splashTimerId = null;
    }
    if (splashEl) splashEl.classList.add("splash-dismissed");
  }
  const reduceMotion = matchMedia?.("(prefers-reduced-motion: reduce)")
    ?.matches;
  const splashMs = reduceMotion ? 400 : 900;
  splashTimerId = setT(() => {
    splashTimerId = null;
    dismissSplash();
  }, splashMs);
  const splashSkipBtn = byId("splashSkipBtn");
  if (splashSkipBtn) {
    splashSkipBtn.addEventListener("click", () => dismissSplash());
  }
}
