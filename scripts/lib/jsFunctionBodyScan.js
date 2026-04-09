/**
 * Purpose: Brace-depth-aware function body span detection in JS source.
 * Description:
 * - Uses jsCodeCharMask for comment/string/template boundaries.
 * - Classifies `{` opens as function/method vs control blocks.
 * - Reports bodies whose inclusive line span exceeds a threshold.
 */
import { buildCodeCharMask } from "./jsCodeCharMask.js";

const BLOCK_BEFORE_PAREN = new Set([
  "if",
  "for",
  "while",
  "switch",
  "catch",
  "with"
]);

/**
 * 1-based line number for index in text.
 *
 * @param {string} text
 * @param {number} index
 * @returns {number}
 */
function lineAtIndex(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i += 1) {
    if (text[i] === "\n") line += 1;
  }
  return line;
}

/**
 * Whether c is a JS identifier continue char.
 *
 * @param {string} c
 * @returns {boolean}
 */
function isWordChar(c) {
  return /[\w$]/.test(c);
}

/**
 * Read identifier or keyword ending at endIdx (inclusive).
 *
 * @param {string} text
 * @param {number} endIdx
 * @returns {string}
 */
function readWordBackward(text, endIdx) {
  let s = endIdx;
  while (s >= 0 && isWordChar(text[s])) s -= 1;
  return text.slice(s + 1, endIdx + 1);
}

/**
 * Matching `(` index for a closing `)`, respecting code mask only.
 *
 * @param {string} text
 * @param {number} closeIdx
 * @param {boolean[]} isCode
 * @returns {number}
 */
function matchingOpenParen(text, closeIdx, isCode) {
  let depth = 0;
  for (let j = closeIdx; j >= 0; j -= 1) {
    if (!isCode[j]) continue;
    if (text[j] === ")") depth += 1;
    else if (text[j] === "(") {
      depth -= 1;
      if (depth === 0) return j;
    }
  }
  return -1;
}

/**
 * True if `{` at openBrace starts a function-like body.
 *
 * @param {string} text
 * @param {number} openBrace
 * @param {boolean[]} isCode
 * @returns {boolean}
 */
function isFunctionBodyOpen(text, openBrace, isCode) {
  if (!isCode[openBrace] || text[openBrace] !== "{") return false;
  let k = openBrace - 1;
  while (k >= 0 && /\s/.test(text[k])) k -= 1;
  if (k < 0) {
    return false;
  }
  if (
    text[k] === ">"
    && k - 1 >= 0
    && text[k - 1] === "="
    && isCode[k]
    && isCode[k - 1]
    && (k - 2 < 0 || text[k - 2] !== "=")
  ) {
    return true;
  }
  if (text[k] !== ")") {
    const w = readWordBackward(text, k);
    if (w === "else" || w === "try" || w === "finally" || w === "do") {
      return false;
    }
    return false;
  }
  const openP = matchingOpenParen(text, k, isCode);
  if (openP < 0) return false;
  let t = openP - 1;
  while (t >= 0 && /\s/.test(text[t])) t -= 1;
  const beforeParen = readWordBackward(text, t);
  if (BLOCK_BEFORE_PAREN.has(beforeParen)) return false;
  return true;
}

/**
 * Index of closing `}` matching openBrace, using code mask only.
 *
 * @param {string} text
 * @param {number} openBrace
 * @param {boolean[]} isCode
 * @returns {number}
 */
function matchingCloseBrace(text, openBrace, isCode) {
  let depth = 0;
  for (let j = openBrace; j < text.length; j += 1) {
    if (!isCode[j]) continue;
    if (text[j] === "{") depth += 1;
    else if (text[j] === "}") {
      depth -= 1;
      if (depth === 0) return j;
    }
  }
  return -1;
}

/**
 * Return spans of function bodies exceeding maxLines (inclusive line count).
 *
 * @param {string} text
 * @param {number} maxLines
 * @returns {{ startLine: number, lineCount: number }[]}
 */
export function findOversizedFunctionBodies(text, maxLines) {
  const isCode = buildCodeCharMask(text);
  const hits = [];
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] !== "{" || !isCode[i]) continue;
    if (!isFunctionBodyOpen(text, i, isCode)) continue;
    const close = matchingCloseBrace(text, i, isCode);
    if (close < 0) continue;
    const startLine = lineAtIndex(text, i);
    const endLine = lineAtIndex(text, close);
    const lineCount = endLine - startLine + 1;
    if (lineCount > maxLines) {
      hits.push({ startLine, lineCount });
    }
  }
  return hits;
}
