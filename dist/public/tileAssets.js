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

/** Unicode Mahjong Tiles block U+1F000–U+1F021. */
const TILE_TO_UNICODE = Object.freeze({
  E: "\u{1F000}",
  S: "\u{1F001}",
  Wn: "\u{1F002}",
  N: "\u{1F003}",
  R: "\u{1F004}",
  G: "\u{1F005}",
  Wh: "\u{1F006}",
  "1W": "\u{1F007}",
  "2W": "\u{1F008}",
  "3W": "\u{1F009}",
  "4W": "\u{1F00A}",
  "5W": "\u{1F00B}",
  "6W": "\u{1F00C}",
  "7W": "\u{1F00D}",
  "8W": "\u{1F00E}",
  "9W": "\u{1F00F}",
  "1T": "\u{1F010}",
  "2T": "\u{1F011}",
  "3T": "\u{1F012}",
  "4T": "\u{1F013}",
  "5T": "\u{1F014}",
  "6T": "\u{1F015}",
  "7T": "\u{1F016}",
  "8T": "\u{1F017}",
  "9T": "\u{1F018}",
  "1B": "\u{1F019}",
  "2B": "\u{1F01A}",
  "3B": "\u{1F01B}",
  "4B": "\u{1F01C}",
  "5B": "\u{1F01D}",
  "6B": "\u{1F01E}",
  "7B": "\u{1F01F}",
  "8B": "\u{1F020}",
  "9B": "\u{1F021}"
});

/**
 * Return Unicode character for tile if available.
 *
 * @param {string} tileCode - Canonical tile code.
 * @returns {string|null} Unicode char or null if no mapping.
 */
export function getTileUnicode(tileCode) {
  const u = TILE_TO_UNICODE[tileCode];
  return u ? u : null;
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
