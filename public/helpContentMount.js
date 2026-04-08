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

/**
 * Normalize lexicon payload to four help blocks.
 *
 * @param {string|object} entry
 * @returns {{
 *   brief: string,
 *   criteria: string[],
 *   pitfalls: string[],
 *   example: string
 * }}
 */
export function normalizeFanLexiconEntry(entry) {
  if (entry && typeof entry === "object") {
    return {
      brief: String(entry.brief || ""),
      criteria: Array.isArray(entry.criteria) ? entry.criteria : [],
      pitfalls: Array.isArray(entry.pitfalls) ? entry.pitfalls : [],
      example: String(entry.example || "")
    };
  }
  const text = String(entry || "");
  return {
    brief: text,
    criteria: ["按当前规则口径满足该番定义，并结合和牌条件判定。"],
    pitfalls: ["常见误判：忽略不计关系或将相似番种重复计入。"],
    example: "示例：满足该番关键结构后和牌，即可计入该番。"
  };
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
  for (const [id, raw] of entries) {
    const lex = normalizeFanLexiconEntry(raw);
    const details = document.createElement("details");
    details.className = "help-fan-entry";
    details.id = `fan-${id}-${anchorSuffix}`;
    details.dataset.fanRegistryId = id;
    const summary = document.createElement("summary");
    summary.textContent = getFanDisplayName(id) || id;
    const block = document.createElement("div");
    block.className = "help-fan-block";
    const sections = [
      ["定义", [lex.brief]],
      ["判定要点", lex.criteria],
      ["易错", lex.pitfalls],
      ["例子", [lex.example]]
    ];
    for (const [title, lines] of sections) {
      const allEmpty = lines.every((s) => !String(s || "").trim());
      if (!lines.length || allEmpty) continue;
      const h = document.createElement("h5");
      h.className = "help-fan-subtitle";
      h.textContent = title;
      if (title === "判定要点" || title === "易错") {
        const ul = document.createElement("ul");
        ul.className = "help-fan-list";
        for (const line of lines) {
          const li = document.createElement("li");
          li.textContent = line;
          ul.appendChild(li);
        }
        block.append(h, ul);
      } else {
        const p = document.createElement("p");
        p.className = "summary-text";
        p.textContent = lines[0];
        block.append(h, p);
      }
    }
    details.append(summary, block);
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
