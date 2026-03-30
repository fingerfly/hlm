/**
 * Purpose: Deep-link help to a fan entry via `location.hash`.
 * Description:
 * - Parses `#fan-<REGISTRY_ID>` (and legacy `-popover` / `-modal` suffixes).
 * - Opens help (popover or modal) and expands matching `<details>`.
 */
import { FAN_LEXICON_ENTRIES } from "../src/config/fanLexiconEntries.js";
import { isDesktopHelpPopover } from "./appEventWiring.js";

const FAN_HASH = /^fan-(.+)$/;

/**
 * Resolve registry id from `location.hash` for deep links (`#fan-QING_YI_SE`
 * or legacy `#fan-QING_YI_SE-popover` / `-modal`).
 *
 * @param {string} rawHash - `location.hash` (e.g. `#fan-FOO`).
 * @returns {string|null}
 */
export function parseFanRegistryIdFromHash(rawHash) {
  if (!rawHash || rawHash === "#") return null;
  let rest = "";
  try {
    rest = decodeURIComponent(rawHash.slice(1));
  } catch {
    return null;
  }
  const m = rest.match(FAN_HASH);
  if (!m) return null;
  let id = m[1];
  if (id.endsWith("-popover")) id = id.slice(0, -"-popover".length);
  else if (id.endsWith("-modal")) id = id.slice(0, -"-modal".length);
  if (!/^[A-Z][A-Z0-9_]*$/i.test(id)) return null;
  return Object.prototype.hasOwnProperty.call(FAN_LEXICON_ENTRIES, id)
    ? id
    : null;
}

function clearFanSearchInHost(helpContentHost) {
  const input = helpContentHost.querySelector(".help-fan-search");
  if (!input || input.value === "") return;
  input.value = "";
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function scrollMotionBehavior() {
  const reduce =
    globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  return reduce ? "auto" : "smooth";
}

/**
 * Open help from `#fan-<id>` / `#fan-<id>-popover|modal` and focus entry.
 *
 * @param {{byId: Function, openHelp: Function}} deps
 * @returns {void}
 */
export function installHelpFanHashNavigation(deps) {
  const { byId, openHelp } = deps;

  const run = () => {
    const registryId = parseFanRegistryIdFromHash(globalThis.location.hash);
    if (!registryId) return;
    const moreBtn = byId("moreBtn");
    openHelp({ currentTarget: moreBtn || undefined });
    const afterOpen = () => {
      const desktop = isDesktopHelpPopover();
      const host = document.querySelector(
        desktop ? "#helpPopover .help-content" : "#helpModal .help-content"
      );
      if (!host) return;
      clearFanSearchInHost(host);
      const el = host.querySelector(
        `[data-fan-registry-id="${registryId}"]`
      );
      if (!el) return;
      el.hidden = false;
      if (el instanceof HTMLDetailsElement) el.open = true;
      el.scrollIntoView({
        block: "nearest",
        behavior: scrollMotionBehavior()
      });
    };
    globalThis.requestAnimationFrame(() => {
      globalThis.requestAnimationFrame(afterOpen);
    });
  };

  globalThis.addEventListener("hashchange", run);
  queueMicrotask(run);
}
