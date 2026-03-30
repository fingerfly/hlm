/**
 * Purpose: Mount rich Chinese help content into both help containers.
 * Description:
 * - Clones one static template into popover and modal help bodies.
 * - Appends fan lexicon details from shared static entries.
 * - Search filters by summary display name; stable per-host anchor ids.
 * - Uses idempotent data flag to avoid duplicate mounts.
 */
import { FAN_LEXICON_ENTRIES } from "../src/config/fanLexiconEntries.js";
import { getFanDisplayName } from "../src/rules/fanRegistry.js";

/**
 * @param {string} displayName - Summary line (localized fan name).
 * @param {string} rawQuery - User search string.
 * @returns {boolean}
 */
export function matchesFanSearchQuery(displayName, rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  return displayName.toLowerCase().includes(q);
}

function getHelpHosts() {
  const pop = document.querySelector("#helpPopover .help-content");
  const modal = document.querySelector("#helpModal .help-content");
  return [pop, modal].filter(Boolean);
}

/** @param {HTMLElement} helpContentHost */
function fanAnchorSuffixForHost(helpContentHost) {
  const root = helpContentHost.closest("#helpPopover, #helpModal");
  return root?.id === "helpModal" ? "modal" : "popover";
}

function sortFanEntries(entries) {
  return entries.sort(([idA], [idB]) => {
    const nameA = getFanDisplayName(idA) || idA;
    const nameB = getFanDisplayName(idB) || idB;
    const byName = nameA.localeCompare(nameB, "zh-Hans");
    if (byName !== 0) return byName;
    return idA.localeCompare(idB, "zh-Hans");
  });
}

/**
 * @param {HTMLElement} region
 * @param {"popover"|"modal"} anchorSuffix
 */
function appendFanDetails(region, anchorSuffix) {
  const frag = document.createDocumentFragment();
  const entries = sortFanEntries(Object.entries(FAN_LEXICON_ENTRIES));
  for (const [id, text] of entries) {
    const details = document.createElement("details");
    details.className = "help-fan-entry";
    details.id = `fan-${id}-${anchorSuffix}`;
    details.dataset.fanRegistryId = id;
    const summary = document.createElement("summary");
    summary.textContent = getFanDisplayName(id) || id;
    const para = document.createElement("p");
    para.className = "summary-text";
    para.textContent = text;
    details.append(summary, para);
    frag.append(details);
  }
  region.append(frag);
}

/** @param {HTMLElement} helpContentHost */
function wireFanSearch(helpContentHost) {
  const input = helpContentHost.querySelector(".help-fan-search");
  const region = helpContentHost.querySelector("#helpFanLexiconRegion");
  if (!input || !region) return;
  const empty = region.querySelector(".help-fan-empty");
  const apply = () => {
    const q = input.value;
    const fanRows = region.querySelectorAll(".help-fan-entry");
    let visible = 0;
    for (const el of fanRows) {
      const sum = el.querySelector("summary");
      const name = sum ? sum.textContent : "";
      const ok = matchesFanSearchQuery(name, q);
      el.hidden = !ok;
      if (ok) visible += 1;
    }
    if (empty) {
      empty.hidden = !(q.trim() && visible === 0);
    }
  };
  input.addEventListener("input", apply);
}

/**
 * Mount rich help content into both desktop and mobile help containers.
 *
 * @param {(id: string) => HTMLElement|null} byId - Id lookup helper.
 * @returns {void}
 */
export function mountHelpContent(byId) {
  const hosts = getHelpHosts();
  if (hosts.length < 2) return;
  if (hosts.some((el) => el.dataset.helpMounted === "1")) return;
  const tpl = byId("helpArticleTemplate");
  if (!tpl || !("content" in tpl)) return;
  for (const host of hosts) {
    host.replaceChildren(document.importNode(tpl.content, true));
    const region = host.querySelector("#helpFanLexiconRegion");
    const suffix = fanAnchorSuffixForHost(host);
    if (region) appendFanDetails(region, suffix);
    wireFanSearch(host);
    host.dataset.helpMounted = "1";
  }
}
