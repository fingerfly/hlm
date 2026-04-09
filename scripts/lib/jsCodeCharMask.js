/**
 * Purpose: Mark which source chars count as executable JS for brace scans.
 * Description:
 * - Skips comments, quoted strings, and template literals.
 * - Used before brace matching for function-body spans.
 */

/**
 * Advance past // line comment; mark chars non-code.
 *
 * @param {string} text
 * @param {boolean[]} isCode
 * @param {number} n
 * @param {number} i - index of first `/`
 * @returns {number} index after comment
 */
function skipLineComment(text, isCode, n, i) {
  isCode[i] = false;
  isCode[i + 1] = false;
  let j = i + 2;
  while (j < n && text[j] !== "\n") {
    isCode[j] = false;
    j += 1;
  }
  return j;
}

/**
 * Advance past C-style block comment (slash-star … star-slash).
 *
 * @param {string} text
 * @param {boolean[]} isCode
 * @param {number} n
 * @param {number} i - index of first `/`
 * @returns {number} index after comment or at n
 */
function skipBlockComment(text, isCode, n, i) {
  isCode[i] = false;
  isCode[i + 1] = false;
  let j = i + 2;
  while (j + 1 < n) {
    if (text[j] === "*" && text[j + 1] === "/") {
      isCode[j] = false;
      isCode[j + 1] = false;
      return j + 2;
    }
    isCode[j] = false;
    j += 1;
  }
  return j;
}

/**
 * Advance past `...` template; mark span non-code.
 *
 * @param {string} text
 * @param {boolean[]} isCode
 * @param {number} n
 * @param {number} i - index of opening backtick
 * @returns {number} index after closing backtick or at n
 */
function skipTemplateLiteral(text, isCode, n, i) {
  isCode[i] = false;
  let j = i + 1;
  while (j < n) {
    isCode[j] = false;
    if (text[j] === "\\" && j + 1 < n) {
      isCode[j + 1] = false;
      j += 2;
      continue;
    }
    if (text[j] === "`") {
      return j + 1;
    }
    j += 1;
  }
  return j;
}

/**
 * One char inside ' or " literal; return next index and maybe exit to code.
 *
 * @param {string} c
 * @param {number} i
 * @param {number} n
 * @param {boolean[]} isCode
 * @param {string} quote
 * @returns {{ i: number, exitCode: boolean }}
 */
function stepQuotedString(c, i, n, isCode, quote) {
  isCode[i] = false;
  if (c === "\\" && i + 1 < n) {
    isCode[i + 1] = false;
    return { i: i + 2, exitCode: false };
  }
  if (c === quote) {
    return { i: i + 1, exitCode: true };
  }
  return { i: i + 1, exitCode: false };
}

/**
 * Build mask: true where char counts as executable JS.
 *
 * @param {string} text
 * @returns {boolean[]}
 */
export function buildCodeCharMask(text) {
  const n = text.length;
  const isCode = new Array(n).fill(false);
  let state = "code";
  let i = 0;
  while (i < n) {
    const c = text[i];
    const next = text[i + 1];
    if (state === "code") {
      if (c === "/" && next === "/") {
        i = skipLineComment(text, isCode, n, i);
        continue;
      }
      if (c === "/" && next === "*") {
        i = skipBlockComment(text, isCode, n, i);
        continue;
      }
      if (c === "'") {
        state = "sq";
        isCode[i] = false;
        i += 1;
        continue;
      }
      if (c === "\"") {
        state = "dq";
        isCode[i] = false;
        i += 1;
        continue;
      }
      if (c === "`") {
        i = skipTemplateLiteral(text, isCode, n, i);
        continue;
      }
      isCode[i] = true;
      i += 1;
      continue;
    }
    if (state === "sq") {
      const r = stepQuotedString(c, i, n, isCode, "'");
      i = r.i;
      if (r.exitCode) state = "code";
      continue;
    }
    if (state === "dq") {
      const r = stepQuotedString(c, i, n, isCode, "\"");
      i = r.i;
      if (r.exitCode) state = "code";
      continue;
    }
    i += 1;
  }
  return isCode;
}
