/**
 * Purpose: Mount rich Chinese help content into both help containers.
 * Description:
 * - Clones one static template into popover and modal help bodies.
 * - Appends fan lexicon details from shared static entries.
 * - Uses idempotent data flag to avoid duplicate mounts.
 */
import { FAN_LEXICON_ENTRIES } from "../src/config/fanLexiconEntries.js";
import { getFanDisplayName } from "../src/rules/fanRegistry.js";

function getHelpHosts() {
  const pop = document.querySelector("#helpPopover .help-content");
  const modal = document.querySelector("#helpModal .help-content");
  return [pop, modal].filter(Boolean);
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

function appendFanDetails(region) {
  const frag = document.createDocumentFragment();
  const entries = sortFanEntries(Object.entries(FAN_LEXICON_ENTRIES));
  for (const [id, text] of entries) {
    const details = document.createElement("details");
    details.className = "help-fan-entry";
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
    if (region) appendFanDetails(region);
    host.dataset.helpMounted = "1";
  }
}
