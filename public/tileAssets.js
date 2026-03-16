/**
 * Purpose: Provide deterministic local tile visuals and labels.
 * Description:
 * - Maps canonical tile codes to Chinese-friendly labels.
 * - Generates data-URI SVG images for tile-like card rendering.
 * - Preserves safe fallback to text labels when image is unavailable.
 */
const HONOR_LABELS = Object.freeze({
  E: "东风",
  S: "南风",
  Wn: "西风",
  N: "北风",
  R: "红中",
  G: "发财",
  Wh: "白板"
});

const SUIT_NAMES = Object.freeze({
  W: "万",
  T: "条",
  B: "筒"
});

const NUMBER_LABELS = Object.freeze([
  "",
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九"
]);

const IMAGE_CACHE = new Map();

function tileSuit(tileCode) {
  const suit = tileCode.slice(-1);
  return SUIT_NAMES[suit] ? suit : null;
}

function tileRank(tileCode) {
  const suit = tileSuit(tileCode);
  if (!suit) return null;
  return Number.parseInt(tileCode[0], 10);
}

function tileColor(tileCode) {
  if (tileCode === "R") return "#d23a3a";
  if (tileCode === "G") return "#1f8f43";
  if (tileCode === "Wh") return "#5f6b7a";
  const suit = tileSuit(tileCode);
  if (suit === "W") return "#2f2f2f";
  if (suit === "T") return "#1f8f43";
  if (suit === "B") return "#2f57c4";
  return "#2f2f2f";
}

/**
 * Return readable Chinese tile label for one canonical code.
 *
 * @param {string} tileCode - Canonical tile code.
 * @returns {string}
 */
export function getTileLabel(tileCode) {
  if (HONOR_LABELS[tileCode]) return HONOR_LABELS[tileCode];
  const suit = tileSuit(tileCode);
  const rank = tileRank(tileCode);
  if (!suit || !Number.isInteger(rank) || rank < 1 || rank > 9) {
    return tileCode;
  }
  return `${NUMBER_LABELS[rank]}${SUIT_NAMES[suit]}`;
}

/**
 * Build deterministic SVG data URI for one tile.
 *
 * @param {string} tileCode - Canonical tile code.
 * @returns {string|null}
 */
export function getTileImageDataUrl(tileCode) {
  if (!tileCode) return null;
  if (IMAGE_CACHE.has(tileCode)) return IMAGE_CACHE.get(tileCode);
  const label = getTileLabel(tileCode);
  if (label === tileCode && !HONOR_LABELS[tileCode] && !tileSuit(tileCode)) {
    return null;
  }
  const color = tileColor(tileCode);
  const svg = [
    "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='84'",
    "viewBox='0 0 64 84'>",
    "<rect x='1.5' y='1.5' width='61' height='81' rx='8'",
    "fill='#fff' stroke='#d8dee9' stroke-width='2'/>",
    "<text x='32' y='49' text-anchor='middle'",
    "font-family='Arial, sans-serif' font-size='20'",
    `fill='${color}'>${label}</text>`,
    "</svg>"
  ].join("");
  const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  IMAGE_CACHE.set(tileCode, url);
  return url;
}
